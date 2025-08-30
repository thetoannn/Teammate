import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "products", label: "Sản phẩm", path: "/data-direct/products" },
    { id: "media", label: "Ảnh/Video", path: "/data-direct/media" },
    { id: "documents", label: "Tài liệu", path: "/data-direct/documents" },
    { id: "knowledge", label: "Kiến Thức", path: "/data-direct/knowledge" },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const isActiveTab = (path: string) => {
    return (
      location.pathname === path ||
      (location.pathname === "/data-direct" && path === "/data-direct/products")
    );
  };

  return (
    <div className="flex items-center space-x-1 mt-3 mb-4 px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.path)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer duration-200 ${
            isActiveTab(tab.path)
              ? "bg-white text-black"
              : "text-white hover:bg-white/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;
