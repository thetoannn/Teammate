import React, { useState } from "react";

interface ImageAILayoutProps {
  onSendMessage: (message: string) => void;
}

interface Template {
  id: number;
  imageUrl: string;
  category: string;
  prompt: string;
}

const ImageAILayout: React.FC<ImageAILayoutProps> = ({ onSendMessage }) => {
  const [activeTab, setActiveTab] = useState("Tất cả");

  const recentDesigns = [
    {
      id: 1,
      imageUrl:
        "https://i.pinimg.com/736x/89/fb/3b/89fb3b6ec5171afe0f01c3adc2c72ac3.jpg",
      date: "08/08/2025",
    },
    {
      id: 2,
      imageUrl:
        "https://i.pinimg.com/736x/c6/49/4e/c6494e7c985522a8496123a211266517.jpg",
      date: "08/08/2025",
    },
    {
      id: 3,
      imageUrl:
        "https://i.pinimg.com/736x/07/a0/42/07a04264adc6c97f258b086ce9f9e8c9.jpg",
      date: "08/08/2025",
    },
    {
      id: 4,
      imageUrl:
        "https://i.pinimg.com/736x/ed/92/11/ed92113d69b0cc1c89e116cfa427df30.jpg",
      date: "08/08/2025",
    },
    {
      id: 5,
      imageUrl:
        "https://i.pinimg.com/736x/90/4f/17/904f17988eab6d9c97d87ed90fec1298.jpg  ",
      date: "08/08/2025",
    },
  ];

  // Sample template categories
  const templateCategories = [
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

  const templates = [
    {
      id: 1,
      imageUrl:
        "https://i.pinimg.com/1200x/bf/5e/7d/bf5e7d062425ee9451e2a383d4d07135.jpg",
      category: "Tất cả",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 2,
      imageUrl:
        "https://i.pinimg.com/736x/8b/cb/3d/8bcb3d86299ed1d19452933f8f0aac41.jpg",
      category: "Poster quảng cáo",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 3,
      imageUrl:
        "https://i.pinimg.com/736x/63/41/fa/6341faaabd5cffdb7ce752503a8de2b3.jpg",
      category: "Meme",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 4,
      imageUrl:
        "https://i.pinimg.com/736x/fc/b4/e1/fcb4e12a00080ae593262f99f444aac7.jpg",
      category: "Lookbook",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 5,
      imageUrl:
        "https://i.pinimg.com/736x/f5/7c/f9/f57cf99eff5adad8ff5e4f5ec4282468.jpg",
      category: "Feedback",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 6,
      imageUrl:
        "https://i.pinimg.com/736x/49/99/b9/4999b9e78f9cfda823dcbe9951107cc8.jpg",
      category: "Lookbook",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 7,
      imageUrl:
        "https://i.pinimg.com/736x/ae/37/ec/ae37ec80c7d0193199dbf61078479d52.jpg",
      category: "Feedback",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 8,
      imageUrl:
        "https://i.pinimg.com/736x/6f/03/19/6f0319c38146859936e1a96b6b3411d7.jpg",
      category: "Lookbook",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 9,
      imageUrl:
        "https://i.pinimg.com/1200x/1f/75/aa/1f75aa0823619db2aaee264a6b82e959.jpg",
      category: "Feedback",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 10,
      imageUrl:
        "https://i.pinimg.com/736x/df/b6/a7/dfb6a7212a02153fe41d69a3aa76c86f.jpg",
      category: "Lookbook",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 11,
      imageUrl:
        "https://i.pinimg.com/736x/a6/98/c6/a698c6c5fac4fa6a6b0f80c935675e62.jpg",
      category: "Feedback",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 12,
      imageUrl:
        "https://i.pinimg.com/736x/ea/e9/42/eae94271d77400a08624a3ff587910e7.jpg",
      category: "Lookbook",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 13,
      imageUrl:
        "https://i.pinimg.com/1200x/2b/a7/89/2ba78955970967560e0404892e2b3b23.jpg ",
      category: "Lookbook",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 14,
      imageUrl:
        "https://i.pinimg.com/1200x/61/e2/2c/61e22c6c73ac0de7396a5419ac07c019.jpg",
      category: "Lookbook",
      prompt: "Tạo ảnh với mẫu",
    },
    {
      id: 15,
      imageUrl:
        "https://i.pinimg.com/736x/b2/12/aa/b212aa2828e7c557b09c4712decf9669.jpg",
      category: "Lookbook",
      prompt: "Tạo ảnh với mẫu",
    },
  ];

  const handleTemplateClick = (template: Template) => {
    onSendMessage(template.prompt);
  };

  const handleNewDesignClick = () => {
    onSendMessage("Tôi muốn tạo thiết kế mới");
  };

  const filteredTemplates =
    activeTab === "Tất cả"
      ? templates
      : templates.filter((template) => template.category === activeTab);

  return (
    <div
      className="w-full text-white -mx-4 px-4  overflow-x-hidden"
      style={{ width: "calc(100% + 2rem)" }}
    >
      <div className="mb-9 pr-6">
        <h2 className="text-xl   mb-4 text-left">Thiết kế gần đây</h2>
        <div className="flex gap-8  ">
          <div
            className="flex-shrink-0 w-[230px] h-[150px] bg-[#2a2a2a] rounded-xl border-1  border-[#FFFFFF]/50 hover:border-gray-400 hover:bg-gray-800/20 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center group"
            onClick={handleNewDesignClick}
          >
            <img src="/icon-add-img.svg" alt="" />
            <span className="text-sm text-white mt-1   group-hover:text-white transition-colors">
              Thiết kế mới
            </span>
          </div>
          <div className="flex gap-8 overflow-x-hidden hover:overflow-x-auto pb-2 transition-all duration-300 recent-designs-scroll">
            {recentDesigns.map((design) => (
              <div
                key={design.id}
                className="flex-shrink-0 w-[230px] h-[150px] bg-[#2a2a2a] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 relative group"
              >
                <img
                  src={design.imageUrl}
                  alt={`Design ${design.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjM0EzQTNBIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZpbGw9IiM5Q0E0QUYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPg==";
                  }}
                />
                <div className="absolute bottom-2 left-2 bg-[#121212]/30 opacity-100 text-white text-xs px-2 py-1 rounded-[10px]">
                  Cập nhật: {design.date}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 pr-10">
        <h2 className="text-  xl mb-6  text-left">
          Các mẫu sẵn có được tạo bởi Image AI Tools
        </h2>

        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {templateCategories.map((category) => (
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
              onClick={() => handleTemplateClick(template)}
            >
              <div className="aspect-square relative">
                <img
                  src={template.imageUrl}
                  alt={`Template ${template.id}`}
                  className="w-full h-full object-cover"
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
        </div>
      </div>
    </div>
  );
};

export default ImageAILayout;
