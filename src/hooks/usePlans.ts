import { useQuery } from '@tanstack/react-query';
import PlanService, { type PlansResponse } from '../services/PlanService';
import { useAuth } from './useAuth';

interface UsePlansOptions {
  enabled?: boolean;
}

export const usePlans = (options: UsePlansOptions = {}) => {
  const { isAuthenticated } = useAuth();
  const { enabled = true } = options;

  console.log('🔄 usePlans hook called - isAuthenticated:', isAuthenticated, 'enabled:', enabled);

  const query = useQuery<PlansResponse, Error>({
    queryKey: ['plans'],
    queryFn: async ({ signal }) => {
      console.log('🚀 Plans API - Making request to /plans...');
      try {
        const response = await PlanService.getPlans({ signal });
        console.log('✅ Plans API - Status: 200 (Success)', response);
        return response;
      } catch (error: any) {
        console.log('❌ Plans API - Error occurred:', error);
        
        // Handle axios errors
        if (error.response) {
          const status = error.response.status;
          console.log(`❌ Plans API - Status: ${status}`, {
            status,
            data: error.response.data,
            headers: error.response.headers
          });
        } else if (error.request) {
          console.log('❌ Plans API - No response received:', error.request);
        } else {
          console.log('❌ Plans API - Request setup error:', error.message);
        }
        
        throw error;
      }
    },
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      console.log(`🔄 Plans API - Retry attempt ${failureCount}:`, error);
      
      // Don't retry on 400 errors as they are client errors that won't resolve with retries
      if (error.response && error.response.status === 400) {
        console.log('🚫 Plans API - Not retrying 400 Bad Request - client error');
        return false;
      }
      
      // Don't retry if authentication is required
      if (error.message.includes('Authentication required') || error.message.includes('401')) {
        console.log('🚫 Plans API - Not retrying due to auth error');
        return false;
      }
      
      const shouldRetry = failureCount < 3;
      console.log(`🔄 Plans API - Should retry: ${shouldRetry}`);
      return shouldRetry;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Log success/error states
  if (query.isSuccess) {
    console.log('🎉 Plans API - Query success:', query.data);
  }
  if (query.isError) {
    console.log('💥 Plans API - Query error:', query.error);
  }

  return query;
};

// Helper function to find a plan by name
export const findPlanByName = (plans: PlansResponse['data'] | undefined, name: string) => {
  if (!plans) return null;
  
  const normalizedName = name.toLowerCase();
  return plans.find(plan => {
    const planName = plan.name.toLowerCase();
    return planName.includes(normalizedName);
  }) || null;
};

// Helper function to get plans by type
export const getPlansByType = (plans: PlansResponse['data'] | undefined) => {
  if (!plans) return { freePlan: null, plusPlan: null, ultimatePlan: null };
  
  const freePlan = plans.find(plan => 
    plan.name.toLowerCase().includes('free') || 
    plan.name.toLowerCase().includes('miễn phí')
  ) || null;
  
  const plusPlan = plans.find(plan => 
    plan.name.toLowerCase().includes('plus') || 
    plan.name.toLowerCase().includes('nâng cao')
  ) || null;
  
  const ultimatePlan = plans.find(plan => 
    plan.name.toLowerCase().includes('ultimate') || 
    plan.name.toLowerCase().includes('ultra') || 
    plan.name.toLowerCase().includes('cao cấp') || 
    plan.name.toLowerCase().includes('premium')
  ) || null;
  
  return { freePlan, plusPlan, ultimatePlan };
};
