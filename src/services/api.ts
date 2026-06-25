// src/services/api.ts

const API_BASE = '/api';

/**
 * Custom error class to hold API error details
 */
export class APIError extends Error {
  status: number;
  timestamp: string;
  error: string;

  constructor(status: number, message: string, error = 'API Error', timestamp = new Date().toISOString()) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.error = error;
    this.timestamp = timestamp;
  }
}

/**
 * Retrieve auth token from local storage
 */
export function getToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Save auth token to local storage
 */
export function setToken(token: string): void {
  localStorage.setItem('authToken', token);
}

/**
 * Remove auth token from local storage
 */
export function removeToken(): void {
  localStorage.removeItem('authToken');
}

/**
 * Check if the user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Core fetch API wrapper
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    // Attempt to parse JSON response body
    let data: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      // If error matches standard error envelope: { timestamp, status, error, message }
      if (data && typeof data === 'object' && data.message) {
        throw new APIError(
          response.status,
          data.message,
          data.error || 'Bad Request',
          data.timestamp || new Date().toISOString()
        );
      }
      throw new APIError(
        response.status,
        data?.message || `API request failed with status ${response.status}`,
        response.statusText
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    // Handle physical network errors (e.g. connection refused)
    throw new APIError(
      0,
      'Connection refused or network is unreachable. Please make sure the backend is running.',
      'Network Error'
    );
  }
}

export interface SignupResponse {
  id: number;
  username: string;
  createdAt: string;
}

/**
 * Register a new user in the system
 */
export async function signup(username: string, password: string): Promise<SignupResponse> {
  return fetchAPI<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export interface LoginResponse {
  token: string;
  type: string;
  expiresAt: string;
}

/**
 * Authenticate a user and return session details
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  return fetchAPI<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export interface UserSettingsResponse {
  username: string;
  weeklyLimit: number;
}

/**
 * Retrieve the current weekly time limit settings for the authenticated user
 */
export async function getSettings(): Promise<UserSettingsResponse> {
  return fetchAPI<UserSettingsResponse>('/user/settings', {
    method: 'GET',
  });
}

/**
 * Update the weekly time limit settings for the authenticated user
 */
export async function updateSettings(weeklyLimit: number): Promise<UserSettingsResponse> {
  return fetchAPI<UserSettingsResponse>('/user/settings', {
    method: 'PUT',
    body: JSON.stringify({ weeklyLimit }),
  });
}

