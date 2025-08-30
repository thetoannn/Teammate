

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const getFallbackImage = (): string => {
  return '/icon-render-img.png';
};

export const validateAndFixImageUrl = (url: string): string => {
  if (!url) return getFallbackImage();
  
  
  if (isValidImageUrl(url)) {
    return url;
  }
  
 
  if (url.startsWith('/') || url.startsWith('./')) {
    return url;
  }
  
  if (!url.includes('://') && !url.startsWith('/')) {
    return `/images/${url}`;
  }
  
  return getFallbackImage();
};

export const preloadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};


export const extractImageUrls = (text: string): string[] => {
  if (!text) return [];

 
  const imageExtensionRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff)(?:\?[^\s]*)?)/gi;
  const imageKeywordRegex = /(https?:\/\/[^\s]*(?:image|photo|pic|img|picture)[^\s]*)/gi;
  const commonImageHostsRegex = /(https?:\/\/(?:.*\.)?(?:imgur|flickr|unsplash|pexels|pixabay|shutterstock|getty|istockphoto|adobe|cloudinary)[^\s]+)/gi;
  
  const matches = new Set<string>();
  

  const extensionMatches = text.match(imageExtensionRegex) || [];
  extensionMatches.forEach(url => matches.add(url.trim()));
  

  const keywordMatches = text.match(imageKeywordRegex) || [];
  keywordMatches.forEach(url => matches.add(url.trim()));
  
 
  const hostMatches = text.match(commonImageHostsRegex) || [];
  hostMatches.forEach(url => matches.add(url.trim()));
  
 
  const validUrls = Array.from(matches)
    .filter(url => isValidImageUrl(url))
    .slice(0, 10);
  return validUrls;
};


export const generateCardTitle = (index: number, totalCards: number): string => {
  const titles = [
    "Sản phẩm chính",
    "Sản phẩm nổi bật", 
    "Sản phẩm khuyến mãi",
    "Sản phẩm mới",
    "Sản phẩm đặc biệt"
  ];
  
  if (totalCards === 1) {
    return "Sản phẩm chính";
  }
  
  return titles[index] || `Sản phẩm ${index + 1}`;
};
