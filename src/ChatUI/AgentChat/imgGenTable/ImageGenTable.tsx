import React, { useState, useEffect } from "react";
import ImagePreview from "./ImagePreview";
import ImageUrlExtractor from "./ImageUrlExtractor";
import { DEFAULT_IMAGE_URLS } from "./DefaultImageUrls";
import KiExpandArrows from "../ProductListTable/ExpandArrow";

interface ImageGenData {
  campaignName: string;
  campaignId: string;
  accountId: string;
  fanpageId: string;
  objective: string;
  status: string;
  adFormat: string;
  imageCount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  imageSpecs: {
    format: string;
    dimensions: string;
    quality: string;
  };
}

interface ImageGenTableProps {
  userQuery?: string;
  aiResponse?: string;
  isLoading?: boolean;
  data?: ImageGenData;
  onClose?: () => void;
}

const ImageGenTable: React.FC<ImageGenTableProps> = ({
  userQuery = "",
  aiResponse = "",
  isLoading = false,
  data,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"prompt" | "preview">("prompt");
  const [imageUrls, setImageUrls] = useState<string[]>(
    DEFAULT_IMAGE_URLS.slice(0, 6)
  );
  const [isExtractingUrls, setIsExtractingUrls] = useState(false);
  const agentIcon = "/icon-assistant.png";
  const defaultData: ImageGenData = {
    campaignName: "[Auto] Carousel Messenger - VINA GIÀY - New-Selection",
    campaignId: `campaign_${Date.now()}`,
    accountId: "act_1298140236230962",
    fanpageId: "653213604546712",
    objective: "Tin nhắn (OUTCOME_LEADS)",
    status: "ACTIVE",
    adFormat: "Carousel (Băng chuyền)",
    imageCount: 3,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    imageSpecs: {
      format: "JPG/PNG",
      dimensions: "1080x1080px",
      quality: "Chất lượng cao, phù hợp với tiêu chuẩn quảng cáo",
    },
  };

  const currentData = data || defaultData;

  const handleUrlsExtracted = (urls: string[]) => {
    setImageUrls(urls);
    setIsExtractingUrls(false);
  };

  useEffect(() => {
    if (userQuery) {
      setIsExtractingUrls(true);
    }
  }, [userQuery]);

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

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-3 bg-[#2a2a2a] ">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0">
          <img src={agentIcon} alt="" />
        </div>
        <span className="text-white font-medium text-sm sm:text-base mr-6">
          Marketing Assistant Agent
        </span>
        <span className="text-gray-400 hidden sm:inline">|</span>
        <span className="text-gray-400 text-xs sm:text-sm">Using Tools</span>
        <span className="text-gray-400 hidden sm:inline">|</span>
        <div className="flex items-center gap-1">
          <img
            src="/icon-gen-img.png"
            alt="Image AI"
            className="w-3 h-3 sm:w-4 sm:h-4"
          />
          <span className="text-gray-400 text-xs sm:text-sm">
            Image AI Tools
          </span>
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
    <div className="flex  bg-[#2a2a2a] overflow-x-auto ">
      <div className="pl-[25px]">
        <button
          onClick={() => setActiveTab("prompt")}
          className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === "prompt"
              ? "text-white border-b-1 border-white-500 bg-[#2a2a2a]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Prompt
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === "preview"
              ? "text-white border-b-1 border-white-500 bg-[#2a2a2a]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Preview
        </button>
      </div>
    </div>
  );

  const renderPromptContent = () => (
    <div className="p-3 sm:p-4 lg:p-6 text-white max-h-[500px] overflow-y-auto bg-[#2a2a2a] image-gen-table-scroll">
      <p className="mb-3 sm:mb-4 text-gray-300 text-sm sm:text-base">
        Sếp đã đồng ý tạo một chiến dịch quảng cáo mới với{" "}
        {currentData.imageCount} ảnh sản phẩm được chọn từ kho.
      </p>
      <p className="mb-3 sm:mb-4 text-gray-300 text-sm sm:text-base">
        Yêu cầu chi tiết cho Ad Agent:
      </p>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start gap-2">
          <span className="text-white mt-1 font-bold text-sm sm:text-base">
            1.
          </span>
          <span className="text-gray-300 text-sm sm:text-base">Nhiệm vụ:</span>
        </div>

        <div className="ml-4 sm:ml-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Tạo một chiến dịch quảng cáo hoàn toàn mới.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Sử dụng định dạng {currentData.adFormat}.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4">
          <span className="text-white mt-1 font-bold text-sm sm:text-base">
            2.
          </span>
          <span className="text-gray-300 text-sm sm:text-base">
            Thông tin chiến dịch:
          </span>
        </div>

        <div className="ml-4 sm:ml-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <div className="text-gray-300 text-sm sm:text-base break-words">
              <span className="font-medium">Tên chiến dịch:</span>{" "}
              <span className="break-all">
                {currentData.campaignName} -{" "}
                {formatDateOnly(currentData.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <div className="text-gray-300 text-sm sm:text-base break-words">
              <span className="font-medium">Tài khoản quảng cáo ID:</span>{" "}
              <span className="font-mono text-xs sm:text-sm break-all">
                {currentData.accountId}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <div className="text-gray-300 text-sm sm:text-base break-words">
              <span className="font-medium">Fanpage ID:</span>{" "}
              <span className="font-mono text-xs sm:text-sm break-all">
                {currentData.fanpageId}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <div className="text-gray-300 text-sm sm:text-base">
              <span className="font-medium">Mục tiêu chiến dịch:</span>{" "}
              {currentData.objective}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4">
          <span className="text-white mt-1 font-bold text-sm sm:text-base">
            3.
          </span>
          <span className="text-gray-300 text-sm sm:text-base">
            Hình ảnh sản phẩm:
          </span>
        </div>

        <div className="ml-4 sm:ml-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              {currentData.imageCount} ảnh sản phẩm giày được chọn từ kho hình
              ảnh
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              Định dạng: {currentData.imageSpecs.format}, kích thước tối ưu cho
              Facebook Carousel
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm sm:text-base">
              {currentData.imageSpecs.quality}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4">
          <span className="text-white mt-1 font-bold text-sm sm:text-base">
            4.
          </span>
          <span className="text-gray-300 text-sm sm:text-base">
            Lịch chạy chiến dịch:
          </span>
        </div>

        <div className="ml-4 sm:ml-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <div className="text-gray-300 text-sm sm:text-base">
              <span className="font-medium">Bắt đầu:</span>{" "}
              {formatDate(currentData.startDate)}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-300mt-1 flex-shrink-0">•</span>
            <div className="text-gray-300 text-sm sm:text-base">
              <span className="font-medium">Kết thúc:</span>{" "}
              {formatDate(currentData.endDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewContent = () => (
    <div className="p-3 sm:p-4 lg:p-6 text-white max-h-[500px] overflow-y-auto bg-[#2a2a2a] image-gen-table-scroll">
      {isExtractingUrls && (
        <div className="mb-4 p-3 bg-[#2a2a2a] border border-gray-600 max-h-[500px] overflow-y-auto rounded-lg image-gen-table-scroll">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-gray-300 text-sm">
              Extracting image URLs...
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold text-sm sm:text-base">
            Image Preview
          </h4>
          <div className="text-gray-400 text-xs sm:text-sm">
            {imageUrls.length} images
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <ImagePreview
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full"
                fallbackSrc="/icon-gen-img.png"
              />

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-xs text-center p-2 break-all">
                  {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="p-6 sm:p-8 lg:p-12 text-center">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
      <p className="text-gray-300 text-sm sm:text-base">
        Đang tạo bảng thông tin hình ảnh...
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full bg-[#1f1f1f] border border-[#FFFFFF]/20 rounded-lg shadow-lg overflow-hidden">
        {renderHeader()}
        {renderTabs()}
        <div className="min-h-[200px] sm:min-h-[300px]">
          {renderLoadingState()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1f1f1f] border border-[#FFFFFF]/20 rounded-lg shadow-lg overflow-hidden">
      <ImageUrlExtractor
        userQuery={userQuery}
        onUrlsExtracted={handleUrlsExtracted}
        maxImages={6}
      />

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

export default ImageGenTable;
