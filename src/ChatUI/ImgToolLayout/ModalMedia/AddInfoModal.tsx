import React, { useState, useEffect } from "react";

interface AddInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateTitle?: string;
  selectedObjective?: string;
  selectedProduct?: string;
  selectedTargetAudience?: string;
  selectedRatio?: string;
  onOpenIncreaseClickModal?: () => void;
  onOpenProductInputModal?: () => void;
  onOpenTargetAudienceModal?: () => void;
  onOpenRatioModal?: () => void;
}

const AddInfoModal: React.FC<AddInfoModalProps> = ({
  isOpen,
  onClose,
  selectedTemplateTitle = "",
  selectedObjective = "",
  selectedProduct = "",
  selectedTargetAudience = "",
  selectedRatio = "",
  onOpenIncreaseClickModal,
  onOpenProductInputModal,
  onOpenTargetAudienceModal,
  onOpenRatioModal,
}) => {
  const [formData, setFormData] = useState({
    imageType: selectedTemplateTitle,
    objective: selectedObjective,
    product: selectedProduct,
    targetAudience: selectedTargetAudience,
    ratio: selectedRatio,
    mainColor: "",
    backgroundStyle: "",
    textEffects: "",
    message: "",
    attachedImage: null as File | null,
  });

  // Update objective when selectedObjective prop changes
  useEffect(() => {
    if (selectedObjective) {
      setFormData((prev) => ({
        ...prev,
        objective: selectedObjective,
      }));
    }
  }, [selectedObjective]);

  // Update product when selectedProduct prop changes
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        product: selectedProduct,
      }));
    }
  }, [selectedProduct]);

  // Update target audience when selectedTargetAudience prop changes
  useEffect(() => {
    if (selectedTargetAudience) {
      setFormData((prev) => ({
        ...prev,
        targetAudience: selectedTargetAudience,
      }));
    }
  }, [selectedTargetAudience]);

  // Update ratio when selectedRatio prop changes
  useEffect(() => {
    if (selectedRatio) {
      setFormData((prev) => ({
        ...prev,
        ratio: selectedRatio,
      }));
    }
  }, [selectedRatio]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachedImage: file,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#3D3939] rounded-lg w-full max-w-md h-fit">
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <h2 className="text-lg font-semibold text-white">Thêm thông tin</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-3  ">
        {/* Loại ảnh */}
        <div className="flex items-center gap-7 justify-end">
          <label className="flex text-white text-xs font-medium mb-1">
            Loại ảnh
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.imageType}
              onChange={(e) => handleInputChange("imageType", e.target.value)}
              placeholder="Ảnh giải trí/..."
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Mục tiêu */}
        <div className="flex items-center gap-7 justify-end">
          <label className="flex text-white text-xs font-medium mb-1">
            Mục tiêu
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.objective}
              onChange={(e) => handleInputChange("objective", e.target.value)}
              onClick={onOpenIncreaseClickModal}
              placeholder="Chọn mục tiêu"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              readOnly
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="flex items-center gap-7 justify-end">
          <label className="flex text-white text-xs font-medium mb-1">
            Sản phẩm
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.product}
              onChange={(e) => handleInputChange("product", e.target.value)}
              onClick={onOpenProductInputModal}
              placeholder="Thêm tên"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              readOnly
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Đối tượng */}
        <div className="flex items-center gap-7 justify-end">
          <label className="flex text-white text-xs font-medium mb-1">
            Đối tượng
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) =>
                handleInputChange("targetAudience", e.target.value)
              }
              onClick={onOpenTargetAudienceModal}
              placeholder="Đối tượng xem"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              readOnly
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Tỉ lệ */}
        <div className="flex items-center gap-7 justify-end">
          <label className="flex text-white text-xs font-medium mb-1">
            Tỉ lệ
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.ratio}
              onChange={(e) => handleInputChange("ratio", e.target.value)}
              onClick={onOpenRatioModal}
              placeholder="Tỉ lệ ảnh"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              readOnly
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Màu chủ đạo */}
        <div className="flex items-center gap-7">
          <label className="flex text-white text-xs font-medium mb-1">
            Màu chủ đạo
          </label>
          <div className="relative flex items-center gap-7 justify-end">
            <input
              type="text"
              value={formData.mainColor}
              onChange={(e) => handleInputChange("mainColor", e.target.value)}
              placeholder="Chọn màu"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Phong cách nền */}
        <div className="relative flex items-center gap-7 justify-end">
          <label className="flex text-white text-xs font-medium mb-1">
            Phong cách nền
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.backgroundStyle}
              onChange={(e) =>
                handleInputChange("backgroundStyle", e.target.value)
              }
              placeholder="Chọn nền"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Hiệu ứng chữ */}
        <div className="relative flex items-center justify-between">
          <label className="flex text-white text-xs font-medium mb-1">
            Hiệu ứng chữ
          </label>
          <div className="relative flex ">
            <input
              type="text"
              value={formData.textEffects}
              onChange={(e) => handleInputChange("textEffects", e.target.value)}
              placeholder="Hiệu ứng chữ"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Thông điệp */}
        <div className="relative flex items-center justify-between">
          <label className="flex text-white text-xs font-medium mb-1">
            Thông điệp
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Nội dung"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Đính kèm ảnh */}
        <div className="relative flex items-center justify-between">
          <label className="flex text-white text-xs font-medium mb-1">
            Đính kèm ảnh
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="w-[320px] bg-[#474343] text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between"
            >
              <span className="text-gray-300 text-sm">
                {formData.attachedImage
                  ? formData.attachedImage.name
                  : "Upload"}
              </span>
              <svg
                className="text-gray-400"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between p-4">
        <button className="px-4 py-2 bg-[#474343] text-white text-sm rounded-lg hover:bg-[#5A5A5A] transition-colors cursor-pointer">
          Hủy bỏ
        </button>
        <button className="px-30 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
          <img src="/icon-fantasy.svg" alt="" />
          Hoàn tất
        </button>
      </div>
    </div>
  );
};

export default AddInfoModal;
