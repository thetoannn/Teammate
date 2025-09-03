import React, { useState } from 'react';
import './ModalForm.css';

const ModalForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    imageType: 'Ảnh giải trí /...',
    target: 'Chọn mục tiêu',
    product: 'Thêm tên',
    audience: 'Đối tượng xem',
    aspectRatio: 'Tỷ lệ ảnh',
    primaryColor: 'Chọn màu',
    backgroundStyle: 'Chọn nền',
    textEffect: 'Hiệu ứng chữ',
    message: 'Nội dung',
    attachImage: 'Upload'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Thêm thông tin</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Loại ảnh */}
          <div className="form-group">
            <label className="form-label">Loại ảnh</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.imageType}
                onChange={(e) => handleInputChange('imageType', e.target.value)}
                className="dropdown-input"
                placeholder="Ảnh giải trí /..."
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Mục tiêu */}
          <div className="form-group">
            <label className="form-label">Mục tiêu</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.target}
                onChange={(e) => handleInputChange('target', e.target.value)}
                className="dropdown-input"
                placeholder="Chọn mục tiêu"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="form-group">
            <label className="form-label">Sản phẩm</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                className="dropdown-input"
                placeholder="Thêm tên"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Đối tượng */}
          <div className="form-group">
            <label className="form-label">Đối tượng</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
                className="dropdown-input"
                placeholder="Đối tượng xem"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Tỉ lệ */}
          <div className="form-group">
            <label className="form-label">Tỉ lệ</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.aspectRatio}
                onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
                className="dropdown-input"
                placeholder="Tỷ lệ ảnh"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Màu chủ đạo */}
          <div className="form-group">
            <label className="form-label">Màu chủ đạo</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                className="dropdown-input"
                placeholder="Chọn màu"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Phong cách nền */}
          <div className="form-group">
            <label className="form-label">Phong cách nền</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.backgroundStyle}
                onChange={(e) => handleInputChange('backgroundStyle', e.target.value)}
                className="dropdown-input"
                placeholder="Chọn nền"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Hiệu ứng chữ */}
          <div className="form-group">
            <label className="form-label">Hiệu ứng chữ</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.textEffect}
                onChange={(e) => handleInputChange('textEffect', e.target.value)}
                className="dropdown-input"
                placeholder="Hiệu ứng chữ"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Thông điệp */}
          <div className="form-group">
            <label className="form-label">Thông điệp</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="dropdown-input"
                placeholder="Nội dung"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Đính kèm ảnh */}
          <div className="form-group">
            <label className="form-label">Đính kèm ảnh</label>
            <div className="dropdown-container">
              <input 
                type="text" 
                value={formData.attachImage}
                onChange={(e) => handleInputChange('attachImage', e.target.value)}
                className="dropdown-input"
                placeholder="Upload"
              />
              <div className="dropdown-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2L4 4L6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Hủy bỏ
            </button>
            <button type="submit" className="submit-button">
              <div className="submit-button-content">
                <div className="submit-icon">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor"/>
                  </svg>
                </div>
                Hoàn tất
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;