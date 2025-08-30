import React, { useState } from "react";
import ResearchToolIndicator from "./ResearchToolIndicator";
import { ResearchData } from "../AgentChat/ResearchScreenTable/utils/researchDataFormatter";

interface ResearchToolWrapperProps {
  aiResponse?: string;
  isLoading?: boolean;
  researchData?: string;
  onIndicatorClick?: () => void;
  onSplitScreenToggle?: (isOpen: boolean, data?: string) => void;
}

const ResearchToolWrapper: React.FC<ResearchToolWrapperProps> = ({
  aiResponse,
  isLoading = false,
  researchData,
  onIndicatorClick,
  onSplitScreenToggle,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleIndicatorClick = () => {
    if (isLoading) return;
    const newIsActive = !isActive;
    setIsActive(newIsActive);

    if (onIndicatorClick) {
      onIndicatorClick();
    }

    if (onSplitScreenToggle) {
      onSplitScreenToggle(newIsActive, researchData || aiResponse);
    }
  };

  return (
    <div className="w-full">
      <ResearchToolIndicator
        isVisible={true}
        isLoading={isLoading}
        aiResponse={aiResponse}
        researchData={undefined}
        onClick={handleIndicatorClick}
      />
    </div>
  );
};

export default ResearchToolWrapper;
