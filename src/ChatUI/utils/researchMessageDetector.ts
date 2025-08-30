
export const detectResearchMessage = (message: string): boolean => {
  if (!message || typeof message !== 'string') {
    return false;
  }

  const normalizedMessage = message.toLowerCase().trim();
  
  const researchKeywords = [
    'báo cáo thị trường',
    'bao cao thi truong',
    'báo cáo nghiên cứu thị trường',
    'bao cao nghien cuu thi truong',
    'nghiên cứu thị trường',
    'nghien cuu thi truong',
    'phân tích thị trường',
    'phan tich thi truong',
    'market research',
    'market report',
    'market analysis',
    'research report',
    'market study',
    'industry report',
    'market insights',
    'market data',
    'research market',
    'thị trường',
    'thi truong',
    'nghiên cứu',
    'nghien cuu',
    'phân tích',
    'phan tich',
    'báo cáo',
    'bao cao',
    'dữ liệu thị trường',
    'du lieu thi truong',
    'xu hướng thị trường',
    'xu huong thi truong',
    'market trends',
    'market size',
    'quy mô thị trường',
    'quy mo thi truong'
  ];

  return researchKeywords.some(keyword => 
    normalizedMessage.includes(keyword)
  );
};


export const extractResearchContext = (message: string): {
  isResearchRequest: boolean;
  context: string;
  keywords: string[];
} => {
  const isResearchRequest = detectResearchMessage(message);
  
  if (!isResearchRequest) {
    return {
      isResearchRequest: false,
      context: '',
      keywords: []
    };
  }

  const normalizedMessage = message.toLowerCase();
  const foundKeywords: string[] = [];
  
  const researchKeywords = [
    'báo cáo thị trường',
    'bao cao thi truong',
    'báo cáo nghiên cứu thị trường',
    'nghiên cứu thị trường',
    'phân tích thị trường',
    'market research',
    'research market',
    'market report',
    'market analysis',
    'research report',
    'market study',
    'industry report',
    'market insights',
    'market data',
    'thị trường',
    'nghiên cứu',
    'phân tích',
    'báo cáo',
    'dữ liệu thị trường',
    'xu hướng thị trường',
    'market trends',
    'market size',
    'quy mô thị trường'
  ];

  researchKeywords.forEach(keyword => {
    if (normalizedMessage.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });

  return {
    isResearchRequest: true,
    context: message,
    keywords: foundKeywords
  };
};


export const detectInputLanguage = (message: string): 'vietnamese' | 'english' => {
  if (!message || typeof message !== 'string') {
    return 'vietnamese';
  }

  const normalizedMessage = message.toLowerCase().trim();
  
  
  const englishKeywords = [
    'market research',
    'market report',
    'market analysis',
    'research report',
    'market study',
    'industry report',
    'market insights',
    'market data',
    'research market',
    'market trends',
    'market size'
  ];

  
  const vietnameseKeywords = [
    'báo cáo thị trường',
    'bao cao thi truong',
    'báo cáo nghiên cứu thị trường',
    'bao cao nghien cuu thi truong',
    'nghiên cứu thị trường',
    'nghien cuu thi truong',
    'phân tích thị trường',
    'phan tich thi truong',
    'thị trường',
    'thi truong',
    'nghiên cứu',
    'nghien cuu',
    'phân tích',
    'phan tich',
    'báo cáo',
    'bao cao'
  ];

  
  const hasEnglishKeywords = englishKeywords.some(keyword => 
    normalizedMessage.includes(keyword)
  );

  
  const hasVietnameseKeywords = vietnameseKeywords.some(keyword => 
    normalizedMessage.includes(keyword)
  );

  
  if (hasEnglishKeywords && !hasVietnameseKeywords) {
    return 'english';
  }

  
  return 'vietnamese';
};

export const shouldFilterVietnameseActivities = (userMessage: string): boolean => {
  return detectInputLanguage(userMessage) === 'english';
};

export const filterActivitiesForLanguage = (activities: any[], userMessage: string): any[] => {
  if (!shouldFilterVietnameseActivities(userMessage)) {
    return activities;
  }

  
  return activities.filter(activity => {
    const description = activity.description || activity.content || activity.message || '';
    const title = activity.title || activity.name || '';
    
    
    const vietnamesePatterns = [
      /🎯\s*Hoạt động liên quan đến nghiên cứu/i,
      /💡\s*Dựa trên yêu cầu của bạn/i,
      /📊\s*Hiển thị \d+ hoạt động/i,
      /Hoạt động liên quan đến nghiên cứu/i,
      /Dựa trên yêu cầu của bạn/i,
      /Hiển thị.*hoạt động/i
    ];

    
    const hasVietnamesePattern = vietnamesePatterns.some(pattern => 
      pattern.test(description) || pattern.test(title)
    );

    
    return !hasVietnamesePattern;
  });
};

export const generateResearchResponse = (userMessage: string): string => {
  const context = extractResearchContext(userMessage);
  
  if (!context.isResearchRequest) {
    return '';
  }

  return `[Auto] Market Research - RESEARCH AGENT - Market-Analysis - ${new Date().toLocaleDateString('vi-VN')}`;
};


export const isResearchAgentPage = (pathname: string, search: string): boolean => {
  const fullPath = pathname + search;
  return fullPath.includes('agent=research') || fullPath.includes('/chat?agent=research');
};


export const shouldShowResearchToolIndicator = (
  message: string, 
  pathname: string, 
  search: string,
  aiResponse?: string
): boolean => {
  const isResearchMessage = detectResearchMessage(message);
  const isResearchPage = isResearchAgentPage(pathname, search);
  

  if (aiResponse && aiResponse.trim()) {
    const researchResponseKeywords = ["thị trường", "market", "nghiên cứu", "research", "phân tích", "analysis", "báo cáo", "report"];
    const hasResearchResponse = researchResponseKeywords.some(keyword => 
      aiResponse.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return isResearchMessage && isResearchPage && hasResearchResponse;
  }
  

  return isResearchMessage && isResearchPage;
};
