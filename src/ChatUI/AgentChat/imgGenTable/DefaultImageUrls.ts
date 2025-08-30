
export const DEFAULT_IMAGE_URLS = [
  "https://i.pinimg.com/1200x/c2/31/48/c2314893161f270e6b8dd30f9087bc43.jpg",
  "https://i.pinimg.com/736x/63/1c/2d/631c2d5fc2599cff65f5144507dbce4e.jpg",
  "https://i.pinimg.com/736x/48/ea/05/48ea0549b3a0985c635993ebfc698e7b.jpg",
  "https://i.pinimg.com/1200x/f0/7e/dd/f07edd3cf298b545f147914272bf20eb.jpg",
  "https://i.pinimg.com/1200x/71/d8/1f/71d81fdc8ae26b173cf5635502a4c2f6.jpg",
  "https://i.pinimg.com/736x/5f/00/1b/5f001b48f1d2fe417a882e851157d939.jpg"
];


export const extractImageUrls = (text: string): string[] => {
  if (!text) return [];
  
  
  const urlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^\s]*)?/gi;
  const pinterestRegex = /https?:\/\/i\.pinimg\.com\/[^\s]+/gi;
  const generalImageRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp)/gi;
  
  const urls: string[] = [];
  
 
  const pinterestMatches = text.match(pinterestRegex) || [];
  urls.push(...pinterestMatches);
  
 
  const imageMatches = text.match(generalImageRegex) || [];
  urls.push(...imageMatches);
  

  const uniqueUrls = [...new Set(urls)];
  return uniqueUrls.slice(0, 6);
};


export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    
    
    return validExtensions.some(ext => pathname.endsWith(ext)) || 
           urlObj.hostname.includes('pinimg.com');
  } catch {
    return false;
  }
};
