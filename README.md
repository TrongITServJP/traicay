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

## Chế độ
- **Cổ điển:** 3 mạng, để rơi trái cây sẽ mất mạng, chém trúng bom là thua. Càng chơi càng khó.
- **Tốc độ 60 giây:** chém càng nhiều càng tốt, trúng bom bị trừ 10 điểm.
- **Đối kháng 2 người (online):** một người bấm *Tạo phòng mới* rồi gửi link mời (hoặc mã phòng 6 ký tự) cho bạn. Hai người nhận cùng một loạt trái cây trong 60 giây, điểm của đối thủ hiện trực tiếp, hết giờ ai nhiều điểm hơn thì thắng. Combo từ 4 quả trở lên sẽ **tấn công đối thủ**: lần lượt tặng mực che màn hình (vuốt để lau) hoặc ném 2 quả bom sang. Có nút *Đấu lại* và đếm tỉ số qua các trận.

Kỷ lục được lưu trên trình duyệt của từng người. Nút **Thách bạn bè** để gửi điểm kèm link cho người khác.

## Kỹ thuật
Một file `index.html` duy nhất (HTML5 Canvas + Web Audio), không cần build.

Chế độ đối kháng gửi tin nhắn qua MQTT broker công khai (`broker.emqx.io`, dự phòng `broker.hivemq.com`) bằng thư viện [mqtt.js](https://github.com/mqttjs/MQTT.js), nên không cần server riêng. Hai máy dùng chung một seed để ra cùng loạt trái cây; chỉ điểm số được gửi qua mạng.
