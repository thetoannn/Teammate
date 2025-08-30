 import { v4 as uuidv4 } from "uuid";
import appConfig from '../configs/app.config';
import googleAuthService from './GoogleAuthService';

export interface CommonResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

const FileService = {
  async getPreSignedUrl<T>(fileName: string): Promise<CommonResponse<string>> {
    try {
      const token = await googleAuthService.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const params = new URLSearchParams({
        filePath: fileName,
        httpMethod: "PUT",
      });

      const response = await fetch(`${appConfig.apiCorePrefixV2}/api/upload/get-presigned-url?${params}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get presigned URL: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('❌ Failed to get presigned URL:', error);
      return {
        success: false,
        data: '',
        error: error instanceof Error ? error.message : 'Failed to get presigned URL'
      };
    }
  },

  async getPreSignedGetUrl<T>(fileName: string): Promise<CommonResponse<string>> {
    try {
      const token = await googleAuthService.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const params = new URLSearchParams({
        filePath: fileName,
        httpMethod: "GET",
      });

      const response = await fetch(`${appConfig.apiCorePrefixV2}/api/upload/get-presigned-url?${params}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get presigned URL: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('❌ Failed to get presigned URL:', error);
      return {
        success: false,
        data: '',
        error: error instanceof Error ? error.message : 'Failed to get presigned URL'
      };
    }
  },

  async uploadFile(file: File, username: string): Promise<string> {
    const randomId = uuidv4();
    const fileName = `${username}/${randomId}${file.name.substring(file.name.lastIndexOf("."))}`;

    const preSignedUrlResponse = await FileService.getPreSignedUrl<string>(fileName);
    
    if (!preSignedUrlResponse.success) {
      throw new Error(preSignedUrlResponse.error || 'Failed to get presigned URL');
    }

    const uploadResponse = await fetch(preSignedUrlResponse.data, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    return fileName;
  },
};

export default FileService;
