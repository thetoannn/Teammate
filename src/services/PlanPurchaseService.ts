import axios from 'axios';
import appConfig from '../configs/app.config';
import googleAuthService from './GoogleAuthService';

// Define interfaces for the request and response data
export interface PlanPurchaseRequest {
  totalPrice: number;
  duration: number;
  planId: string;
}

export interface PlanPurchaseResponse {
  data: {
    bankCode: string;
    bankName: string;
    bankAccount: string;
    userBankName: string;
    content: string;
    qrCode: string;
    imgId: string;
    amount: string;
    orderId: string;
    existing: number;
    transactionId: string;
    transactionRefId: string;
    qrLink: string;
  };
  code: number;
  message: string;
}

export interface PlanOrderStatusResponse {
  data: {
    status: string;
    [key: string]: any;
  };
  code: number;
  message: string;
}

// Create an axios client with the base URL
const apiClient = axios.create({
  baseURL: appConfig.apiCorePrefix,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use(async (config) => {
  const authToken = await googleAuthService.getAuthToken();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

const PlanPurchaseService = {
  /**
   * Purchase a plan
   * @param planId - The ID of the plan to purchase
   * @param price - The price of the plan
   * @param duration - The duration in months (1, 3, or 12)
   * @returns Promise with the purchase response
   */
  purchasePlan(planId: string, price: number, duration: number): Promise<PlanPurchaseResponse> {
    console.log('🔧 PlanPurchaseService: Making API request to /user-plan');
    
    // Calculate total price based on duration
    const totalPrice = price * duration;
    
    return apiClient
      .post('/user-plan', {
        totalPrice,
        duration,
        planId
      })
      .then(response => {
        console.log('🔧 PlanPurchaseService: purchase API response (200 OK):', response.data);
        return response.data;
      })
      .catch(error => {
        console.log('🔧 PlanPurchaseService: purchase API error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
        
        if (error.response?.status === 400) {
          console.log('🔧 PlanPurchaseService: 400 Bad Request detected');
          console.log('🔧 PlanPurchaseService: Response data:', error.response.data);
        }
        
        throw error;
      });
  },

  /**
   * Check the status of a plan purchase order
   * @param orderId - The ID of the order to check
   * @returns Promise with the order status response
   */
  checkOrderStatus(orderId: string): Promise<PlanOrderStatusResponse> {
    console.log('🔧 PlanPurchaseService: Making API request to check order status');
    
    return apiClient
      .get(`/user-plan/order-status/${orderId}`)
      .then(response => {
        console.log('🔧 PlanPurchaseService: order status API response (200 OK):', response.data);
        return response.data;
      })
      .catch(error => {
        console.log('🔧 PlanPurchaseService: order status API error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
        
        throw error;
      });
  },

  /**
   * Calculate the discounted price based on duration
   * @param basePrice - The base price of the plan
   * @param duration - The duration in months (1, 3, or 12)
   * @param discountOneMonth - Discount percentage for 1 month
   * @param discountThreeMonths - Discount percentage for 3 months
   * @param discountTwelveMonths - Discount percentage for 12 months
   * @returns The discounted price
   */
  calculateDiscountedPrice(
    basePrice: number, 
    duration: number, 
    discountOneMonth: number = 0, 
    discountThreeMonths: number = 15, 
    discountTwelveMonths: number = 30
  ): number {
    let discountPercentage = 0;
    
    if (duration === 1) {
      discountPercentage = discountOneMonth;
    } else if (duration === 3) {
      discountPercentage = discountThreeMonths;
    } else if (duration === 12) {
      discountPercentage = discountTwelveMonths;
    }
    
    const discountMultiplier = (100 - discountPercentage) / 100;
    const totalBeforeDiscount = basePrice * duration;
    const totalAfterDiscount = totalBeforeDiscount * discountMultiplier;
    
    return Math.round(totalAfterDiscount);
  },

  /**
   * Get the duration in months from a package ID
   * @param packageId - The package ID (e.g., "1month", "3months", "12months")
   * @returns The duration in months
   */
  getDurationFromPackageId(packageId: string): number {
    if (packageId === '1month') return 1;
    if (packageId === '3months') return 3;
    if (packageId === '12months') return 12;
    return 1; // Default to 1 month
  }
};

export default PlanPurchaseService;
