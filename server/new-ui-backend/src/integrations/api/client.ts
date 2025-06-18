// API client for Express server endpoints
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
};

// Specific API functions to match Supabase-like interface
export const api = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      order: (column: string, options: { ascending: boolean } = { ascending: true }) => ({
        async execute() {
          if (table === 'users') {
            return apiClient.get(`/users`);
          }
          return { data: null, error: new Error('Table not found') };
        }
      }),
      gte: (column: string, value: string) => ({
        order: (orderColumn: string, options: { ascending: boolean } = { ascending: true }) => ({
          async execute() {
            if (table === 'sentiments') {
              return apiClient.get(`/sentiments?since=${encodeURIComponent(value)}`);
            }
            return { data: null, error: new Error('Table not found') };
          }
        })
      }),
      async execute() {
        if (table === 'sentiments') {
          return apiClient.get(`/sentiments`);
        }
        return { data: null, error: new Error('Table not found') };
      }
    })
  })
}; 