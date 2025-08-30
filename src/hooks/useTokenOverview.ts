import { useQuery } from '@tanstack/react-query';
import TokenOverviewService, { type TokenOverviewResponse, type TokenOverviewParams } from '../services/TokenOverviewService';

interface UseTokenOverviewOptions {
  FromDate?: string;
  ToDate?: string;
  enabled?: boolean;
}

export const useTokenOverview = (options: UseTokenOverviewOptions = {}) => {
  const { FromDate, ToDate, enabled = true } = options;

  return useQuery<TokenOverviewResponse, Error>({
    queryKey: ['tokenOverview', FromDate, ToDate],
    queryFn: async ({ signal }) => {
      const params: TokenOverviewParams = {
        FromDate,
        ToDate,
      };
      return TokenOverviewService.getTokenOverview(params, { signal });
    },
    enabled,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: (failureCount, error: any) => {
     
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.log('🔒 useTokenOverview: Authentication error, not retrying');
        return false;
      }
      
      
      if (error?.response?.status === 400) {
        console.log('📝 useTokenOverview: Bad request error, not retrying');
        return false;
      }
      
      
      if (error.message.includes('Authentication required') || error.message.includes('No auth token')) {
        console.log('🔑 useTokenOverview: No auth token available, not retrying');
        return false;
      }
      
      
      console.log(`🔄 useTokenOverview: Retrying request (attempt ${failureCount + 1}/3)`);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};


export const useTransformedTokenOverview = (options: UseTokenOverviewOptions = {}) => {
  const query = useTokenOverview(options);

  
  const hasData = query.data?.data && query.data.code === 0;
  
  
  const dataToUse = hasData && query.data ? query.data.data : null;

  const transformedData = dataToUse ? {
    totalPurchased: {
      value: TokenOverviewService.formatTokens(dataToUse.totalPointPurchased),
      lastUpdate: TokenOverviewService.formatDateForDisplay(
        dataToUse.lastPurchasedDate || new Date().toISOString()
      ),
    },
    totalUsed: {
      value: TokenOverviewService.formatTokens(dataToUse.totalPointUsed),
      lastUpdate: TokenOverviewService.formatDateForDisplay(
        dataToUse.lastUsedDate || dataToUse.lastPurchasedDate || new Date().toISOString()
      ),
    },
    currentBalance: {
      value: TokenOverviewService.formatTokens(dataToUse.totalPointBalance),
      lastUpdate: TokenOverviewService.formatDateForDisplay(
        dataToUse.lastBalanceUpdateDate || dataToUse.lastPurchasedDate || new Date().toISOString()
      ),
    },
    
    originalData: dataToUse,
  } : undefined;

  
  return {
    ...query,
    data: transformedData,
  };
};
