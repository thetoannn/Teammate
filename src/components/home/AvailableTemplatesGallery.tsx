import React, { useMemo, useState } from "react";
import Image_0 from "../../assets/image/image_1.jpg";
import Image_1 from "../../assets/image/image_1.png";
import Image_2 from "../../assets/image/image_2.png";
import Image_3 from "../../assets/image/image_3.png";
import Image_4 from "../../assets/image/image_4.png";
import Image_5 from "../../assets/image/image_5.png";
import Image_6 from "../../assets/image/image_6.png";
import Image_7 from "../../assets/image/image_7.png";
import Image_8 from "../../assets/image/image_8.png";
import Image_9 from "../../assets/image/image_9.png";
import Image_10 from "../../assets/image/image_10.png";
import Image_11 from "../../assets/image/image_11.png";
import Image_12 from "../../assets/image/image_12.png";
import Image_13 from "../../assets/image/image_13.png";
import Image_14 from "../../assets/image/image_14.png";
import Image_15 from "../../assets/image/image_15.png";

export interface Template {
  id: number;
  imageUrl: string;
  category: string;
  prompt: string;
}

interface AvailableTemplatesGalleryProps {
  title?: string;
  categories?: string[];
  templates?: Template[];
  defaultTab?: string;
  onTemplateClick?: (template: Template) => void;
  className?: string;
}

const DEFAULT_CATEGORIES = [
  "Tất cả",
  "Poster quảng cáo",
  "Meme",
  "Lookbook",
  "Feedback",
  "Before_After",
  "So sánh",
  "Hướng dẫn",
  "Quà tặng",
];

const DEFAULT_TEMPLATES: Template[] = [
  { id: 1, imageUrl: Image_0, category: "Tất cả", prompt: "Tạo ảnh với mẫu" },
  {
    id: 2,
    imageUrl: Image_7,
    category: "Poster quảng cáo",
    prompt: "Tạo ảnh với mẫu",
  },
  { id: 3, imageUrl: Image_4, category: "Meme", prompt: "Tạo ảnh với mẫu" },
  { id: 4, imageUrl: Image_10, category: "Lookbook", prompt: "Tạo ảnh với mẫu" },
  { id: 5, imageUrl: Image_13, category: "Feedback", prompt: "Tạo ảnh với mẫu" },
  { id: 6, imageUrl: Image_5, category: "Lookbook", prompt: "Tạo ảnh với mẫu" },
  { id: 7, imageUrl: Image_6, category: "Feedback", prompt: "Tạo ảnh với mẫu" },
  { id: 8, imageUrl: Image_2, category: "Lookbook", prompt: "Tạo ảnh với mẫu" },
  { id: 9, imageUrl: Image_8, category: "Feedback", prompt: "Tạo ảnh với mẫu" },
  {
    id: 10,
    imageUrl: Image_9,
    category: "Lookbook",
    prompt: "Tạo ảnh với mẫu",
  },
  {
    id: 11,
    imageUrl: Image_3,
    category: "Feedback",
    prompt: "Tạo ảnh với mẫu",
  },
  {
    id: 12,
    imageUrl: Image_11,
    category: "Lookbook",
    prompt: "Tạo ảnh với mẫu",
  },
  {
    id: 13,
    imageUrl: Image_12,
    category: "Lookbook",
    prompt: "Tạo ảnh với mẫu",
  },
  {
    id: 14,
    imageUrl: Image_1,
    category: "Lookbook",
    prompt: "Tạo ảnh với mẫu",
  },
  {
    id: 15,
    imageUrl: Image_14,
    category: "Lookbook",
    prompt: "Tạo ảnh với mẫu",
  },
  // {
  //   id: 16,
  //   imageUrl: Image_15,
  //   category: "Lookbook",
  //   prompt: "Tạo ảnh với mẫu",
  // },
];

const AvailableTemplatesGallery: React.FC<AvailableTemplatesGalleryProps> = ({
  title = "Các mẫu sẵn có được tạo bởi Image AI Tools",
  categories = DEFAULT_CATEGORIES,
  templates = DEFAULT_TEMPLATES,
  defaultTab = "Tất cả",
  onTemplateClick,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const filteredTemplates = useMemo(() => {
    return activeTab === "Tất cả"
      ? templates
      : templates.filter((t) => t.category === activeTab);
  }, [activeTab, templates]);

  return (
    <div className={`text-white ${className}`}>
      <h2 className="text-xl my-8 text-left">{title}</h2>

      <div className="flex gap-2 mb-2 mt-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`flex-shrink-0 px-4 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              activeTab === category
                ? "bg-[#ff2ea1] text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white"
            }`}
            style={
              activeTab === category
                ? {
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
                : {}
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-[#2a2a2a] rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 group"
            onClick={() => onTemplateClick?.(template)}
            role="button"
            aria-label={`Chọn template ${template.id}`}
          >
            <div className="aspect-square relative">
              <img
                src={template.imageUrl}
                alt={`Template ${template.id}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjM0EzQTNBIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSIjOUNBNEFGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlRlbXBsYXRlPC90ZXh0Pgo8L3N2Zz4=";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-white/50 group-hover:bg-white/70 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#3D3939] text-white text-xs px-3 py-2 rounded-[12px]">
                  {template.prompt}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-400 py-6">
            Không có mẫu nào trong danh mục này.
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableTemplatesGallery;
