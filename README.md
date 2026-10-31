# 🍉 Chém Trái Cây

Game chém trái cây chạy ngay trên trình duyệt — máy tính và điện thoại đều chơi được.

**Chơi ngay:** https://trongitservjp.github.io/traicay/

## Cách chơi
- **Máy tính:** giữ chuột trái rồi kéo để chém. **Điện thoại:** vuốt ngón tay.
- Chém 3 quả trở lên trong một nhát để ăn **combo**.
- Tránh **bom** 💣.
- **Chuỗi lửa 🔥:** chém liên tục không để rơi quả nào — từ 12 quả điểm x2, từ 30 quả điểm x3.

### Trái đặc biệt
| Trái | Hiệu ứng |
|---|---|
| ❄ Quả băng | Thời gian chậm lại 5 giây |
| ×2 Táo vàng | Nhân đôi điểm 8 giây |
| ★ Măng cụt | Mưa trái cây 4 giây |
| Sầu riêng khổng lồ | Đứng lại giữa màn hình — chém liên tục, đủ 12 nhát thưởng +15 |
| ♥ Chôm chôm *(Cổ điển)* | Hồi 1 mạng (đủ mạng thì +5 điểm) |
| 🛡 Dừa *(Cổ điển)* | Khiên đỡ được 1 quả bom |

## Chế độ
- **Cổ điển:** 3 mạng, để rơi trái cây sẽ mất mạng, chém trúng bom là thua. Cứ 25 quả lại **lên cấp** (nhanh hơn, nhiều bom hơn), mỗi cấp mở màn bằng một đợt đặc biệt lần lượt: *Mưa dưa hấu*, *Gió ngang* (trái bay ngang màn hình), *Trái tí hon* (+3 điểm/quả), *Vòng vây bom* (trái ở giữa 4 quả bom — chém chéo, +5 điểm).
- **Tốc độ 60 giây:** chém càng nhiều càng tốt, trúng bom bị trừ 10 điểm.
- **Đối kháng online 2–6 người:** một người bấm *Tạo phòng mới* rồi gửi link mời (hoặc mã phòng 6 ký tự). Mọi người vào phòng, chủ phòng 👑 bấm **Bắt đầu**. Tất cả nhận cùng một loạt trái cây trong 60 giây, điểm của nhau hiện trực tiếp, hết giờ xếp hạng 🥇🥈🥉. Combo từ 4 quả trở lên sẽ **tấn công người đang dẫn đầu**: lần lượt tặng mực che màn hình (vuốt để lau) hoặc ném 2 quả bom sang. Trên màn hình mỗi người hiện **bóng lưỡi dao của những người khác** (mờ, đúng skin của họ, kèm tên). Ai vào phòng giữa trận sẽ được vào trận sau; chủ phòng bấm *Trận mới* để đấu tiếp.

### Bảng xếp hạng chung
Hết mỗi ván Cổ điển / 60 giây, kỷ lục của bạn tự gửi lên **bảng xếp hạng chung** (top 50 mỗi chế độ). Xem trong menu **🏆 Bảng xếp hạng**, đổi tên hiển thị ngay tại đó.

### Lưỡi dao (skin)
9 lưỡi dao mở khóa bằng thành tích, chọn trong menu **🗡 Lưỡi dao**: Cổ điển, Lá chuối (chém 200 quả), Lửa (100 điểm/ván), Băng giá (5 quả băng), Sấm sét (combo 6), Sầu riêng vàng (3 sầu riêng), Hoa đào (250 điểm/ván), Cầu vồng (chuỗi 50), Bóng đêm (thắng 5 trận đối kháng).

## Kỹ thuật
Game là một file `index.html` duy nhất (HTML5 Canvas + Web Audio), không cần build, chạy trên GitHub Pages.

- **Đối kháng:** gửi tin nhắn qua MQTT broker công khai (`broker.emqx.io`, dự phòng `broker.hivemq.com`) bằng [mqtt.js](https://github.com/mqttjs/MQTT.js). Chủ phòng giữ danh sách người chơi; mọi máy dùng chung một seed để ra cùng loạt trái cây; qua mạng chỉ gửi điểm số và nét chém (tọa độ theo tỉ lệ màn hình).
- **Bảng xếp hạng:** API nhỏ trong thư mục [`server/`](server/), chạy trên Vercel tại `https://traicay-api.vercel.app/api/lb`, lưu một file JSON trong Vercel Blob (kho private). Mỗi lần ghi đều đọc bản mới nhất và ghi có điều kiện theo ETag, nên nhiều người gửi điểm cùng lúc không bị mất điểm.

Deploy lại API:
```bash
cd server
vercel deploy --prod
```
