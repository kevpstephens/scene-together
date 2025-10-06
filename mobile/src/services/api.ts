import axios from "axios";
import { supabase } from "../lib/supabase";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000",
});

// Add auth token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        // Ensure headers object exists
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error("Failed to get session:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
