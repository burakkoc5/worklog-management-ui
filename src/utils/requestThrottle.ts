import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

interface ThrottleState {
  consecutiveErrors: number;
  lastErrorTime: number;
  baseDelay: number;
  maxDelay: number;
}

const throttleState: ThrottleState = {
  consecutiveErrors: 0,
  lastErrorTime: 0,
  baseDelay: 1000, // Start with 1 second delay
  maxDelay: 30000, // Max delay of 30 seconds
};

export const resetThrottleState = () => {
  throttleState.consecutiveErrors = 0;
  throttleState.lastErrorTime = 0;
};

export const getThrottleDelay = (): number => {
  const now = Date.now();
  const timeSinceLastError = now - throttleState.lastErrorTime;
  
  // If it's been more than 5 minutes since the last error, reset the state
  if (timeSinceLastError > 5 * 60 * 1000) {
    resetThrottleState();
    return 0;
  }

  // Calculate delay using exponential backoff: baseDelay * 2^consecutiveErrors
  const delay = Math.min(
    throttleState.baseDelay * Math.pow(2, throttleState.consecutiveErrors),
    throttleState.maxDelay
  );

  return delay;
};

export const handleRequestError = (error: AxiosError) => {
  if (error.response?.status === 500) {
    throttleState.consecutiveErrors++;
    throttleState.lastErrorTime = Date.now();
  } else {
    // Reset on non-500 errors
    resetThrottleState();
  }
};

export const handleRequestSuccess = () => {
  resetThrottleState();
};

export const createThrottledAxiosInstance = () => {
  const instance = axios.create();

  // Request interceptor
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const delay = getThrottleDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      handleRequestSuccess();
      return response;
    },
    (error: AxiosError) => {
      handleRequestError(error);
      return Promise.reject(error);
    }
  );

  return instance;
}; 