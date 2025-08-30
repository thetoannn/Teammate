import PlanPurchaseService from './PlanPurchaseService';
import type { PlanPurchaseResponse, PlanOrderStatusResponse } from './PlanPurchaseService';

interface SubscriptionPackage {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  numericPrice: number;
  isPopular: boolean;
  discount: string | null;
  originalPrice: string | null;
  duration: string;
}

// PLUS plan ID - this should be updated with the actual ID from the API
const PLUS_PLAN_ID = "0198c178-9759-7998-85c1-f32193a66fa6"; // Gói PLUS

// USD to VND conversion rate
const USD_TO_VND_RATE = 26000;

const postSubscriptionPurchase = async (data: { subscriptionPackageId: string }) => {
  // Get duration from package ID
  const durationMapping: Record<string, number> = {
    '1month': 1,
    '3months': 3,
    '12months': 12
  };
  
  const duration = durationMapping[data.subscriptionPackageId] || 1;
  
  // Get base price for PLUS plan in USD (48.9 USD)
  const basePriceUSD = 48.9;
  
  // Convert to VND for backend processing
  const basePriceVND = basePriceUSD * USD_TO_VND_RATE;
  
  // Calculate total price with discount
  const totalPrice = PlanPurchaseService.calculateDiscountedPrice(
    basePriceVND,
    duration,
    0, // 0% discount for 1 month
    15, // 15% discount for 3 months
    30  // 30% discount for 12 months
  );
  
  console.log(`🔄 SubscriptionService: Purchasing PLUS plan for ${duration} months, USD price: $${basePriceUSD}, VND price: ${basePriceVND}, total price: ${totalPrice}`);
  
  const response = await PlanPurchaseService.purchasePlan(PLUS_PLAN_ID, basePriceVND, duration);
  return response;
};

const pollingSubscriptionOrderStatus = async (orderId: string) => {
  const response = await PlanPurchaseService.checkOrderStatus(orderId);
  return response;
};

// Get subscription packages with calculated prices in USD
const getSubscriptionPackages = (): SubscriptionPackage[] => {
  // Base price for PLUS plan in USD
  const basePriceUSD = 48.9;
  
  // Calculate discounted price for different periods
  const calculateDiscountedPrice = (basePrice: number, months: number) => {
    const totalPrice = basePrice * months;
    let discount = 0;
    
    if (months === 3) {
      discount = 15; // 15% discount for 3 months
    } else if (months === 12) {
      discount = 30; // 30% discount for 12 months
    }
    
    const discountAmount = (totalPrice * discount) / 100;
    return totalPrice - discountAmount;
  };
  
  // Calculate prices with discounts in USD
  const oneMonthPrice = basePriceUSD;
  const threeMonthsPrice = calculateDiscountedPrice(basePriceUSD, 3);
  const twelveMonthsPrice = calculateDiscountedPrice(basePriceUSD, 12);
  
  // Format prices for display in USD
  const formatPrice = (price: number) => {
    return "$" + price.toFixed(1) + " USD";
  };
  
  // Convert to VND for backend processing
  const convertToVND = (usdPrice: number) => usdPrice * USD_TO_VND_RATE;
  
  return [
    {
      id: "1month",
      title: "01 tháng",
      subtitle: "Nguyên giá",
      price: formatPrice(oneMonthPrice),
      numericPrice: convertToVND(oneMonthPrice),
      isPopular: false,
      discount: null,
      originalPrice: null,
      duration: "1 month",
    },
    {
      id: "3months",
      title: "03 tháng",
      subtitle: "Giảm 15%",
      price: formatPrice(threeMonthsPrice),
      numericPrice: convertToVND(threeMonthsPrice),
      isPopular: true,
      discount: "15%",
      originalPrice: formatPrice(basePriceUSD * 3),
      duration: "3 months",
    },
    {
      id: "12months",
      title: "12 tháng",
      subtitle: "Giảm 30%",
      price: formatPrice(twelveMonthsPrice),
      numericPrice: convertToVND(twelveMonthsPrice),
      isPopular: false,
      discount: "30%",
      originalPrice: formatPrice(basePriceUSD * 12),
      duration: "12 months",
    },
  ];
};

export { 
  postSubscriptionPurchase, 
  pollingSubscriptionOrderStatus, 
  getSubscriptionPackages 
};
export type { 
  PlanPurchaseResponse as SubscriptionQrData, 
  SubscriptionPackage 
};
