
export const detectProductListMessage = (message: string): boolean => {
  if (!message || typeof message !== 'string') {
    return false;
  }

  const normalizedMessage = message.toLowerCase().trim();
  

  const productListKeywords = [
    'danh sách sản phẩm',
    'danh sach san pham',
    'báo cáo danh sách sản phẩm',
    'cho mình danh sách sản phẩm',
    'xem danh sách sản phẩm',
    'hiển thị danh sách sản phẩm',
    'danh sách hàng hóa',
    'sản phẩm trong kho',
    'kho sản phẩm',
    'list sản phẩm',
    'product list',
    'danh mục sản phẩm'
  ];

 
  return productListKeywords.some(keyword => 
    normalizedMessage.includes(keyword)
  );
};

export const extractProductContext = (message: string): {
  isProductListRequest: boolean;
  context: string;
  keywords: string[];
} => {
  const isProductListRequest = detectProductListMessage(message);
  
  if (!isProductListRequest) {
    return {
      isProductListRequest: false,
      context: '',
      keywords: []
    };
  }

  const normalizedMessage = message.toLowerCase();
  const foundKeywords: string[] = [];
  
  const productListKeywords = [
    'danh sách sản phẩm',
    'báo cáo danh sách sản phẩm',
    'cho mình danh sách sản phẩm',
    'xem danh sách sản phẩm',
    'hiển thị danh sách sản phẩm',
    'danh sách hàng hóa',
    'sản phẩm trong kho',
    'kho sản phẩm',
    'list sản phẩm',
    'product list',
    'danh mục sản phẩm'
  ];

  productListKeywords.forEach(keyword => {
    if (normalizedMessage.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });

  return {
    isProductListRequest: true,
    context: message,
    keywords: foundKeywords
  };
};


export const generateProductListResponse = (userMessage: string): string => {
  const context = extractProductContext(userMessage);
  
  if (!context.isProductListRequest) {
    return '';
  }

  return `[Auto] Product Management - VINA GIÀY - Product-List - ${new Date().toLocaleDateString('vi-VN')}`;
};
