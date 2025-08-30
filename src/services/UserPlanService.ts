import axios from 'axios';
import appConfig from '../configs/app.config';
import googleAuthService from './GoogleAuthService';

interface UserPlanItem {
  id: string;
  orderId: string;
  paidAt: string | null;
  planName: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
}

interface UserPlanResponse {
  data: {
    items: UserPlanItem[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  code: number;
  message: string;
}

interface UserPlanParams {
  pageNumber?: number;
  pageSize?: number;
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

const UserPlanService = {
  getUserPlans(params: UserPlanParams, opts: { signal?: AbortSignal } = {}): Promise<UserPlanResponse> {
    return apiClient
      .get('/user-plan/history', { 
        params, 
        signal: opts.signal 
      })
      .then(r => r.data);
  },

  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  },

  
  formatDate(dateString: string | null): string {
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

  
  getStatusDisplay(status: string): string {
    const statusMap: Record<string, string> = {
      'SUCCESS': 'Thành công',
      'PENDING': 'Đang xử lý',
      'FAILED': 'Thất bại',
      'CANCELLED': 'Đã hủy',
    };
    
    return statusMap[status] || status;
  },

  
  getStatusColorClass(status: string): string {
    const colorMap: Record<string, string> = {
      'SUCCESS': 'text-[#4374FF]',
      'PENDING': 'text-yellow-500',
      'FAILED': 'text-red-500',
      'CANCELLED': 'text-gray-500',
    };
    
    return colorMap[status] || 'text-white/70';
  }
};

export default UserPlanService;
export type { UserPlanItem, UserPlanResponse, UserPlanParams };
