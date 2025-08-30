import { useQuery } from '@tanstack/react-query';
import CurrentPlanService, { type CurrentPlanResponse } from '../services/CurrentPlanService';
import { useAuth } from './useAuth';

interface UseCurrentPlanOptions {
  enabled?: boolean;
}

export const useCurrentPlan = (options: UseCurrentPlanOptions = {}) => {
  const { isAuthenticated } = useAuth();
  const { enabled = true } = options;

  console.log('🔄 useCurrentPlan hook called - isAuthenticated:', isAuthenticated, 'enabled:', enabled);

  const query = useQuery<CurrentPlanResponse, Error>({
    queryKey: ['currentPlan'],
    queryFn: async ({ signal }) => {
      console.log('🚀 Current Plan API - Making request to /user-plan/current-plan...');
      try {
        const response = await CurrentPlanService.getCurrentPlan({ signal });
        console.log('✅ Current Plan API - Status: 200 (Success)', response);
        return response;
      } catch (error: any) {
        console.log('❌ Current Plan API - Error occurred:', error);
        
        // Handle axios errors
        if (error.response) {
          const status = error.response.status;
          console.log(`❌ Current Plan API - Status: ${status}`, {
            status,
            data: error.response.data,
            headers: error.response.headers
          });
          
          if (status === 400) {
            console.log('🔴 Current Plan API - 400 Bad Request detected');
          } else if (status === 200) {
            console.log('🟢 Current Plan API - 200 Success detected');
          }
        } else if (error.request) {
          console.log('❌ Current Plan API - No response received:', error.request);
        } else {
          console.log('❌ Current Plan API - Request setup error:', error.message);
        }
        
        throw error;
      }
    },
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      console.log(`🔄 Current Plan API - Retry attempt ${failureCount}:`, error);
      
      // Don't retry on 400 errors as they are client errors that won't resolve with retries
      if (error.response && error.response.status === 400) {
        console.log('🚫 Current Plan API - Not retrying 400 Bad Request - client error');
        return false;
      }
      
      // Don't retry if authentication is required
      if (error.message.includes('Authentication required') || error.message.includes('401')) {
        console.log('🚫 Current Plan API - Not retrying due to auth error');
        return false;
      }
      
      const shouldRetry = failureCount < 3;
      console.log(`🔄 Current Plan API - Should retry: ${shouldRetry}`);
      return shouldRetry;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Log success/error states
  if (query.isSuccess) {
    console.log('🎉 Current Plan API - Query success:', query.data);
  }
  if (query.isError) {
    console.log('💥 Current Plan API - Query error:', query.error);
  }

  return query;
};

// Hook that returns the simplified plan name
export const useCurrentPlanName = (options: UseCurrentPlanOptions = {}) => {
  const query = useCurrentPlan(options);
  
  // Extract plan name from successful response
  const planName = query.data?.data?.planName 
    ? CurrentPlanService.extractPlanName(query.data.data.planName)
    : null;

  return {
    ...query,
    planName,
    isLoading: query.isLoading,
    error: query.error,
    // Additional helper properties
    hasError: !!query.error,
  };
};
