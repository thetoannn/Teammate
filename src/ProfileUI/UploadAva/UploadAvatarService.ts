import appConfig from '../../configs/app.config';
import googleAuthService from '../../services/GoogleAuthService';
import FileService from '../../services/FileService';

export interface PresignedUrlResponse {
  success: boolean;
  uploadUrl?: string;
  fileUrl?: string;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

class UploadAvatarService {
 
  async uploadAvatar(file: File): Promise<UploadResponse> {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }

      // Get current user info
      const user = googleAuthService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('🚀 Starting avatar upload using FileService...');
      
      // Use the FileService which follows the working example pattern
      const fileName = await FileService.uploadFile(file, user.email);
      
      console.log('✅ Avatar uploaded successfully:', fileName);

      return {
        success: true,
        fileUrl: fileName
      };
    } catch (error) {
      console.error('❌ Avatar upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Avatar upload failed'
      };
    }
  }

 
  async updateUserAvatar(avatarUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await googleAuthService.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await googleAuthService.authenticatedFetch(
        `${appConfig.apiCorePrefixV2}/api/user/update-avatar`,
        {
          method: 'PUT',
          body: JSON.stringify({ avatarUrl })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update avatar: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Failed to update user avatar:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update avatar'
      };
    }
  }
}


const uploadAvatarService = new UploadAvatarService();
export default uploadAvatarService;
