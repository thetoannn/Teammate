import axios from 'axios';
import appConfig from '../configs/app.config';
import googleAuthService from './GoogleAuthService';

interface TokenHistoryItem {
  type: string;
  tokensUsed: number;
  description: string;
  remainingTokens: number;
  usedAt: string;
}

interface TokenHistoryResponse {
  data: {
    items: TokenHistoryItem[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  code: number;
  message: string;
}

interface TokenHistoryParams {
  FromDate?: string;
  ToDate?: string;
  PageNumber?: number;
  PageSize?: number;
  signal?: AbortSignal;
}

const apiClient = axios.create({
  baseURL: appConfig.apiCorePrefix,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const authToken = await googleAuthService.getAuthToken();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

const TokenHistoryService = {
  getTokenHistory(params: TokenHistoryParams, opts: { signal?: AbortSignal } = {}): Promise<TokenHistoryResponse> {
    return apiClient
      .get('/users/tokens/history', { 
        params, 
        signal: opts.signal 
      })
      .then(r => r.data);
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

  getTypeDisplay(type: string): string {
    const typeMap: Record<string, string> = {
      'USE': 'Sử dụng',
      'ADD': 'Nạp thêm',
      'GIFT': 'Tặng tự động',
      'REFUND': 'Hoàn trả',
      'BONUS': 'Thưởng',
      'RECHARGE': 'Nạp thêm',
      'AUTO': 'Tặng tự động',
    };
    
    return typeMap[type] || type;
  },

  getTypeColorClass(type: string): string {
    const colorMap: Record<string, string> = {
      'USE': 'text-red-500',
      'ADD': 'text-blue-500',
      'GIFT': 'text-green-500',
      'REFUND': 'text-yellow-500',
      'BONUS': 'text-purple-500',
      'RECHARGE': 'text-[#4374FF]',
      'AUTO': 'text-[#16A34A]',
    };
    
    return colorMap[type] || 'text-white/70';
  },

  formatCreditsWithSign(tokensUsed: number, type: string): string {
    const formattedTokens = this.formatTokens(tokensUsed);
    
    if (type === 'USE') {
      return `-${formattedTokens}`;
    } else {
      return `+${formattedTokens}`;
    }
  }
};

export default TokenHistoryService;
export type { TokenHistoryItem, TokenHistoryResponse, TokenHistoryParams };
