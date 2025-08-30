import React from "react";
import { useLocation } from "react-router-dom";
import MediaGrid from "./MediaGrid";

const TabContent = () => {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case "/data-direct/products":
      case "/data-direct":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <i className="ri-product-hunt-line text-4xl mb-4 text-gray-400"></i>
            <h3 className="text-xl font-medium mb-2">Sản phẩm</h3>
            <p className="text-gray-400 text-center">
              Nội dung sản phẩm sẽ được hiển thị ở đây
            </p>
          </div>
        );

      case "/data-direct/media":
        return <MediaGrid />;

      case "/data-direct/documents":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <i className="ri-file-text-line text-4xl mb-4 text-gray-400"></i>
            <h3 className="text-xl font-medium mb-2">Tài liệu</h3>
            <p className="text-gray-400 text-center">
              Nội dung tài liệu sẽ được hiển thị ở đây
            </p>
          </div>
        );

      case "/data-direct/knowledge":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <i className="ri-lightbulb-line text-4xl mb-4 text-gray-400"></i>
            <h3 className="text-xl font-medium mb-2">Kiến Thức</h3>
            <p className="text-gray-400 text-center">
              Nội dung kiến thức sẽ được hiển thị ở đây
            </p>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <i className="ri-product-hunt-line text-4xl mb-4 text-gray-400"></i>
            <h3 className="text-xl font-medium mb-2">Sản phẩm</h3>
            <p className="text-gray-400 text-center">
              Nội dung sản phẩm sẽ được hiển thị ở đây
            </p>
          </div>
        );
    }
  };

  return <div className="flex-1 h-full">{renderContent()}</div>;
};

export default TabContent;
