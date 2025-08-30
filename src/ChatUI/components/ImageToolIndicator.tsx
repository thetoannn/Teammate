import React from "react";

import {
  ImageGenData,
  formatImageDataToShortText,
} from "../AgentChat/imgGenTable/utils/imageDataFormatter";

import KiExpandArrows from "../AgentChat/ProductListTable/ExpandArrow";

interface ImageToolIndicatorProps {
  aiResponse?: string;
  isVisible: boolean;
  isLoading?: boolean;
  imageData?: ImageGenData;
  onToggle?: () => void;
  isExpanded?: boolean;
}

const ImageToolIndicator: React.FC<ImageToolIndicatorProps> = ({
  aiResponse = "",
  isLoading = false,
  imageData,
  onToggle,
  isExpanded = false,
}) => {
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const defaultImageData: ImageGenData = {
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

  const currentImageData = imageData || defaultImageData;

  const displayResponse = formatImageDataToShortText(currentImageData);
  console.log("ImageToolIndicator displayResponse:", displayResponse);
  const truncatedResponse = displayResponse
    ? truncateText(displayResponse)
    : "";

  console.log("ImageToolIndicator rendered with response:", displayResponse);

  return (
    <div
      className={`image-tool-indicator mt-2 flex  gap-2  rounded-[14px] border border-[#A6A6A6]/50 w-full max-w-full  ${
        isLoading ? "image-tool-loading" : "image-tool-default"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-[14px] transition-all duration-300 w-full max-w-full ${
          isLoading ? "image-tool-loading-container" : "image-tool-default"
        }`}
      >
        <span
          className={`text-sm transition-opacity duration-300 whitespace-nowrap flex-shrink-0 ${
            isLoading
              ? "image-tool-loading-text"
              : "image-tool-default-text text-gray-300"
          }`}
        >
          Using Tool
        </span>
        <span className="text-gray-500 flex-shrink-0">|</span>
        <img
          src="/icon-gen-img.png"
          alt="Image Generation"
          className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
            isLoading ? "image-tool-loading-icon" : "opacity-60"
          }`}
        />
        {truncatedResponse && (
          <span
            className={`text-sm flex-1 min-w-0 truncate transition-opacity duration-300 ${
              isLoading
                ? "image-tool-loading-text"
                : "image-tool-default-text text-gray-400"
            }`}
          >
            {truncatedResponse}
          </span>
        )}

        {isLoading && !truncatedResponse && (
          <span className="text-sm flex-1 min-w-0 truncate image-tool-loading-text">
            Processing image request...
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

export default ImageToolIndicator;
