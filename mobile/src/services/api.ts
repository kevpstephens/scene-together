/*===============================================
 * API Service
 * ==============================================
 * Configured Axios instance for authenticated requests to the backend.
 * Handles JWT injection, token caching, and automatic refresh on 401s.
 * Token is cached to prevent async issues on web platforms.
 * ==============================================
 */

import axios from "axios";
import { supabase } from "../lib/supabase";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000",
});

// Token cache prevents async call issues in interceptors (especially on web)
let cachedAccessToken: string | null = null;

// Initialize and sync token cache
supabase.auth.getSession().then(({ data: { session } }) => {
  cachedAccessToken = session?.access_token || null;
});

supabase.auth.onAuthStateChange((_event, session) => {
  cachedAccessToken = session?.access_token || null;
});

// Inject auth token into every request
api.interceptors.request.use(
  async (config) => {
    if (!cachedAccessToken) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      cachedAccessToken = session?.access_token || null;
    }

    if (cachedAccessToken) {
      config.headers.Authorization = `Bearer ${cachedAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token on 401 and retry request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          cachedAccessToken = session.access_token;
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        cachedAccessToken = null;
      }
    }

    return Promise.reject(error);
  }
);
