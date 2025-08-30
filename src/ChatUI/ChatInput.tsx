import React, {
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import PickTool from "../components/PickTool";
import ToolForResearchAgent from "../components/ToolForResearchAgent";
import IconTool from "./components/IconTool";

interface ChatInputProps {
  onSendMessage: (message: string, images?: File[]) => void;
  isLoading?: boolean;
  showResearchSplit?: boolean;
  isImageAITool?: boolean;
}

const toolsIconSide = "/icon-tools.png";
const iconStop = "/icon-input-stop.png";
const ChatInput: FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  showResearchSplit = false,
  isImageAITool = false,
}) => {
  const [input, setInput] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isMarketingAssistant, setIsMarketingAssistant] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Check if current URL contains marketing-assistant agent parameter
  useEffect(() => {
    const checkMarketingAssistant = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const agent = urlParams.get("agent");
      setIsMarketingAssistant(agent === "marketing-assistant");
    };

    // Check on mount
    checkMarketingAssistant();

    // Listen for URL changes (for SPA navigation)
    const handlePopState = () => {
      checkMarketingAssistant();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        processFiles(files);
      }
    };

    const handleWindowFocus = () => {
      if (isFileDialogOpen) {
        setTimeout(() => {
          setIsFileDialogOpen(false);
        }, 500);
      }
    };

    const handleWindowBlur = () => {
      if (isFileDialogOpen) {
        setTimeout(() => {
          setIsFileDialogOpen(false);
        }, 2000);
      }
    };

    document.addEventListener("paste", handlePaste);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("paste", handlePaste);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [selectedImages.length, previewUrls, isFileDialogOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() !== "" || selectedImages.length > 0) {
      onSendMessage(
        input.trim(),
        selectedImages.length > 0 ? selectedImages : undefined
      );
      setInput("");
      setSelectedImages([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFileClick = () => {
    setIsFileDialogOpen(true);
    fileInputRef.current?.click();

    // Extended timeout to handle save/open dialog interactions
    setTimeout(() => {
      setIsFileDialogOpen(false);
    }, 3000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFileDialogOpen(false);
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages = imageFiles.slice(0, 5 - selectedImages.length);
    if (newImages.length === 0) return;

    const newSelectedImages = [...selectedImages, ...newImages];
    setSelectedImages(newSelectedImages);

    const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    const newPreviewUrls = [...previewUrls];

    URL.revokeObjectURL(newPreviewUrls[index]);
    newSelectedImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setSelectedImages(newSelectedImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFileDialogOpen) return;

    if (
      e.dataTransfer.types.includes("Files") &&
      e.dataTransfer.effectAllowed !== "none"
    ) {
      setDragCounter((prev) => prev + 1);
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFileDialogOpen) return;

    setDragCounter((prev) => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        setIsDragging(false);
        return 0;
      }
      return newCount;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFileDialogOpen) return;

    if (
      e.dataTransfer.types.includes("Files") &&
      e.dataTransfer.effectAllowed !== "none"
    ) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFileDialogOpen) return;

    setIsDragging(false);
    setDragCounter(0);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const hasImages = Array.from(files).some((file) =>
        file.type.startsWith("image/")
      );

      if (hasImages) {
        processFiles(files);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto px-0"
      style={{ backgroundColor: "transparent", borderColor: "#656262" }}
    >
      <div className="relative">
        <div
          ref={dropAreaRef}
          className={`flex flex-col gap-2 sm:gap-[11px] ${
            isDragging
              ? "border-2 border-dashed border-blue-400 bg-blue-900 bg-opacity-20"
              : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {previewUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-0">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative  w-[60px] h-[45px]">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full rounded-[10px] object-cover border-[1.5px] border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -right-2 -top-2 bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center hover:bg-gray-600 transition-colors shadow-sm"
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                  {index === 4 && previewUrls.length > 5 && (
                    <div className="absolute  inset-0 bg-[#1f1f1f] bg-opacity-50 flex items-center justify-center rounded">
                      <span className="text-white text-xs">
                        +{previewUrls.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div
            className={`${
              showResearchSplit ? "mb-2" : "mb-12 "
            } flex flex-col p-2 sm:p-[8px] border rounded-[22px] w-full min-h-[36px] sm:min-h-[50px] max-h-[120px] overflow-y-auto border-input-field-color ${
              isDragging ? "border-blue-400" : ""
            }`}
            style={{ backgroundColor: "#313131", borderColor: "#656262" }}
          >
            <input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder={
                selectedImages.length > 0
                  ? "Thêm miêu tả chi tiết"
                  : isDragging
                  ? "Kéo thả ảnh "
                  : isImageAITool
                  ? "Bắt đầu với một ý tưởng hoặc mẫu sẵn có"
                  : "Bạn có thể hỏi bất cứ điều gì"
              }
              className="w-full px-2 sm:px-[11px] py-1 sm:py-[5px] text-input-field chat-input-format responsive-text focus:outline-none focus:ring-0 text-sm sm:text-[14px] bg-transparent"
              maxLength={1000}
              style={{
                wordWrap: "break-word",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                textAlign: "justify",
              }}
            />
            <div className="flex items-center justify-between mt-2 sm:mt-[8px]">
              <div className="flex items-center gap-2 sm:gap-[11px] mt-2 sm:mt-[8px] ml-2 sm:ml-[8px]">
                {!isMarketingAssistant && <PickTool />}
                <ToolForResearchAgent onSendMessage={onSendMessage} />
                <IconTool></IconTool>
              </div>
              <div className="flex items-center gap-2 sm:gap-[11px] mt-2 sm:mt-[8px] mr-2 sm:mr-[8px] justify-end">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <div className="relative group">
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                    disabled={selectedImages.length >= 5}
                    title={
                      selectedImages.length >= 5
                        ? "Maximum 5 images"
                        : "Add images"
                    }
                  >
                    <i className="ri-attachment-2 text-sm sm:text-[16px]"></i>
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                    Chọn file
                  </div>
                </div>
                <div className="relative group">
                  <button
                    type="button"
                    className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    <i className="ri-mic-line text-sm sm:text-[16px]"></i>
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                    Ghi âm
                  </div>
                </div>
                <button
                  type="submit"
                  className={`flex text-white items-center justify-center leading-5 sm:leading-[27px] p-1 sm:p-[8px] py-1 sm:py-[5px] relative box-border rounded-[9px] group ${
                    input.trim() === "" && selectedImages.length === 0
                      ? "bg-[#FFFFFF0D] cursor-not-allowed"
                      : "bg-submit-input hover:scale-105 cursor-pointer"
                  } transition-all duration-300 ease-in-out outline-none focus:ring-2 focus:ring-pink-400`}
                  disabled={
                    (input.trim() === "" && selectedImages.length === 0) ||
                    isLoading
                  }
                >
                  {isLoading ? (
                    <div className="py-1">
                      <img
                        src="/icon-load-respond.png"
                        alt="Loading"
                        className="w-3 h-3 sm:w-4 sm:h-4 "
                      />
                    </div>
                  ) : (
                    <i className="ri-send-plane-line text-sm sm:text-[16px] group-hover:scale-[1.2] transition-all duration-300 ease-in-out"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
