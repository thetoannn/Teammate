export interface ProductData {
  stt: number;
  productCode: string;
  productName: string;
  price: string;
  stock: number;
  discount: string;
  image: string;
}

export const formatProductDataToText = (products: ProductData[]): string => {
  if (!products || products.length === 0) {
    return "[Auto] Product Management - No products available";
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const productNames = products.map(product => product.productName).join(", ");
  
  const summary = `[Auto] Product Management - ${totalProducts} products (${totalStock} in stock): ${productNames}`;
  
  return summary;
};

export const formatProductDataToShortText = (products: ProductData[]): string => {
  if (!products || products.length === 0) {
    return "[Auto] Product Management - No products";
  }

  const totalProducts = products.length;
  const firstFewProducts = products.slice(0, 3).map(p => p.productName).join(", ");
  const hasMore = products.length > 3;
  
  return `[Auto] Product Management - ${totalProducts} products: ${firstFewProducts}${hasMore ? "..." : ""}`;
};
