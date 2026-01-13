import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Create Axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Auth Token & Cookies
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Client-Side Logic
    if (typeof window !== "undefined") {
        // Only add token if not already present or explicitly skipped
        if (!config.headers.Authorization) {
            const { data: session } = await authClient.getSession();
            if (session?.session?.token) {
                config.headers.Authorization = `Bearer ${session.session.token}`;
            }
        }
    } 
    // Server-Side Logic
    else {
        try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            const allCookies = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
            
            if (allCookies) {
                config.headers.Cookie = allCookies;
            }
            // Optional: If you need to manipulate Authorization header on server, do it here
            // But usually forwarding Cookie is enough if backend accepts it.
        } catch (error) {
            console.error("Failed to forward cookies on server:", error);
        }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data; // Return the data directly to match previous behavior
  },
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    console.error("API Error:", error);

    const statusCode = error.response?.status || 0;
    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred";
    const errors = error.response?.data?.errors;

    return Promise.reject(new ApiError(statusCode, message, errors));
  }
);

// Wrapper to match the previous `api` interface (mostly)
// This makes migration easier but leverages Axios under the hood.
export const api = {
  get: <TResponse>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>, 
    config?: AxiosRequestConfig
  ) => {
      // Filter out undefined/null params if passed in params object
      const cleanParams: Record<string, string | number | boolean> = {};
      if(params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                cleanParams[key] = value;
            }
        });
      }
      return axiosInstance.get<TResponse, TResponse>(endpoint, { ...config, params: cleanParams });
  },

  post: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ) => axiosInstance.post<TResponse, TResponse>(endpoint, body, config),

  put: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ) => axiosInstance.put<TResponse, TResponse>(endpoint, body, config),

  patch: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ) => axiosInstance.patch<TResponse, TResponse>(endpoint, body, config),

  delete: <TResponse>(endpoint: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<TResponse, TResponse>(endpoint, config),
};

export { ApiError, axiosInstance };
export type { ApiResponse };
