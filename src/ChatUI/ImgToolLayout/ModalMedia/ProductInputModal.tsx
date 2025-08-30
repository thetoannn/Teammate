import React, { useState, useEffect } from "react";

interface ProductInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect?: (product: string) => void;
  initialValue?: string;
}

const ProductInputModal: React.FC<ProductInputModalProps> = ({
  isOpen,
  onClose,
  onProductSelect,
  initialValue = "",
}) => {
  const [productName, setProductName] = useState<string>(initialValue);

  // Update input when modal opens with initial value
  useEffect(() => {
    if (isOpen) {
      setProductName(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleConfirm = () => {
    if (onProductSelect && productName.trim()) {
      onProductSelect(productName.trim());
    }
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#3D3939] rounded-xl w-[240px] max-w-sm h-fit">
      <div className="p-4 space-y-1">
        {/* Input Field */}
        <div className="relative">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tên sản phẩm"
            className="w-full bg-[#474343] text-white text-xs rounded-lg px-3 py-7 focus:outline-none focus:ring-1 focus:ring-gray-500"
            autoFocus
          />
        </div>

        {/* Button */}
        <div className="flex justify-center pt-1">
          <button
            onClick={handleConfirm}
            className="bg-[#FFFFFF]/10 hover:bg-blue-600 text-white font-medium py-2 px-23 rounded-lg transition-colors duration-200 cursor-pointer text-xs"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInputModal;
