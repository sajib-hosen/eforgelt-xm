"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import $api from "../api/axios";
import {
  loginSuccess,
  logoutSuccess,
  refreshTokenSuccess,
} from "../redux/slices/authSlice";
import { refreshToken } from "../api/user/refresh-token";
import { getMe } from "../api/user/get-me";

interface AuthContextProps {
  getAccessToken: () => Promise<string | null>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  getAccessToken: async () => null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const getAccessToken = useCallback(async () => {
    try {
      const { accessToken } = await refreshToken();

      if (accessToken) {
        dispatch(refreshTokenSuccess(accessToken));
        localStorage.setItem("token", accessToken);

        try {
          const user = await getMe();
          dispatch(
            loginSuccess({
              token: accessToken,
              user,
            })
          );
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }

        return accessToken;
      }

      return null;
    } catch (error) {
      dispatch(logoutSuccess());
      localStorage.removeItem("token");
      return null;
    }
  }, [dispatch]);

  // Initial token refresh on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await getAccessToken();
      setIsLoading(false);
    };
    initAuth();
  }, [getAccessToken]);

  // Setup Axios interceptors
  useEffect(() => {
    const requestInterceptor = $api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = $api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await getAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return $api(originalRequest); // retry request
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      $api.interceptors.request.eject(requestInterceptor);
      $api.interceptors.response.eject(responseInterceptor);
    };
  }, [getAccessToken]);

  return (
    <AuthContext.Provider value={{ getAccessToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy use
export const useAuthContext = () => useContext(AuthContext);
