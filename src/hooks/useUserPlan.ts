import { useQuery } from '@tanstack/react-query';
import UserPlanService, { type UserPlanResponse, type UserPlanParams } from '../services/UserPlanService';

interface UseUserPlanOptions {
  pageNumber?: number;
  pageSize?: number;
  enabled?: boolean;
}

export const useUserPlan = (options: UseUserPlanOptions = {}) => {
  const { pageNumber = 1, pageSize = 12, enabled = true } = options;

  return useQuery<UserPlanResponse, Error>({
    queryKey: ['userPlan', pageNumber, pageSize],
    queryFn: async ({ signal }) => {
      const params: UserPlanParams = {
        pageNumber,
        pageSize,
      };
      return UserPlanService.getUserPlans(params, { signal });
    },
    enabled,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: (failureCount, error) => {
      
      if (error.message.includes('Authentication required')) {
        return false;
      }
      
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};


export const useTransformedUserPlan = (options: UseUserPlanOptions = {}) => {
  const query = useUserPlan(options);

  const transformedData = query.data && query.data.data && query.data.data.items ? {
    ...query.data,
    data: {
      ...query.data.data,
      items: query.data.data.items.map(item => ({
        id: item.id,
        date: UserPlanService.formatDate(item.paidAt),
        invoiceNumber: item.orderId,
        status: UserPlanService.getStatusDisplay(item.status),
        statusColor: UserPlanService.getStatusColorClass(item.status),
        details: item.planName,
        amount: UserPlanService.formatCurrency(item.totalPrice),
        rawAmount: item.totalPrice,
        action: "Xem hóa đơn",
        
        originalData: item,
      }))
    }
  } : undefined;


  return {
    ...query,
    data: transformedData,
  };
};
