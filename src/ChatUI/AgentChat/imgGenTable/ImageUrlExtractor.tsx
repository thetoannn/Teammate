import React, { useState, useEffect } from "react";
import {
  extractImageUrls,
  isValidImageUrl,
  DEFAULT_IMAGE_URLS,
} from "./DefaultImageUrls";

interface ImageUrlExtractorProps {
  userQuery?: string;
  onUrlsExtracted: (urls: string[]) => void;
  maxImages?: number;
}

const ImageUrlExtractor: React.FC<ImageUrlExtractorProps> = ({
  userQuery = "",
  onUrlsExtracted,
  maxImages = 6,
}) => {
  const [extractedUrls, setExtractedUrls] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    extractUrls();
  }, [userQuery]);

  const extractUrls = async () => {
    setIsExtracting(true);

    try {
      const userUrls = extractImageUrls(userQuery);

      const validUserUrls = userUrls.filter(isValidImageUrl);

      let finalUrls: string[] = [];

      if (validUserUrls.length > 0) {
        finalUrls = validUserUrls.slice(0, maxImages);

        if (finalUrls.length < maxImages) {
          const remainingSlots = maxImages - finalUrls.length;
          const defaultUrls = DEFAULT_IMAGE_URLS.slice(0, remainingSlots);
          finalUrls = [...finalUrls, ...defaultUrls];
        }
      } else {
        finalUrls = DEFAULT_IMAGE_URLS.slice(0, maxImages);
      }

      setExtractedUrls(finalUrls);
      onUrlsExtracted(finalUrls);
    } catch (error) {
      console.error("Error extracting URLs:", error);

      const fallbackUrls = DEFAULT_IMAGE_URLS.slice(0, maxImages);
      setExtractedUrls(fallbackUrls);
      onUrlsExtracted(fallbackUrls);
    } finally {
      setIsExtracting(false);
    }
  };

  return null;
};

export default ImageUrlExtractor;
