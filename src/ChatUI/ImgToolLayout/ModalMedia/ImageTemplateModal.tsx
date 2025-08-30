import React from "react";

interface ImageTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
  onOpenDualModal?: (templateTitle: string) => void;
}

const ImageTemplateModal: React.FC<ImageTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onOpenDualModal,
}) => {
  const backgroundImages = [
    "https://i.pinimg.com/1200x/ec/0d/68/ec0d68655a3fb2b4ad922ca0a57e7762.jpg",
    "https://i.pinimg.com/736x/eb/20/c9/eb20c96079531f6d0b0d29d606ca1939.jpg",
    "https://i.pinimg.com/736x/55/5e/a8/555ea851d0dcc269342a2bbc8ebaefa6.jpg",
    "https://i.pinimg.com/736x/fc/b4/e1/fcb4e12a00080ae593262f99f444aac7.jpg",
    "https://i.pinimg.com/736x/4d/d6/4a/4dd64a44547de867141f36be90f797bb.jpg",
    "https://i.pinimg.com/736x/32/61/9a/32619a2b22e68d15309c73ed74ba31af.jpg",
    "https://i.pinimg.com/1200x/bf/d1/3c/bfd13c5eee44d44d1d096f0a06323035.jpg",
    "https://i.pinimg.com/736x/b2/6d/04/b26d048d1eefd00147f980fdd7bab497.jpg",
    "https://i.pinimg.com/736x/f6/49/bf/f649bfd8274672fcd605e19220b8d050.jpg",
    "https://yt3.ggpht.com/NgRD58IPexVgpT42wC9__whfT2A0ftGWiRu8adoDFqGj2tSZsoywLQz31zZ9m3tsJPH3Kv9wgM7TMbA=s1080-c-fcrop64=1,00000000ffffffff-rw-nd-v1",
    "https://i.pinimg.com/1200x/f9/2e/65/f92e651bc500b03fcb017e290c78c02f.jpg",
    "https://i.pinimg.com/736x/6e/da/4a/6eda4a77ada29bdc75d6fc89c88fa284.jpg",
    "https://i.pinimg.com/736x/26/97/be/2697bebfe3427a012061291db571f50d.jpg",
    "https://i.pinimg.com/736x/b9/bb/0d/b9bb0dad429eb5edbe5f533ea6c278be.jpg",
    "https://i.pinimg.com/736x/00/66/35/006635331f9d6b90f757f4f120bf7bb6.jpg",
  ];

  const templates = [
    {
      id: 1,
      type: "infographic",
      title: "Giáo dục Infographic",
      subtitle: "Chia sẻ giá trị",
      description: "Truyền kiến thức ngắn gọn, dễ lưu",
      height: 200,
      backgroundImage: backgroundImages[0],
    },
    {
      id: 2,
      type: "quote",
      title: "Trước - Sau",
      subtitle: "",
      description: "Chứng minh hiệu quả",
      height: 200,
      backgroundImage: backgroundImages[1],
    },
    {
      id: 3,
      type: "fashion",
      title: "Lookbook Showcase",
      subtitle: "",
      description: "Trình bày danh mục, hình ảnh đẹp",
      height: 140,
      backgroundImage: backgroundImages[2],
    },
    {
      id: 4,
      type: "motivation",
      title: "Truyền cảm hứng",
      subtitle: "Khơi gợi cảm xúc ",
      description: "",
      height: 160,
      backgroundImage: backgroundImages[3],
    },
    {
      id: 5,
      title: "Nhắc lại thương hiệu Nhận diện",
      subtitle: "",
      description: "Ghi nhớ thương hiệu",
      height: 160,
      backgroundImage: backgroundImages[4],
    },
    {
      id: 6,
      type: "comparison",
      title: "Quà Tặng / Lead Magnet",
      subtitle: "",
      description: "Thu lead",
      height: 220,
      backgroundImage: backgroundImages[5],
    },
    {
      id: 7,
      type: "fashion",
      title: "Lookbook Showcase",
      subtitle: "",
      description: "Trình bày danh mục, hình ảnh đẹp",
      height: 200,
      backgroundImage: backgroundImages[6],
    },
    {
      id: 8,
      type: "product",
      title: "Poster quảng cáo CTA",
      subtitle: "",
      description: "Thúc đẩy hành động nhanh",
      height: 220,
      backgroundImage: backgroundImages[7],
    },
    {
      id: 9,
      type: "time",
      title: "Countdown Khẩn cấp ",
      subtitle: "",
      description: "Tạo FOMO",
      height: 120,
      backgroundImage: backgroundImages[8],
    },
    {
      id: 10,
      type: "branding",
      title: "Feedback Review KH",
      subtitle: "",
      description: "Chứng thực xã hội",
      height: 220,
      backgroundImage: backgroundImages[9],
    },
    {
      id: 11,
      type: "business",
      title: "Thông báo Tin tức Sự kiện",
      subtitle: "",
      description: "Trung bày, ra mắt sản phẩm mới",
      height: 152,
      backgroundImage: backgroundImages[10],
    },
    {
      id: 12,
      type: "branding",
      title: "Feedback Review KH",
      subtitle: "",
      description: "Chứng thực xã hội",
      height: 168,
      backgroundImage: backgroundImages[11],
    },
    {
      id: 13,
      type: "business",
      title: "Câu chuyện thương hiệu",
      subtitle: "",
      description: "Tăng thiện cảm & nhận diện",

      height: 228,
      backgroundImage: backgroundImages[12],
    },
    {
      id: 14,
      type: "tutorial",
      title: "Giải trí Tăng tương tác",
      subtitle: "",
      description: "Kích hoạt bình luận/like",
      height: 180,
      backgroundImage: backgroundImages[13],
    },
    {
      id: 15,
      type: "event",
      title: "Hướng dẫn Quy trình",
      subtitle: "",
      description: "Giảm rào cản",
      height: 132,
      backgroundImage: backgroundImages[14],
    },
  ];

  // Helper function to get responsive text sizes based on card height
  const getTextSizes = (height: number) => {
    if (height <= 130) {
      return {
        title: "text-xs font-bold",
        subtitle: "text-xs",
        description: "text-xs",
        padding: "p-2",
        buttonSize: "py-1 px-10 text-xs",
      };
    } else if (height <= 160) {
      return {
        title: "text-sm font-bold",
        subtitle: "text-xs",
        description: "text-xs",
        padding: "p-3",
        buttonSize: "py-1.5 px-10 text-sm",
      };
    } else {
      return {
        title: "text-base font-bold",
        subtitle: "text-sm",
        description: "text-sm",
        padding: "p-4",
        buttonSize: "py-2 px-13 text-sm",
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#3D3939] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-white">Chọn loại ảnh</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)]">
          <div
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4"
            style={{ columnFill: "balance" }}
          >
            {templates.map((template) => {
              const textSizes = getTextSizes(template.height);

              return (
                <div
                  key={template.id}
                  className="group relative rounded-lg cursor-pointer overflow-hidden mb-4 break-inside-avoid transition-transform duration-200 hover:scale-[1.02]"
                  style={{
                    height: `${template.height}px`,
                    backgroundImage: `url(${template.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <div
                    className={`absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between ${textSizes.padding}`}
                  >
                    <div className="text-white flex-1 flex flex-col justify-center">
                      <h3
                        className={`${textSizes.title} mb-1 leading-tight text-center`}
                      >
                        {template.title}
                      </h3>
                      {template.subtitle && (
                        <h4
                          className={`${textSizes.subtitle} mb-2 text-blue-300 text-center font-medium`}
                        >
                          {template.subtitle}
                        </h4>
                      )}
                      {template.description && (
                        <p
                          className={`${textSizes.description} text-gray-200 leading-relaxed text-center`}
                        >
                          {template.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center mt-2">
                      <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer ${textSizes.buttonSize}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Close current modal and open dual modal
                          onClose();
                          if (onOpenDualModal) {
                            onOpenDualModal(template.title);
                          }
                          // Keep the original callback for backward compatibility
                          onSelectTemplate(template);
                        }}
                      >
                        Chọn
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTemplateModal;
