import axios from 'axios';
import appConfig from '../configs/app.config';
import googleAuthService from './GoogleAuthService';

// Define interfaces for the plan data
export interface PlanData {
  name: string;
  price: number;
  tokenCounts: number;
  description: string;
  discountOneMonth: number;
  discountThreeMonths: number;
  discountTwelveMonths: number;
  created: string;
  lastModified: string;
  id: string;
  domainEvents: any[];
}

export interface PlansResponse {
  data: PlanData[];
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

const PlanService = {
  // Get all plans
  getPlans(opts: { signal?: AbortSignal } = {}): Promise<PlansResponse> {
    console.log('🔧 PlanService: Making API request to /plans');
    
    return apiClient
      .get('/plans', { 
        signal: opts.signal 
      })
      .then(response => {
        console.log('🔧 PlanService: plans API response (200 OK):', response.data);
        return response.data;
      })
      .catch(error => {
        console.log('🔧 PlanService: plans API error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
        
        if (error.response?.status === 400) {
          console.log('🔧 PlanService: 400 Bad Request detected');
          console.log('🔧 PlanService: Response data:', error.response.data);
        }
        
        throw error;
      });
  },

  // Extract simple plan name (Free, Plus, Ultimate) from full plan name
  extractPlanName(fullPlanName: string): string {
    const planName = fullPlanName.toLowerCase();
    
    if (planName.includes('free') || planName.includes('miễn phí')) {
      return 'Free';
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

export default PlanService;
