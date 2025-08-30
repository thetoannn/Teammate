import React, { useMemo, useState } from "react";

export interface Template {
  id: number;
  imageUrl: string;
  category: string;
  prompt: string;
}

interface AvailableTemplatesGalleryProps {
  title?: string;
  categories?: string[];          // nếu không truyền sẽ dùng mặc định
  templates?: Template[];         // nếu không truyền sẽ dùng dữ liệu demo
  defaultTab?: string;            // mặc định: "Tất cả"
  onTemplateClick?: (template: Template) => void; // optional
  className?: string;             // để bạn tùy chỉnh layout ngoài
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
  { id: 1,  imageUrl: "https://i.pinimg.com/1200x/bf/5e/7d/bf5e7d062425ee9451e2a383d4d07135.jpg", category: "Tất cả",          prompt: "Tạo ảnh với mẫu" },
  { id: 2,  imageUrl: "https://i.pinimg.com/736x/8b/cb/3d/8bcb3d86299ed1d19452933f8f0aac41.jpg",       category: "Poster quảng cáo", prompt: "Tạo ảnh với mẫu" },
  { id: 3,  imageUrl: "https://i.pinimg.com/736x/63/41/fa/6341faaabd5cffdb7ce752503a8de2b3.jpg",       category: "Meme",             prompt: "Tạo ảnh với mẫu" },
  { id: 4,  imageUrl: "https://i.pinimg.com/736x/fc/b4/e1/fcb4e12a00080ae593262f99f444aac7.jpg",       category: "Lookbook",         prompt: "Tạo ảnh với mẫu" },
  { id: 5,  imageUrl: "https://i.pinimg.com/736x/f5/7c/f9/f57cf99eff5adad8ff5e4f5ec4282468.jpg",       category: "Feedback",         prompt: "Tạo ảnh với mẫu" },
  { id: 6,  imageUrl: "https://i.pinimg.com/736x/49/99/b9/4999b9e78f9cfda823dcbe9951107cc8.jpg",       category: "Lookbook",         prompt: "Tạo ảnh với mẫu" },
  { id: 7,  imageUrl: "https://i.pinimg.com/736x/ae/37/ec/ae37ec80c7d0193199dbf61078479d52.jpg",       category: "Feedback",         prompt: "Tạo ảnh với mẫu" },
  { id: 8,  imageUrl: "https://i.pinimg.com/736x/6f/03/19/6f0319c38146859936e1a96b6b3411d7.jpg",       category: "Lookbook",         prompt: "Tạo ảnh với mẫu" },
  { id: 9,  imageUrl: "https://i.pinimg.com/1200x/1f/75/aa/1f75aa0823619db2aaee264a6b82e959.jpg",      category: "Feedback",         prompt: "Tạo ảnh với mẫu" },
  { id: 10, imageUrl: "https://i.pinimg.com/736x/df/b6/a7/dfb6a7212a02153fe41d69a3aa76c86f.jpg",       category: "Lookbook",         prompt: "Tạo ảnh với mẫu" },
  { id: 11, imageUrl: "https://i.pinimg.com/736x/a6/98/c6/a698c6c5fac4fa6a6b0f80c935675e62.jpg",       category: "Feedback",         prompt: "Tạo ảnh với mẫu" },
  { id: 12, imageUrl: "https://i.pinimg.com/736x/ea/e9/42/eae94271d77400a08624a3ff587910e7.jpg",       category: "Lookbook",         prompt: "Tạo ảnh với mẫu" },
  { id: 13, imageUrl: "https://i.pinimg.com/1200x/2b/a7/89/2ba78955970967560e0404892e2b3b23.jpg",      category: "Lookbook",         prompt: "Tạo ảnh với mẫu" },
  { id: 14, imageUrl: "https://i.pinimg.com/1200x/61/e2/2c/61e22c6c73ac0de7396a5419ac07c019.jpg",      category: "Lookbook",         prompt: "Tạo ảnh với mẫu" },
  { id: 15, imageUrl: "https://i.pinimg.com/736x/b2/12/aa/b212aa2828e7c557b09c4712decf9669.jpg",       category: "Lookbook",         prompt: "Tạo ảnh với mẫu" },
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
                ? "text-white"
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
            className="bg-[#2a2a2a] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 group"
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white text-xs px-2 py-1 rounded">
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
