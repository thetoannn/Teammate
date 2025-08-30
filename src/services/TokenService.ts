import ApiCoreService from './base/ApiCoreService';

interface TokenPurchaseResponse {
  bankCode: string;
  bankName: string;
  bankAccount: string;
  userBankName: string;
  content: string;
  qrCode: string;
  imgId: string;
  amount: string;
  orderId: string;
  existing: number;
  transactionId: string;
  transactionRefId: string;
  qrLink: string;
}

interface PollingOrderStatusResponse {
  status: string;
  message?: string;
}

interface CommonResponse<T> {
  data: T;
  code: number;
  message: string;
}

interface PaginatedResponse<T> {
  data: {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  code: number;
  message: string;
}

interface PackageTypeResponse {
  id: string;
  name: string;
  tokenCounts: number;
  price: number;
}

const TokenService = {
  // Get available token packages from server
  async getTokenPackages(): Promise<PackageTypeResponse[]> {
    try {
      console.log('🔍 TokenService: Fetching available token packages...');
      
      // Try multiple possible endpoints for fetching packages
      const possibleEndpoints = [
        "/token-packages",
        "/packages", 
        "/user-token-packages",
        "/token-purchase-packages"
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔍 TokenService: Trying endpoint: ${endpoint}`);
          response = await ApiCoreService.authenticatedRequest<PaginatedResponse<PackageTypeResponse>>({
            url: endpoint,
            method: "get",
          });
          
          if (response && response.data) {
            console.log(`✅ TokenService: Successfully fetched packages from ${endpoint}`);
            break;
          }
        } catch (error) {
          console.warn(`⚠️ TokenService: Endpoint ${endpoint} failed:`, error);
          lastError = error;
          continue;
        }
      }

      if (!response) {
        console.error('❌ TokenService: All package endpoints failed, using fallback packages');
        // Return fallback packages based on the frontend package structure
        return [
          {
            id: "basic-package-id",
            name: "Gói cơ bản",
            tokenCounts: 1000000,
            price: 500000
          },
          {
            id: "standard-package-id", 
            name: "Gói tiêu chuẩn",
            tokenCounts: 2000000,
            price: 1000000
          },
          {
            id: "premium-package-id",
            name: "Gói nâng cao", 
            tokenCounts: 5000000,
            price: 2500000
          }
        ];
      }

      // Handle different response structures
      let packages: PackageTypeResponse[] = [];
      
      if (response.data.data && response.data.data.items) {
        // Paginated response structure
        packages = response.data.data.items;
      } else if (Array.isArray(response.data.data)) {
        // Direct array response
        packages = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Simple array response
        packages = response.data;
      }

      if (packages && packages.length > 0) {
        console.log('✅ TokenService: Available packages:', packages);
        return packages.reverse();
      }

      console.warn('⚠️ TokenService: No packages found in response, using fallback');
      return [
        {
          id: "basic-package-id",
          name: "Gói cơ bản", 
          tokenCounts: 1000000,
          price: 500000
        },
        {
          id: "standard-package-id",
          name: "Gói tiêu chuẩn",
          tokenCounts: 2000000, 
          price: 1000000
        },
        {
          id: "premium-package-id",
          name: "Gói nâng cao",
          tokenCounts: 5000000,
          price: 2500000
        }
      ];
    } catch (error) {
      console.error('❌ TokenService: Failed to fetch packages:', error);
      // Return fallback packages to prevent complete failure
      return [
        {
          id: "basic-package-id",
          name: "Gói cơ bản",
          tokenCounts: 1000000,
          price: 500000
        },
        {
          id: "standard-package-id",
          name: "Gói tiêu chuẩn", 
          tokenCounts: 2000000,
          price: 1000000
        },
        {
          id: "premium-package-id",
          name: "Gói nâng cao",
          tokenCounts: 5000000,
          price: 2500000
        }
      ];
    }
  },

  // Map package names to server package IDs
  async getPackageIdByName(packageName: string): Promise<string | null> {
    try {
      console.log(`🔍 TokenService: Looking for package ID for: ${packageName}`);
      const packages = await this.getTokenPackages();
      
      if (!packages || packages.length === 0) {
        console.warn('⚠️ TokenService: No packages available for ID mapping');
        return null;
      }

      console.log('🔍 TokenService: Available packages for mapping:', packages.map(p => ({ id: p.id, name: p.name })));
      
      // Map frontend package names to server package names with more variations
      const packageNameMap: Record<string, string[]> = {
        'basic': ['basic', 'cơ bản', 'gói cơ bản', 'co ban', 'goi co ban', 'basic-package-id'],
        'standard': ['standard', 'tiêu chuẩn', 'gói tiêu chuẩn', 'tieu chuan', 'goi tieu chuan', 'standard-package-id'],
        'premium': ['premium', 'nâng cao', 'gói nâng cao', 'nang cao', 'goi nang cao', 'premium-package-id']
      };

      const searchNames = packageNameMap[packageName.toLowerCase()] || [packageName.toLowerCase()];
      console.log(`🔍 TokenService: Searching for names: ${searchNames.join(', ')}`);
      
      // First try exact ID match (in case the package name is already an ID)
      let foundPackage = packages.find(pkg => pkg.id === packageName);
      if (foundPackage) {
        console.log(`✅ TokenService: Found exact ID match for ${packageName}:`, foundPackage.id);
        return foundPackage.id;
      }

      // Then try name variations
      foundPackage = packages.find(pkg => 
        searchNames.some(name => {
          const pkgName = pkg.name?.toLowerCase() || '';
          const pkgId = pkg.id?.toLowerCase() || '';
          return pkgName.includes(name) || 
                 name.includes(pkgName) ||
                 pkgId.includes(name) ||
                 name.includes(pkgId);
        })
      );

      if (foundPackage && foundPackage.id) {
        console.log(`✅ TokenService: Found server ID for ${packageName}:`, foundPackage.id);
        return foundPackage.id;
      }

      // If no match found, try to use the first package that matches the price/token count
      const packagePriceMap: Record<string, number> = {
        'basic': 500000,
        'standard': 1000000, 
        'premium': 2500000
      };

      const expectedPrice = packagePriceMap[packageName.toLowerCase()];
      if (expectedPrice) {
        foundPackage = packages.find(pkg => pkg.price === expectedPrice);
        if (foundPackage) {
          console.log(`✅ TokenService: Found package by price match for ${packageName}:`, foundPackage.id);
          return foundPackage.id;
        }
      }

      console.warn(`⚠️ TokenService: No server package found for ${packageName}`);
      console.warn('Available packages:', packages.map(p => `${p.id} - ${p.name} - ${p.price}`));
      return null;
    } catch (error) {
      console.error(`❌ TokenService: Error getting server ID for ${packageName}:`, error);
      return null;
    }
  },

  // Simplified token purchase following src2 pattern
  async postTokenPurchase<T>(data: { tokenPackageId: string }): Promise<{ data: CommonResponse<TokenPurchaseResponse> }> {
    try {
      // Validate input data
      if (!data.tokenPackageId || typeof data.tokenPackageId !== 'string') {
        throw new Error('Invalid token package ID provided');
      }

      console.log('🚀 TokenService: Initiating token purchase for package:', data.tokenPackageId);

      // Check if this is a frontend package name that needs to be converted to server ID
      let packageId = data.tokenPackageId;
      
      // If it's one of our frontend names, convert to server ID
      if (['basic', 'standard', 'premium'].includes(data.tokenPackageId.toLowerCase())) {
        console.log(`🔄 TokenService: Converting frontend package name "${data.tokenPackageId}" to server ID...`);
        const serverId = await this.getPackageIdByName(data.tokenPackageId);
        if (serverId) {
          packageId = serverId;
          console.log(`✅ TokenService: Successfully converted ${data.tokenPackageId} to server ID: ${packageId}`);
        } else {
          console.error(`❌ TokenService: Failed to convert package name "${data.tokenPackageId}" to server ID`);
          
          // Try to get available packages for better error message
          const availablePackages = await this.getTokenPackages();
          const packageList = availablePackages.map(p => `${p.id} (${p.name})`).join(', ');
          
          throw new Error(`Package "${data.tokenPackageId}" not found on server. Available packages: ${packageList || 'None found'}`);
        }
      } else {
        console.log(`🔍 TokenService: Using package ID as-is: ${packageId}`);
      }

      console.log('🔍 TokenService: Final package ID for API call:', packageId);
      console.log('🔍 TokenService: Request payload:', { tokenPackageId: packageId });

      // Make API call following src2 pattern (direct data, no model wrapper)
      const response = await ApiCoreService.authenticatedRequest<CommonResponse<TokenPurchaseResponse>>({
        url: "/user-token-purchases",
        method: "post",
        data: { 
          tokenPackageId: packageId
        },
      });

      if (response && response.data && response.data.data) {
        console.log('✅ TokenService: Received payment details from backend');
        return {
          data: response.data
        };
      }

      throw new Error('Invalid response from payment details API');

    } catch (error) {
      console.error('❌ TokenService: Token purchase failed:', error);
      
      // Enhanced error handling with more context
      if (error instanceof Error) {
        // Add more context to common errors
        if (error.message.includes('TOKEN_PACKAGE_NOT_FOUND')) {
          const enhancedMessage = `Token package not found: "${data.tokenPackageId}". This usually means the package ID doesn't exist on the server. Please check the available packages or contact support.`;
          throw new Error(enhancedMessage);
        }
        throw error;
      }
      throw new Error('Token purchase failed: Unknown error');
    }
  },

  // Helper method to get package amount
  getPackageAmount(packageId: string): string {
    const amounts: Record<string, string> = {
      'basic': '500000',
      'standard': '1000000',
      'premium': '2500000'
    };
    return amounts[packageId] || '1000000';
  },

  async pollingOrderStatus<T>(orderId: string): Promise<{ data: CommonResponse<PollingOrderStatusResponse> }> {
    try {
      // Validate input
      if (!orderId || typeof orderId !== 'string') {
        throw new Error('Invalid order ID provided');
      }

      console.log('🔍 TokenService: Polling order status for:', orderId);

      // Real backend API call for order status checking
      const response = await ApiCoreService.authenticatedRequest<CommonResponse<PollingOrderStatusResponse>>({
        url: `/user-token-purchases/status-order?orderId=${orderId}`,
        method: "get",
      });

      if (response && response.data) {
        console.log('✅ TokenService: Order status retrieved successfully:', response.data);
        return {
          data: response.data
        };
      }

      throw new Error('Invalid response from order status API');

    } catch (error) {
      console.error('❌ TokenService: Order status polling failed:', error);
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Order status check failed: ${error.message}`);
      }
      throw new Error('Order status check failed: Unknown error');
    }
  },

  // Helper method to validate token purchase response
  validateTokenPurchaseResponse(response: any): response is TokenPurchaseResponse {
    return (
      response &&
      typeof response.orderId === 'string' &&
      typeof response.qrCode === 'string' &&
      typeof response.amount === 'string'
    );
  },

  // Helper method to validate polling response
  validatePollingResponse(response: any): response is PollingOrderStatusResponse {
    return (
      response &&
      typeof response.status === 'string'
    );
  }
};

export default TokenService;
export type { TokenPurchaseResponse, PollingOrderStatusResponse, CommonResponse, PackageTypeResponse };
