import React, { useState } from "react";
import ImageToolIndicator from "./ImageToolIndicator";

import ImageGenTable from "../AgentChat/imgGenTable/ImageGenTable";
import { ImageGenData } from "../AgentChat/imgGenTable/utils/imageDataFormatter";

interface ImageToolWrapperProps {
  aiResponse?: string;
  isVisible: boolean;
  isLoading?: boolean;
  imageData?: ImageGenData;
}

const ImageToolWrapper: React.FC<ImageToolWrapperProps> = ({
  aiResponse = "",
  isVisible,
  isLoading = false,
  imageData,
}) => {
  const [showImageTable, setShowImageTable] = useState(false);

  const handleToggleTable = () => {
    setShowImageTable(!showImageTable);
  };

  return (
    <>
      {!showImageTable ? (
        <div className="flex items-center gap-2">
          <ImageToolIndicator
            aiResponse={aiResponse}
            isVisible={isVisible}
            isLoading={isLoading}
            imageData={imageData}
            onToggle={handleToggleTable}
            isExpanded={showImageTable}
          />
        </div>
      ) : (
        <div className="w-full">
          <ImageGenTable
            aiResponse={aiResponse}
            isLoading={isLoading}
            userQuery={aiResponse}
            data={imageData}
            onClose={handleToggleTable}
          />
        </div>
      )}
    </>
  );
};

export default ImageToolWrapper;
