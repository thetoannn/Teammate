import { useState, useEffect } from 'react';
import googleAuthService, { AuthState, User } from '../services/GoogleAuthService';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}


export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  });

  useEffect(() => {
   
    const unsubscribe = googleAuthService.subscribe(setAuthState);
    
 
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token') || urlParams.get('error')) {
      console.log('🔍 useAuth: Detected OAuth callback with token or error');
      googleAuthService.handleOAuthCallback().catch(error => {
        console.error('OAuth callback error:', error);
      });
    }

    return unsubscribe;
  }, []);

  const login = async (): Promise<void> => {
    try {
      console.log('🚀 useAuth: login() called - starting Google OAuth flow');
      await googleAuthService.loginWithGoogle();
    } catch (error) {
      console.error('❌ useAuth: Login failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await googleAuthService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const clearError = (): void => {
    googleAuthService.clearError();
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    clearError
  };
};

export default useAuth;
