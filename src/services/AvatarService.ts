import appConfig from '../configs/app.config';
import googleAuthService from './GoogleAuthService';

class AvatarService {
  /**
   * Get the full URL for an uploaded avatar file
   */
  async getAvatarUrl(filePath: string): Promise<string | null> {
    try {
      const token = await googleAuthService.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const params = new URLSearchParams({
        filePath: filePath,
        httpMethod: 'GET'
      });

      const response = await fetch(`${appConfig.apiCorePrefixV2}/api/upload/get-presigned-url?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get avatar URL: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error('❌ Failed to get avatar URL:', error);
      return null;
    }
  }

  /**
   * Get display URL for avatar - returns full URL if it's a file path, or the original URL if it's already a full URL
   */
  async getDisplayUrl(avatarUrl: string): Promise<string> {
    // If it's already a full URL (starts with http), return as is
    if (avatarUrl.startsWith('http')) {
      return avatarUrl;
    }

    // Skip the failing direct URL attempt and go straight to presigned URL
    // This eliminates the 404 error and reduces loading time
    const presignedUrl = await this.getAvatarUrl(avatarUrl);
    if (presignedUrl) {
      console.log('✅ Presigned avatar URL:', presignedUrl);
      return presignedUrl;
    }

    // Fallback to direct URL only if presigned URL fails
    const directUrl = `https://api.nhansuso.vn/uploads/${avatarUrl}`;
    console.log('⚠️ Using direct URL as fallback:', directUrl);
    return directUrl;
  }
}

const avatarService = new AvatarService();
export default avatarService;
