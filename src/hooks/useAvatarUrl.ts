import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import avatarService from '../services/AvatarService';

export const useAvatarUrl = (avatarPath: string | undefined | null) => {
  const queryClient = useQueryClient();
  
  // Memoize the query key to prevent unnecessary re-renders
  const queryKey = useMemo(() => ['avatar', avatarPath], [avatarPath]);

  // Get existing cached data immediately
  const existingData = queryClient.getQueryData<string | null>(queryKey);

  // Use React Query for caching and optimized data fetching
  const {
    data: avatarUrl,
    isLoading,
    error,
    isFetching
  } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('🔍 useAvatarUrl: Loading avatar for path:', avatarPath);
      
      if (!avatarPath) {
        console.log('🔍 useAvatarUrl: No avatar path provided');
        return null;
      }

      // If it's already a full URL, use it directly
      if (avatarPath.startsWith('http')) {
        console.log('🔍 useAvatarUrl: Using full URL directly:', avatarPath);
        return avatarPath;
      }

      console.log('🔍 useAvatarUrl: Getting display URL for:', avatarPath);
      const displayUrl = await avatarService.getDisplayUrl(avatarPath);
      console.log('🔍 useAvatarUrl: Got display URL:', displayUrl);
      return displayUrl;
    },
    enabled: !!avatarPath, // Only run query if avatarPath exists
    staleTime: Infinity, // Never consider data stale - only refetch when explicitly invalidated
    gcTime: Infinity, // Keep in cache forever
    retry: 2, // Retry failed requests twice
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    initialData: existingData || undefined, // Use existing cached data immediately
    placeholderData: existingData || undefined, // Show cached data while fetching
  });

  // Determine the final avatar URL and loading state
  const finalAvatarUrl = avatarUrl || existingData || null;
  const isActuallyLoading = isLoading && !existingData && !!avatarPath;

  // Memoize the return value to prevent unnecessary re-renders
  const result = useMemo(() => ({
    avatarUrl: finalAvatarUrl,
    loading: isActuallyLoading, // Only show loading if no cached data exists and we have a path
    error
  }), [finalAvatarUrl, isActuallyLoading, error]);

  return result;
};

export default useAvatarUrl;
