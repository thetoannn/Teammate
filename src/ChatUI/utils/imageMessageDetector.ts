

export const IMAGE_KEYWORDS = [
  "tạo ảnh",
  "chỉnh sửa ảnh", 
  "tao anh",
  "chỉnh sửa hình ảnh",
  "chinh sua anh",
  "chinh sua hinh anh",
  "gen img",
  "photo editing",
  "thêm phông nền",
  "cải thiện ảnh",
  "image editing",
  "thêm ảnh có chứa",
  "tạo hình ảnh",
  "chỉnh ảnh",
  "edit image",
  "generate image",
  "create image",
  "image generation"
];

export const CAMPAIGN_REPORT_KEYWORDS = [
  "báo cáo chiến dịch",
  "tạo bài đăng",
  "tạo bài quảng cáo",
  "tạo chiến dịch",
  "tạo quảng cáo",
  "tạo campaign",
  "create campaign",
  "create ad",
  "create post",
  "bao cao chien dich",
  "tạo báo cáo chiến dịch",
  "tạo báo cáo",
  "up bài đăng lên fanpage",
  "lên bài chạy quảng cáo",
  "campaign report",
  "bao cáo chiến dịch",
  "đang phân tích dữ liệu chiến dịch",
  "phân tích dữ liệu chiến dịch",
  "phân tích chiến dịch",
  "campaign analysis",
  "hiển thị hoạt động",
  "campaign data",
  "báo cáo",
  "phân tích dữ liệu",
  "dữ liệu chiến dịch"
];

export const MARKETING_ASSISTANT_URLS = [
  "/chat?agent=marketing-assistant",
  "/chat?agent=marketing-assistant&selectedTool=image",
  "/chat?agent=marketing-assistant&selectedTool=video"
];


export const isImageRelatedMessage = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();

  
  return IMAGE_KEYWORDS.some(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    return (
      lowerMessage.includes(lowerKeyword) ||
      lowerMessage.startsWith(lowerKeyword + " ") 
    );
  });
};


export const isCampaignReportMessage = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();

  
  if (isImageRelatedMessage(message)) {
    return false;
  }

  return CAMPAIGN_REPORT_KEYWORDS.some(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    return (
      lowerMessage.includes(lowerKeyword) ||
      lowerMessage.startsWith(lowerKeyword + " ")
    );
  });
};




export const isCampaignReportResponse = (response: string): boolean => {
  const lowerResponse = response.toLowerCase();
  return CAMPAIGN_REPORT_KEYWORDS.some(keyword => 
    lowerResponse.includes(keyword.toLowerCase())
  );
};


export const isMarketingAssistantPage = (pathname: string, search: string): boolean => {
  const fullPath = pathname + search;
  return MARKETING_ASSISTANT_URLS.some(url => 
    fullPath.includes(url) || fullPath.includes("agent=marketing-assistant")
  );
};


export const shouldShowImageToolIndicator = (
  message: string, 
  pathname: string, 
  search: string,
  aiResponse?: string
): boolean => {
  const isImageMessage = isImageRelatedMessage(message);
  const isMarketingPage = isMarketingAssistantPage(pathname, search);
  
 
  if (aiResponse && aiResponse.trim()) {
  
    if (isCampaignReportResponse(aiResponse)) {
      return false;
    }
    
    
    const imageGenKeywords = ["ảnh", "image", "hình ảnh", "generate", "tạo", "create"];
    const hasImageResponse = imageGenKeywords.some(keyword => 
      aiResponse.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return isImageMessage && isMarketingPage && hasImageResponse;
  }
  
  
  return isImageMessage && isMarketingPage;
};
