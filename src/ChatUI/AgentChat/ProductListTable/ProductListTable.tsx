import React, { useState, useEffect } from "react";
import KiExpandArrows from "./ExpandArrow";

interface ProductData {
  stt: number;
  productCode: string;
  productName: string;
  price: string;
  stock: number;
  discount: string;
  image: string;
}

interface ProductListTableProps {
  userQuery?: string;
  aiResponse?: string;
  isLoading?: boolean;
  data?: ProductData[];
  onClose?: () => void;
}

const ProductListTable: React.FC<ProductListTableProps> = ({
  userQuery = "",
  aiResponse = "",
  isLoading = false,
  data,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"prompt" | "preview">("prompt");
  const [productData, setProductData] = useState<ProductData[]>([]);
  const agentIcon = "/icon-assistant.png";

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

  useEffect(() => {
    setProductData(data || defaultProductData);
  }, [data]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-3 bg-[#2a2a2a] border-b border-gray-600">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <img src={agentIcon} alt="" />
        </div>
        <span className="text-white font-medium text-sm sm:text-base">
          Product Management Assistant
        </span>
        <div className="flex gap-2 ml-5">
          <span className="text-gray-400 hidden sm:inline">|</span>
          <span className="text-gray-400 text-xs sm:text-sm">Using Tools</span>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <div className="flex items-center gap-1">
            <img
              src="/icon-gen-img.png"
              alt="Product AI"
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
            <span className="text-gray-400 text-xs sm:text-sm">
              Product List Tools
            </span>
          </div>
        </div>
      </div>
      {onClose && (
        <div className="flex-shrink-0">
          <KiExpandArrows onClick={onClose} isOpen={true} />
        </div>
      )}
    </div>
  );

  const renderTabs = () => (
    <div className="flex border-b border-gray-600 bg-[#1a1a1a] overflow-x-auto">
      <button
        onClick={() => setActiveTab("prompt")}
        className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
          activeTab === "prompt"
            ? "text-white border-b-2 border-white-500 bg-[#2a2a2a]"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Thông tin
      </button>
      <button
        onClick={() => setActiveTab("preview")}
        className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
          activeTab === "preview"
            ? "text-white border-b-2 border-white-500 bg-[#2a2a2a]"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Danh sách sản phẩm
      </button>
    </div>
  );

  const renderPromptContent = () => (
    <div className="p-3 sm:p-4 lg:p-6 text-white max-h-[500px] overflow-y-auto">
      <p className="mb-3 sm:mb-4 text-gray-300 text-sm sm:text-base">
        Đã tìm thấy {productData.length} sản phẩm trong hệ thống quản lý kho.
      </p>
      <p className="mb-3 sm:mb-4 text-gray-300 text-sm sm:text-base">
        Thông tin chi tiết danh sách sản phẩm:
      </p>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start gap-2">
          <span className="text-white mt-1 font-bold text-sm sm:text-base">
            1.
          </span>
          <span className="text-gray-300 text-sm sm:text-base">Tổng quan:</span>
        </div>

        <div className="ml-4 sm:ml-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Tổng số sản phẩm: {productData.length} sản phẩm
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Danh mục: Thời trang, Giày dép
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Trạng thái: Đang kinh doanh
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4">
          <span className="text-white mt-1 font-bold text-sm sm:text-base">
            2.
          </span>
          <span className="text-gray-300 text-sm sm:text-base">
            Thông tin kho hàng:
          </span>
        </div>

        <div className="ml-4 sm:ml-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Tổng tồn kho:{" "}
              {productData.reduce((sum, product) => sum + product.stock, 0)} sản
              phẩm
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Sản phẩm có khuyến mãi:{" "}
              {productData.filter((p) => p.discount !== "0%").length} sản phẩm
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Cập nhật lần cuối: {formatDate(new Date().toISOString())}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4">
          <span className="text-white mt-1 font-bold text-sm sm:text-base">
            3.
          </span>
          <span className="text-gray-300 text-sm sm:text-base">
            Chức năng hỗ trợ:
          </span>
        </div>

        <div className="ml-4 sm:ml-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Xem chi tiết từng sản phẩm
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Theo dõi tình trạng tồn kho
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Quản lý giá bán và khuyến mãi
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewContent = () => (
    <div className="p-3 sm:p-4 lg:p-6 text-white max-h-[500px] overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold text-sm sm:text-base">
            Danh sách sản phẩm
          </h4>
          <div className="text-gray-400 text-xs sm:text-sm">
            {productData.length} sản phẩm
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#7C224A] text-nowrap">
                <th className="border border-[#1E1E1E] px-2 py-2 text-white text-xs font-normal ">
                  STT
                </th>
                <th className="border border-[#1E1E1E] px-2 py-2 text-white text-xs font-normal  ">
                  Mã sản phẩm
                </th>
                <th className="border border-[#1E1E1E] px-2 py-2 text-white text-xs font-normal  ">
                  Tên sản phẩm
                </th>
                <th className="border border-[#1E1E1E] px-2 py-2 text-white text-xs font-normal  ">
                  Giá bán
                </th>
                <th className="border border-[#1E1E1E] px-2 py-2 text-white text-xs font-normal  ">
                  Tồn kho
                </th>
                <th className="border border-[#1E1E1E] px-2 py-2 text-white text-xs font-normal   ">
                  Khuyến mãi
                </th>
                <th className="border border-[#1E1E1E] px-2 py-2 text-white text-xs font-normal  ">
                  Ảnh sản phẩm
                </th>
              </tr>
            </thead>
            <tbody>
              {productData.map((product, index) => (
                <tr
                  key={index}
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors"
                >
                  <td className="border border-[#1E1E1E] px-2 py-2 text-center text-white text-xs font-normal ">
                    {String(product.stt).padStart(2, "0")}
                  </td>
                  <td className="border border-[#1E1E1E] px-2 py-2 text-center text-white text-xs font-normal  ">
                    {product.productCode}
                  </td>
                  <td className="border border-[#1E1E1E] px-2 py-2 text-white text-xs font-normal ">
                    {product.productName}
                  </td>
                  <td className="border border-[#1E1E1E] px-2 py-2 text-center text-white text-xs font-normal ">
                    {product.price}
                  </td>
                  <td className="border border-[#1E1E1E] px-2 py-2 text-center text-white text-xs font-normal ">
                    {product.stock}
                  </td>
                  <td className="border border-[#1E1E1E] px-2 py-2 text-center text-white text-xs font-normal ">
                    {product.discount}
                  </td>
                  <td className="border border-[#1E1E1E] px-2 py-2 text-center">
                    <div className="flex justify-center">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded border border-gray-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/img-not-found.png";
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="p-6 sm:p-8 lg:p-12 text-center">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
      <p className="text-gray-300 text-sm sm:text-base">
        Đang tải danh sách sản phẩm...
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full bg-[#1f1f1f] border border-gray-600 rounded-lg shadow-lg overflow-hidden">
        {renderHeader()}
        {renderTabs()}
        <div className="min-h-[200px] sm:min-h-[300px]">
          {renderLoadingState()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1f1f1f] border border-gray-600 rounded-lg shadow-lg overflow-hidden">
      {renderHeader()}
      {renderTabs()}
      <div className="min-h-[200px] sm:min-h-[300px]">
        {activeTab === "prompt"
          ? renderPromptContent()
          : renderPreviewContent()}
      </div>
    </div>
  );
};

export default ProductListTable;
