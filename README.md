# 🍉 Chém Trái Cây

Game chém trái cây chạy ngay trên trình duyệt — máy tính và điện thoại đều chơi được.

**Chơi ngay:** https://trongitservjp.github.io/traicay/

## Cách chơi
- **Máy tính:** giữ chuột trái rồi kéo để chém. **Điện thoại:** vuốt ngón tay.
- Chém 3 quả trở lên trong một nhát để ăn **combo**.
- Tránh **bom** 💣.

## Chế độ
- **Cổ điển:** 3 mạng, để rơi trái cây sẽ mất mạng, chém trúng bom là thua. Càng chơi càng khó.
- **Tốc độ 60 giây:** chém càng nhiều càng tốt, trúng bom bị trừ 10 điểm.
- **Đối kháng 2 người (online):** một người bấm *Tạo phòng mới* rồi gửi link mời (hoặc mã phòng 6 ký tự) cho bạn. Hai người nhận cùng một loạt trái cây trong 60 giây, điểm của đối thủ hiện trực tiếp, hết giờ ai nhiều điểm hơn thì thắng. Có nút *Đấu lại* và đếm tỉ số qua các trận.

Kỷ lục được lưu trên trình duyệt của từng người. Nút **Thách bạn bè** để gửi điểm kèm link cho người khác.

## Kỹ thuật
Một file `index.html` duy nhất (HTML5 Canvas + Web Audio), không cần build.

Chế độ đối kháng gửi tin nhắn qua MQTT broker công khai (`broker.emqx.io`, dự phòng `broker.hivemq.com`) bằng thư viện [mqtt.js](https://github.com/mqttjs/MQTT.js), nên không cần server riêng. Hai máy dùng chung một seed để ra cùng loạt trái cây; chỉ điểm số được gửi qua mạng.
