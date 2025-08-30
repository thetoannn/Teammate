import axios from 'axios';
import appConfig from '../configs/app.config';
import googleAuthService from './GoogleAuthService';

interface CurrentPlanData {
  username: string;
  orderId: string;
  bankAccountNumber: string;
  bankName: string;
  planPrice: number;
  totalPrice: number;
  bankCode: string;
  content: string;
  status: string;
  duration: number;
  planName: string;
  planId: string;
  endDate: string;
  created: string;
  lastModified: string;
  id: string;
  domainEvents: any[];
}

interface CurrentPlanResponse {
  data: CurrentPlanData;
  code: number;
  message: string;
}

const apiClient = axios.create({
  baseURL: appConfig.apiCorePrefix,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add auth interceptor - using exact same pattern as UserPlanService
apiClient.interceptors.request.use(async (config) => {
  const authToken = await googleAuthService.getAuthToken();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

const CurrentPlanService = {
  getCurrentPlan(opts: { signal?: AbortSignal } = {}): Promise<CurrentPlanResponse> {
    console.log('🔧 CurrentPlanService: Making API request to /user-plan/current-plan (using UserPlanService pattern)');
    
    // Use exact same pattern as UserPlanService.getUserPlans()
    return apiClient
      .get('/user-plan/current-plan', { 
        signal: opts.signal 
      })
      .then(response => {
        console.log('🔧 CurrentPlanService: current-plan API response (200 OK):', response.data);
        return response.data;
      })
      .catch(error => {
        console.log('🔧 CurrentPlanService: current-plan API error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
        
        // Log the 400 status as requested
        if (error.response?.status === 400) {
          console.log('🔧 CurrentPlanService: 400 Bad Request detected');
          console.log('🔧 CurrentPlanService: Response data:', error.response.data);
        }
        
        throw error;
      });
  },

  // Extract simple plan name (Basic, Plus, Ultra) from full plan name
  extractPlanName(fullPlanName: string): string {
    const planName = fullPlanName.toLowerCase();
    
    if (planName.includes('free') || planName.includes('miễn phí')) {
      return 'Free';
    } else if (planName.includes('basic') || planName.includes('cơ bản')) {
      return 'Basic';
    } else if (planName.includes('plus') || planName.includes('nâng cao')) {
      return 'Plus';
    } else if (planName.includes('ultimate') || planName.includes('ultra') || planName.includes('cao cấp') || planName.includes('premium')) {
      return 'Ultimate';
    }
    
    // Extract the word after "Gói" if it exists
    const goiMatch = fullPlanName.match(/Gói\s+(\w+)/i);
    if (goiMatch) {
      const extractedName = goiMatch[1];
      // Return the extracted name with proper capitalization
      return extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
    }
    
    // Fallback: return the original name if no match
    return fullPlanName;
  }
};

export default CurrentPlanService;
export type { CurrentPlanData, CurrentPlanResponse };
