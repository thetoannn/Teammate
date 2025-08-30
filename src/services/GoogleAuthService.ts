  import appConfig from '../configs/app.config';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

class GoogleAuthService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  };
  private listeners: ((state: AuthState) => void)[] = [];
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.checkAuthStatus();
    } else {
      // Initialize with unauthenticated state
      this.updateState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    listener(this.authState);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }


  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.authState));
  }


  private updateState(updates: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...updates };
    this.notifyListeners();
  }

  // New method to update user profile in auth state
  updateUserProfile(userUpdates: Partial<User>): void {
    if (!this.authState.user) return;
    
    const updatedUser = { ...this.authState.user, ...userUpdates };
    
    // Use updateState to ensure proper state update and notification
    this.updateState({
      user: updatedUser
    });
    
    console.log('🔄 GoogleAuthService: User profile updated:', updatedUser);
  }

  /**
   * Refresh user profile from API and update the picture field
   */
  async refreshUserProfile(): Promise<void> {
    try {
      if (!this.token) {
        console.warn('No auth token available for profile refresh');
        return;
      }

      const response = await fetch('https://api.nhansuso.vn/api/user-profile', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Failed to refresh user profile from API');
        return;
      }

      const data = await response.json();
      const profileData = data.data || data;

      if (this.authState.user && profileData.avatar) {
        // Update the user's picture field with the latest avatar from API
        this.updateUserProfile({
          picture: profileData.avatar // Use the raw avatar path from API
        });
        
        console.log('🔄 GoogleAuthService: User profile refreshed with avatar:', profileData.avatar);
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  }



  getState(): AuthState {
    return { ...this.authState };
  }


  async loginWithGoogle(): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });

      // Dynamically determine return URL based on current environment
      const currentOrigin = window.location.origin;
      let returnUrl: string;
      
      // Check if running on localhost
      if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
        returnUrl = encodeURIComponent('http://localhost:5173/');
        console.log('🏠 Detected localhost environment, using localhost return URL');
      } else {
        // Use production URL for all other environments
        returnUrl = encodeURIComponent('https://teammate.nhansuso.vn/');
        console.log('🌐 Using production return URL');
      }
      
      const authUrl = `https://api.nhansuso.vn/login/google?returnurl=${returnUrl}`;
      
      console.log('🚀 Redirecting to Google OAuth:', {
        currentOrigin,
        returnUrl: decodeURIComponent(returnUrl),
        authUrl
      });
      
      window.location.href = authUrl;

    } catch (error) {
      console.error('❌ Google login initiation failed:', error);
      this.updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to initiate Google login'
      });
      throw error;
    }
  }

  /**
   * Handle OAuth callback (called after redirect from Google)
   */
  async handleOAuthCallback(): Promise<AuthResponse> {
    try {
      this.updateState({ loading: true, error: null });

      // Parse URL parameters to get the token
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const error = urlParams.get('error');

      console.log('🔍 OAuth callback - checking URL params:', {
        hasToken: !!token,
        hasError: !!error,
        url: window.location.href
      });

      if (error) {
        const errorMessage = urlParams.get('message') || 'Authentication failed';
        throw new Error(errorMessage);
      }

      if (token) {
        console.log('✅ Token received, storing and decoding...');
        
        // Store the token
        this.token = token;
        localStorage.setItem('auth_token', token);

        // Decode JWT to get user info (basic decode, not verification)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔍 Decoded token payload:', payload);
          
          const user: User = {
            id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub,
            email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email,
            name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.name || payload.given_name || payload.family_name || "User",
            picture: payload.picture || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/picture'],
            verified_email: true
          };

          console.log('✅ User authenticated:', user);

          this.updateState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null
          });

          // Automatically refresh user profile to get the latest avatar
          this.refreshUserProfile();

          // Clean up URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);

          return { success: true, user };
        } catch (decodeError) {
          console.error('❌ Failed to decode token:', decodeError);
          throw new Error('Failed to decode authentication token');
        }
      }

      throw new Error('No authentication token received');

    } catch (error) {
      console.error('❌ OAuth callback handling failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      
      this.updateState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: errorMessage
      });

      // Clean up URL parameters even on error
      window.history.replaceState({}, document.title, window.location.pathname);

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Check current authentication status using stored token
   */
  async checkAuthStatus(): Promise<void> {
    try {
      this.updateState({ loading: true });

      if (!this.token) {
        this.updateState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        });
        return;
      }

      // Try to decode the token to check if it's still valid
      try {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        
        // Check if token is expired
        if (payload.exp && payload.exp < now) {
          // Token expired
          this.clearAuth();
          return;
        }

        // Token is valid, extract user info
        const user: User = {
          id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub,
          email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email,
          name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.name || payload.given_name || payload.family_name || "User",
          picture: payload.picture || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/picture'],
          verified_email: true
        };

        this.updateState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });

        // Automatically refresh user profile to get the latest avatar
        this.refreshUserProfile();

      } catch (decodeError) {
        console.error('❌ Failed to decode token:', decodeError);
        this.clearAuth();
      }

    } catch (error) {
      console.error('❌ Auth status check failed:', error);
      this.updateState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check authentication status'
      });
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });

      if (this.token) {
        // Call logout endpoint with Bearer token
        const response = await fetch(`${appConfig.apiCorePrefixV2}/api/accounts/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (!response.ok) {
          console.warn('❌ Logout API call failed, but clearing local auth anyway');
        }
      }

      // Always clear local authentication state
      this.clearAuth();

    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Even if logout request fails, clear local state
      this.clearAuth();
    }
  }

  /**
   * Clear authentication state
   */
  private clearAuth(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    this.updateState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  }

  /**
   * Validate if the current token is still valid (not expired)
   */
  private isTokenValid(): boolean {
    if (!this.token) return false;

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        console.warn('🕐 GoogleAuthService: Token has expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ GoogleAuthService: Failed to validate token:', error);
      return false;
    }
  }

  /**
   * Get authentication token for API requests
   * Returns null if token is invalid or expired
   */
  async getAuthToken(): Promise<string | null> {
    if (!this.token) {
      console.warn('⚠️ GoogleAuthService: No token available');
      return null;
    }

    if (!this.isTokenValid()) {
      console.warn('⚠️ GoogleAuthService: Token is invalid or expired, clearing auth');
      this.clearAuth();
      return null;
    }

    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && !!this.token;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.authState.user;
  }

  /**
   * Clear any error state
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  /**
   * Make authenticated API request
   */
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers
    });
  }
}

// Create and export singleton instance
const googleAuthService = new GoogleAuthService();
export default googleAuthService;
