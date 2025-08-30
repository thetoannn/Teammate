import { useState, useCallback } from 'react';
import uploadAvatarService, { UploadResponse } from './UploadAvatarService';
import { useAuth } from '../../hooks/useAuth';

export interface UseAvatarUploadReturn {
  uploading: boolean;
  error: string | null;
  uploadAvatar: (file: File) => Promise<UploadResponse>;
  clearError: () => void;
}

export const useAvatarUpload = (): UseAvatarUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadAvatar = useCallback(async (file: File): Promise<UploadResponse> => {
    if (!user) {
      const errorMsg = 'User must be authenticated to upload avatar';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setUploading(true);
    setError(null);

    try {
      console.log('🚀 Starting avatar upload for file:', file.name);
      
      // Upload the avatar
      const uploadResult = await uploadAvatarService.uploadAvatar(file);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      console.log('✅ Avatar uploaded successfully:', uploadResult.fileUrl);

 
      if (uploadResult.fileUrl) {
        const updateResult = await uploadAvatarService.updateUserAvatar(uploadResult.fileUrl);
        if (!updateResult.success) {
          console.warn('⚠️ Avatar uploaded but profile update failed:', updateResult.error);
        
        }
      }

      return uploadResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Avatar upload failed';
      console.error('❌ Avatar upload error:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploading,
    error,
    uploadAvatar,
    clearError
  };
};

export default useAvatarUpload;
