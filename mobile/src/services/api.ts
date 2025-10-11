import axios from "axios";
import { supabase } from "../lib/supabase";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000",
});

// Cache the access token to avoid async calls in interceptor (which can hang on web)
let cachedAccessToken: string | null = null;

// Initialize token cache from Supabase
supabase.auth.getSession().then(({ data: { session } }) => {
  cachedAccessToken = session?.access_token || null;
});

// Listen for auth changes to keep token cache updated
supabase.auth.onAuthStateChange((_event, session) => {
  cachedAccessToken = session?.access_token || null;
});

// Add auth token to every request (now synchronous using cached token)
api.interceptors.request.use(
  (config) => {
    if (cachedAccessToken) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${cachedAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
