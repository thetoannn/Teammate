export interface ImageGenData {
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

export const formatImageDataToText = (imageData: ImageGenData): string => {
  if (!imageData) {
    return "[Auto] Image Generation - No campaign data available";
  }

  const campaignInfo = `${imageData.campaignName} - ${imageData.imageCount} images (${imageData.adFormat})`;
  
  return `Image AI Tools - ${campaignInfo}`;
};

export const formatImageDataToShortText = (imageData: ImageGenData): string => {
  if (!imageData) {
    return "[Auto] Image Generation - No data";
  }

  const shortName = imageData.campaignName.length > 50 
    ? imageData.campaignName.substring(0, 50) + "..." 
    : imageData.campaignName;
  
  return `Image AI Tools - ${shortName} (${imageData.imageCount} images)`;
};
