# Modal Form Component

Component React được tạo dựa trên thiết kế Figma với đầy đủ các tính năng và styling chính xác.

## Tính năng

- ✅ Modal form với header "Thêm thông tin"
- ✅ 10 trường input/dropdown theo thiết kế Figma
- ✅ Nút đóng (X) ở góc phải header
- ✅ 2 nút action: "Hủy bỏ" và "Hoàn tất"
- ✅ Styling chính xác theo Figma (màu sắc, kích thước, shadow)
- ✅ Responsive design
- ✅ Form state management
- ✅ Hover effects và transitions

## Cấu trúc Form Fields

1. **Loại ảnh** - Input với placeholder "Ảnh giải trí /..."
2. **Mục tiêu** - Input với placeholder "Chọn mục tiêu"
3. **Sản phẩm** - Input với placeholder "Thêm tên"
4. **Đối tượng** - Input với placeholder "Đối tượng xem"
5. **Tỉ lệ** - Input với placeholder "Tỷ lệ ảnh"
6. **Màu chủ đạo** - Input với placeholder "Chọn màu"
7. **Phong cách nền** - Input với placeholder "Chọn nền"
8. **Hiệu ứng chữ** - Input với placeholder "Hiệu ứng chữ"
9. **Thông điệp** - Input với placeholder "Nội dung"
10. **Đính kèm ảnh** - Input với placeholder "Upload"

## Cài đặt và Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

## Sử dụng Component

```jsx
import ModalForm from './ModalForm';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Mở Modal
      </button>
      
      <ModalForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

## Props

- `isOpen` (boolean): Điều khiển hiển thị modal
- `onClose` (function): Callback khi đóng modal

## Styling

Component sử dụng CSS thuần với các đặc điểm:
- Background: #3D3939 (màu xám đậm)
- Border radius: 12px
- Drop shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
- Input background: rgba(255, 255, 255, 0.05)
- Button gradient: linear-gradient(90deg, #43B0FF 0%, #2866CC 100%)

## Responsive

Component tự động responsive trên các thiết bị mobile với:
- Layout chuyển từ horizontal sang vertical
- Buttons stack vertically
- Padding và spacing được điều chỉnh phù hợp