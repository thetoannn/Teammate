import { useQuery } from '@tanstack/react-query';
import TokenHistoryService, { type TokenHistoryResponse, type TokenHistoryParams } from '../services/TokenHistoryService';

interface UseTokenHistoryOptions {
  FromDate?: string;
  ToDate?: string;
  PageNumber?: number;
  PageSize?: number;
  enabled?: boolean;
}

export const useTokenHistory = (options: UseTokenHistoryOptions = {}) => {
  const { FromDate, ToDate, PageNumber = 1, PageSize = 12, enabled = true } = options;

  return useQuery<TokenHistoryResponse, Error>({
    queryKey: ['tokenHistory', FromDate, ToDate, PageNumber, PageSize],
    queryFn: async ({ signal }) => {
      const params: TokenHistoryParams = {
        FromDate,
        ToDate,
        PageNumber,
        PageSize,
      };
      return TokenHistoryService.getTokenHistory(params, { signal });
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.message.includes('Authentication required')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Transformed hook that maps API data to UI format
export const useTransformedTokenHistory = (options: UseTokenHistoryOptions = {}) => {
  const query = useTokenHistory(options);

  const transformedData = query.data && query.data.data && query.data.data.items ? {
    ...query.data,
    data: {
      ...query.data.data,
      items: query.data.data.items.map(item => ({
        id: `${item.usedAt}-${item.tokensUsed}`, // Create unique ID
        date: TokenHistoryService.formatDate(item.usedAt),
        type: TokenHistoryService.getTypeDisplay(item.type),
        typeColor: TokenHistoryService.getTypeColorClass(item.type),
        credits: TokenHistoryService.formatCreditsWithSign(item.tokensUsed, item.type),
        details: item.description,
        balance: TokenHistoryService.formatTokens(item.remainingTokens),
        // Keep original data for reference
        originalData: item,
      }))
    }
  } : undefined;

  return {
    ...query,
    data: transformedData,
  };
};
