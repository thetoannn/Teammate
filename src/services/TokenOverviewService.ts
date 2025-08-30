import axios from 'axios';
import appConfig from '../configs/app.config';
import googleAuthService from './GoogleAuthService';

interface TokenOverviewData {
  totalPointPurchased: number;
  totalPointUsed: number;
  totalPointBalance: number;
  lastPurchasedDate: string;
  lastUsedDate: string;
  lastBalanceUpdateDate: string;
}

interface TokenOverviewResponse {
  data: TokenOverviewData;
  code: number;
  message: string;
}

interface TokenOverviewParams {
  FromDate?: string;
  ToDate?: string;
  signal?: AbortSignal;
}

const apiClient = axios.create({
  baseURL: appConfig.apiCorePrefix,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // Broaden Accept to match backend while allowing JSON responses
    'Accept': 'application/json, text/plain, */*',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const authToken = await googleAuthService.getAuthToken();
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log('🔑 TokenOverviewService: Adding auth token to request');
    } else {
      console.warn('⚠️ TokenOverviewService: No auth token available for request');
    }
    return config;
  },
  (error) => {
    console.error('❌ TokenOverviewService: Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ TokenOverviewService: API response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    const respData = error.response?.data;
    let dataText: string | undefined;
    try {
      dataText = typeof respData === 'string' ? respData : JSON.stringify(respData);
    } catch {
      dataText = String(respData);
    }

    // Don't log USER_TOKEN_BALANCE_NOT_FOUND as an error since it's expected for new users
    const isNewUserError = error.response?.status === 400 && 
                           error.response?.data?.message === 'USER_TOKEN_BALANCE_NOT_FOUND';

    if (isNewUserError) {
      console.log('ℹ️ TokenOverviewService: New user detected (no token balance found)');
    } else {
      console.error('❌ TokenOverviewService: API error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        dataText,
        message: error.message
      });

      // Handle specific error cases
      if (error.response?.status === 401) {
        console.error('🔒 TokenOverviewService: Authentication required - token may be invalid or expired');
      } else if (error.response?.status === 400) {
        console.error('📝 TokenOverviewService: Bad Request - check request parameters and token format');
      }
    }

    return Promise.reject(error);
  }
);

const TokenOverviewService = {
  getTokenOverview(params: TokenOverviewParams, opts: { signal?: AbortSignal } = {}): Promise<TokenOverviewResponse> {
    // Sanitize and normalize date params to ISO8601 if provided, drop invalids/empties
    const sanitizeParams = (p?: TokenOverviewParams): Record<string, string> => {
      const out: Record<string, string> = {};
      if (p?.FromDate) {
        const d = new Date(p.FromDate);
        if (!isNaN(d.getTime())) out.FromDate = d.toISOString();
      }
      if (p?.ToDate) {
        const d = new Date(p.ToDate);
        if (!isNaN(d.getTime())) out.ToDate = d.toISOString();
      }
      return out;
    };

    const cleanedParams = sanitizeParams(params);
    const nowIso = new Date().toISOString();

    return apiClient
      .get('/users/tokens/overview', { 
        params: cleanedParams, 
        signal: opts.signal 
      })
      .then(r => r.data)
      .catch((error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || error?.message;

      
        if (status === 400 && message === 'USER_TOKEN_BALANCE_NOT_FOUND') {
          console.log('ℹ️ TokenOverviewService: Converting 400 error to success response with default values');
          const defaultData: TokenOverviewData = {
            totalPointPurchased: 0,
            totalPointUsed: 0,
            totalPointBalance: 0,
            lastPurchasedDate: nowIso,
            lastUsedDate: nowIso,
            lastBalanceUpdateDate: nowIso,
          };
          return {
            data: defaultData,
            code: 0, 
            message: 'Success - New user with default values',
          } as TokenOverviewResponse;
        }

       
        return Promise.reject(error);
      });
  },

  formatTokens(tokens: number): string {
    return new Intl.NumberFormat('vi-VN').format(tokens);
  },

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }); 
    } catch (error) {
      console.warn('Invalid date format:', dateString);
      return 'N/A';
    }
  },

  formatDateForDisplay(dateString: string): string {
    const formattedDate = this.formatDate(dateString);
    return `Cập nhật: ${formattedDate}`;
  }
};

export default TokenOverviewService;
export type { TokenOverviewData, TokenOverviewResponse, TokenOverviewParams };
