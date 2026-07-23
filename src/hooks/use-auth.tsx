/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '../types';
import { loginUser, registerUser, logoutUser, refreshSession, vscodeCallback as vscodeCallbackRequest } from '../lib/auth';
import { exchangeNestjsToken, fetchVscodeId, setFastApiToken, getNestjsToken } from '../lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, password?: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  vscodeState: string | null;
  setVscodeState: (state: string | null) => void;
  updateProfile: (name: string, avatarUrl?: string) => void;
  vscodeCallback: (state: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [vscodeState, setVscodeState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('vscode_state');
    }
    return null;
  });

  useEffect(() => {
    // Try to restore user session on mount
    async function restoreSession() {
      try {
        const res = await refreshSession();
        if (res.success && res.data) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.success && res.data) {
        setUser(res.data.user);
        // Auto-chain: exchange NestJS JWT for FastAPI JWT, then fetch vscode_id
        const nestjsToken = getNestjsToken();
        if (nestjsToken) {
          exchangeNestjsToken(nestjsToken).then((exRes) => {
            if (exRes.success && exRes.data) {
              setFastApiToken(exRes.data.access_token);
              fetchVscodeId().then((vRes) => {
                if (vRes.success && vRes.data?.vscode_id) {
                  localStorage.setItem('craftd_vscode_id', vRes.data.vscode_id);
                }
              });
            }
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password?: string, name?: string) => {
    setIsLoading(true);
    try {
      const res = await registerUser({ email, password, name });
      if (res.success && res.data) {
        setUser(res.data.user);
        // Auto-chain: exchange NestJS JWT for FastAPI JWT, then fetch vscode_id
        const nestjsToken = getNestjsToken();
        if (nestjsToken) {
          exchangeNestjsToken(nestjsToken).then((exRes) => {
            if (exRes.success && exRes.data) {
              setFastApiToken(exRes.data.access_token);
              fetchVscodeId().then((vRes) => {
                if (vRes.success && vRes.data?.vscode_id) {
                  localStorage.setItem('craftd_vscode_id', vRes.data.vscode_id);
                }
              });
            }
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (name: string, avatarUrl?: string) => {
    if (user) {
      const updated = { ...user, name, avatarUrl };
      setUser(updated);
      localStorage.setItem('current_user', JSON.stringify(updated));
    }
  };

  const vscodeCallbackInner = React.useCallback(async (state: string): Promise<string | null> => {
    try {
      const res = await vscodeCallbackRequest(state);
      if (res.success && res.data?.redirectUrl) {
        return res.data.redirectUrl;
      }
    } catch {
      // Silent fail
    }
    return null;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        vscodeState,
        setVscodeState,
        updateProfile,
        vscodeCallback: vscodeCallbackInner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
