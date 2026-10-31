// Bảng xếp hạng chung của game Chém Trái Cây.
// GET  /api/lb  -> { classic: [...], arcade: [...] } (top 50 mỗi chế độ)
// POST /api/lb  { id, name, mode, score } -> lưu điểm cao nhất của người chơi, trả về hạng
// Dữ liệu là một file JSON trong Vercel Blob. Mỗi người chỉ giữ điểm cao nhất của mình.
// Đọc thẳng từ kho (bỏ qua CDN) và ghi có điều kiện theo ETag, để 2 người gửi cùng lúc không đè mất điểm của nhau.
import { put, get, BlobPreconditionFailedError } from '@vercel/blob';

const KEY = 'leaderboard.json';
const TOP = 50;
const MAX_SCORE = { classic: 20000, arcade: 10000 }; // chặn bớt điểm giả quá vô lý
// Dùng hẳn token của kho; trên Vercel còn có VERCEL_OIDC_TOKEN, để thư viện tự chọn thì get() không tìm thấy file
const AUTH = { token: process.env.BLOB_READ_WRITE_TOKEN };

// Băm id người chơi để trả ra ngoài: máy người chơi tự nhận ra dòng của mình mà không lộ id thật
function hashId(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// Trả về { board, etag }; etag = null khi chưa có ai gửi điểm
async function readBoard() {
  const r = await get(KEY, { ...AUTH, access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) return { board: { classic: [], arcade: [] }, etag: null };
  const d = JSON.parse(await new Response(r.stream).text());
  return {
    board: { classic: Array.isArray(d.classic) ? d.classic : [], arcade: Array.isArray(d.arcade) ? d.arcade : [] },
    etag: r.blob.etag.replace(/^W\//, ''), // trên Vercel phản hồi bị nén nên ETag thành dạng yếu W/"..."; ifMatch cần dạng thường
  };
}

// Áp điểm mới vào bảng; trả về true nếu bảng thay đổi
function apply(board, mode, id, name, score) {
  const list = board[mode];
  const mine = list.find(e => e.id === id);
  if (mine && score <= mine.score) {
    if (mine.name === name) return false;
    mine.name = name; // chỉ đổi tên
    return true;
  }
  const next = list.filter(e => e.id !== id);
  next.push({ id, name, score, t: Date.now() });
  next.sort((x, y) => y.score - x.score || x.t - y.t);
  const kept = next.slice(0, TOP);
  if (!kept.some(e => e.id === id) && !mine) return false; // không đủ điểm vào top
  board[mode] = kept;
  return true;
}

const publicView = board => ({
  classic: board.classic.map(e => ({ h: hashId(e.id), name: e.name, score: e.score, t: e.t })),
  arcade: board.arcade.map(e => ({ h: hashId(e.id), name: e.name, score: e.score, t: e.t })),
});

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const { board } = await readBoard();
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
    return res.status(200).json(publicView(board));
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const b = parseBody(req);
  const mode = String(b.mode || '');
  const score = Math.floor(Number(b.score));
  const id = String(b.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 32);
  const name = String(b.name || '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, 14) || 'Ẩn danh';
  if (!MAX_SCORE[mode] || id.length < 8 || !(score > 0) || score > MAX_SCORE[mode]) {
    return res.status(400).json({ error: 'invalid' });
  }

  let board;
  for (let attempt = 0; ; attempt++) {
    const cur = await readBoard();
    board = cur.board;
    if (!apply(board, mode, id, name, score)) break;
    try {
      await put(KEY, JSON.stringify(board), {
        ...AUTH, access: 'private', addRandomSuffix: false, contentType: 'application/json',
        ...(cur.etag ? { ifMatch: cur.etag } : {}), // file chưa có thì put không cho ghi đè
      });
      break;
    } catch (e) {
      // có người vừa ghi chen vào: đọc lại rồi áp lại điểm
      const conflict = e instanceof BlobPreconditionFailedError || /already exists/i.test(e.message || '');
      if (!conflict || attempt >= 9) return res.status(503).json({ error: 'busy' });
      await new Promise(r => setTimeout(r, 40 + Math.random() * 200)); // chờ ngẫu nhiên để không giành nhau tiếp
    }
  }
  const idx = board[mode].findIndex(e => e.id === id);
  const full = board[mode].length >= TOP;
  return res.status(200).json({
    rank: idx >= 0 ? idx + 1 : null,
    need: idx < 0 && full ? board[mode][TOP - 1].score + 1 : null,
    board: publicView(board),
  });
}
