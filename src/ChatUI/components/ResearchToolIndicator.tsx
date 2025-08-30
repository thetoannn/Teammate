import React from "react";

import { ResearchData } from "../AgentChat/ResearchScreenTable/utils/researchDataFormatter";

interface ResearchToolIndicatorProps {
  aiResponse?: string;
  isVisible: boolean;
  isLoading?: boolean;
  researchData?: ResearchData;
  onClick?: () => void;
}

const ResearchToolIndicator: React.FC<ResearchToolIndicatorProps> = ({
  aiResponse,
  isLoading = false,
  researchData,
  onClick,
}) => {
  return (
    <div
      className={`research-tool-indicator mt-2 flex items-center justify-between pl-4 pr-0 py-3 rounded-[14px] w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl cursor-pointer ${
        isLoading ? "research-tool-loading" : "research-tool-default"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <span
          className={`text-sm font-medium transition-opacity duration-300 ${
            isLoading
              ? "research-tool-loading-text"
              : "research-tool-default-text text-white"
          }`}
        >
          Báo cáo nghiên cứu thị trường
        </span>
        <span className="text-xs text-gray-400 mt-2">Document</span>
      </div>
      <img
        src="/icon-frame-resea.png"
        alt="Market Research"
        className={`w-35 h-20 flex-shrink-0 mr-10 transition-all duration-300 hover:scale-110 cursor-pointer ${
          isLoading
            ? "research-tool-loading-icon"
            : "opacity-80 hover:opacity-100"
        }`}
        style={{ marginBottom: "-12px" }}
      />
    </div>
  );
};

export default ResearchToolIndicator;
