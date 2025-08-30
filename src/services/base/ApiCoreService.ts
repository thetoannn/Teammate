import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import appConfig from '../../configs/app.config';
import googleAuthService from '../GoogleAuthService';

const API_NNS_URL = appConfig.apiCorePrefix;


const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, 
  retryableStatusCodes: [408, 429, 500, 502, 503, 504]
};

const ApiCoreService = {
  
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  
  isRetryableError: (error: AxiosError): boolean => {
    if (!error.response) {
      
      return true;
    }
    
    return RETRY_CONFIG.retryableStatusCodes.includes(error.response.status);
  },

  
  logError: (error: any, context: string): void => {
    console.error(`❌ API Error [${context}]:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });
  },

  request: async <T>(config: AxiosRequestConfig, retryCount = 0): Promise<{ data: T }> => {
    const axiosConfig: AxiosRequestConfig = {
      ...config,
      baseURL: API_NNS_URL,
      withCredentials: false, 
      timeout: 30000, 
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...config.headers,
      },
      
      signal: config.signal,
    };

    
    const authToken = await googleAuthService.getAuthToken();
    if (authToken) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${authToken}`,
      };
    }

    try {
      console.log(`🚀 API Request [${axiosConfig.method?.toUpperCase()}]: ${axiosConfig.url}`);
      const response = await axios(axiosConfig);
      console.log(`✅ API Success [${axiosConfig.method?.toUpperCase()}]: ${axiosConfig.url}`);
      return { data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      const context = `${axiosConfig.method?.toUpperCase()} ${axiosConfig.url}`;
      
      ApiCoreService.logError(axiosError, context);
      
      
      if (axiosError.response?.status === 401) {
        console.warn('🔐 Authentication required, checking auth status...');
        await googleAuthService.checkAuthStatus();
        
        if (!googleAuthService.isAuthenticated()) {
          console.warn('❌ User not authenticated, login required');
          throw new Error('Authentication required. Please log in again.');
        }
      }

      
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as any;
        console.error('🔍 400 Bad Request Details:', {
          url: axiosConfig.url,
          method: axiosConfig.method,
          requestData: axiosConfig.data,
          responseData: errorData,
          validationErrors: errorData?.errors,
          headers: axiosConfig.headers
        });
        
        
        let errorMessage = 'Bad request - check request format';
        if (errorData?.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMessage = `Validation errors: ${validationErrors}`;
        } else if (errorData?.title) {
          errorMessage = errorData.title;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        throw new Error(`Request failed: ${errorMessage}`);
      }

      if (axiosError.response?.status === 404) {
        throw new Error('Resource not found. The requested endpoint may not exist.');
      }

      
      if (retryCount < RETRY_CONFIG.maxRetries && ApiCoreService.isRetryableError(axiosError)) {
        const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retryCount); 
        console.warn(`🔄 Retrying request in ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`);
        
        await ApiCoreService.delay(delay);
        return ApiCoreService.request<T>(config, retryCount + 1);
      }
      
      
      throw error;
    }
  },

  
  authenticatedRequest: async <T>(config: AxiosRequestConfig): Promise<{ data: T }> => {
    
    if (!googleAuthService.isAuthenticated()) {
      console.error('❌ Authentication required but user not authenticated');
      throw new Error('Authentication required. Please log in to continue.');
    }
    
    return ApiCoreService.request<T>(config);
  },

  getAgentActivities: async (pageNumber: number = 1, pageSize: number = 30) => {
    return ApiCoreService.request({
      method: 'GET',
      url: '/agent-activities/get-agent-activities',
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize
      }
    });
  },

  
  getUserProfile: async () => {
    return ApiCoreService.authenticatedRequest({
      method: 'GET',
      url: '/user/profile'
    });
  },

  
  updateUserProfile: async (userData: any) => {
    return ApiCoreService.authenticatedRequest({
      method: 'PUT',
      url: '/user/profile',
      data: userData
    });
  }
};

export default ApiCoreService;
