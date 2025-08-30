import React from "react";

import {
  ProductData,
  formatProductDataToShortText,
} from "./utils/productDataFormatter";
import KiExpandArrows from "./ExpandArrow";

interface ProductToolIndicatorProps {
  aiResponse?: string;
  isVisible: boolean;
  isLoading?: boolean;
  productData?: ProductData[];
  onToggle?: () => void;
  isExpanded?: boolean;
}

const ProductToolIndicator: React.FC<ProductToolIndicatorProps> = ({
  aiResponse = "",
  isLoading = false,
  productData,
  onToggle,
  isExpanded = false,
}) => {
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const defaultProductData: ProductData[] = [
    {
      stt: 1,
      productCode: "TS001",
      productName: "Áo thun nữ không cổ màu be",
      price: "250,000đ",
      stock: 10,
      discount: "10%",
      image: "/icon-gen-img.png",
    },
    {
      stt: 2,
      productCode: "TS002",
      productName: "Áo thun nữ không cổ màu đen",
      price: "250,000đ",
      stock: 15,
      discount: "10%",
      image: "/icon-gen-img.png",
    },
    {
      stt: 3,
      productCode: "TS003",
      productName: "Áo thun nữ không cổ màu trắng",
      price: "250,000đ",
      stock: 8,
      discount: "15%",
      image: "/icon-gen-img.png",
    },
    {
      stt: 4,
      productCode: "GD001",
      productName: "Giày dép nam thể thao",
      price: "450,000đ",
      stock: 12,
      discount: "20%",
      image: "/icon-gen-img.png",
    },
    {
      stt: 5,
      productCode: "GD002",
      productName: "Giày dép nữ cao gót",
      price: "380,000đ",
      stock: 6,
      discount: "5%",
      image: "/icon-gen-img.png",
    },
  ];

  const currentProductData = productData || defaultProductData;

  const displayResponse = formatProductDataToShortText(currentProductData);
  console.log("ProductToolIndicator displayResponse @:", displayResponse);
  const truncatedResponse = displayResponse
    ? truncateText(displayResponse)
    : "";

  console.log("ProductToolIndicator rendered with response:", displayResponse);

  return (
    <div
      className={`product-tool-indicator mt-2 flex flex-col gap-2  rounded-[14px] w-full max-w-full ${
        isLoading ? "product-tool-loading" : "product-tool-default"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-[14px] transition-all duration-300 w-full max-w-full ${
          isLoading ? "product-tool-loading-container" : "product-tool-default"
        }`}
      >
        <span
          className={`text-sm transition-opacity duration-300 whitespace-nowrap flex-shrink-0 ${
            isLoading
              ? "product-tool-loading-text"
              : "product-tool-default-text text-gray-300"
          }`}
        >
          Using Tool
        </span>
        <span className="text-gray-500 flex-shrink-0">|</span>
        <img
          src="/icon-gen-img.png"
          alt="Product List"
          className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
            isLoading ? "product-tool-loading-icon" : "opacity-60"
          }`}
        />
        {truncatedResponse && (
          <span
            className={`text-sm flex-1 min-w-0 truncate transition-opacity duration-300 ${
              isLoading
                ? "product-tool-loading-text"
                : "product-tool-default-text text-gray-400"
            }`}
          >
            {truncatedResponse}
          </span>
        )}

        {isLoading && !truncatedResponse && (
          <span className="text-sm flex-1 min-w-0 truncate product-tool-loading-text">
            Processing product list request...
          </span>
        )}
        <KiExpandArrows
          onClick={onToggle || (() => {})}
          isOpen={isExpanded}
        ></KiExpandArrows>
      </div>
    </div>
  );
};

export default ProductToolIndicator;
