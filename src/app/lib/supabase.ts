import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// Supabase client for frontend
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Server URL for API calls
export const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-267f669b`;

// Helper function to get auth headers
export function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }
  
  return headers;
}

// API helper functions
export const api = {
  // Auth
  async signup(email: string, password: string, name: string, role: 'farmer' | 'admin', phone?: string, location?: string) {
    const response = await fetch(`${serverUrl}/auth/signup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password, name, role, phone, location }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    return response.json();
  },

  async signin(email: string, password: string) {
    const response = await fetch(`${serverUrl}/auth/signin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signin failed');
    }
    
    return response.json();
  },

  async signout(token: string) {
    const response = await fetch(`${serverUrl}/auth/signout`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signout failed');
    }
    
    return response.json();
  },

  async resetPassword(email: string) {
    const response = await fetch(`${serverUrl}/auth/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Password reset failed');
    }
    
    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${serverUrl}/auth/profile`, {
      headers: getAuthHeaders(token),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Get profile failed');
    }
    
    return response.json();
  },

  // Predictions
  async savePrediction(token: string, predictionData: any) {
    const response = await fetch(`${serverUrl}/predictions`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(predictionData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Save prediction failed');
    }
    
    return response.json();
  },

  async getPredictions(token: string) {
    const response = await fetch(`${serverUrl}/predictions`, {
      headers: getAuthHeaders(token),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Get predictions failed');
    }
    
    return response.json();
  },

  // Points
  async updatePoints(token: string, points: number) {
    const response = await fetch(`${serverUrl}/farmer/points`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ points }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update points failed');
    }
    
    return response.json();
  },

  // Image upload
  async uploadImage(token: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${serverUrl}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }
    
    return response.json();
  },

  // Admin
  async getAnalytics(token: string) {
    const response = await fetch(`${serverUrl}/admin/analytics`, {
      headers: getAuthHeaders(token),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Get analytics failed');
    }
    
    return response.json();
  },

  async getUsers(token: string) {
    const response = await fetch(`${serverUrl}/admin/users`, {
      headers: getAuthHeaders(token),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Get users failed');
    }
    
    return response.json();
  },

  // Market & Weather
  async getMarketPrices() {
    const response = await fetch(`${serverUrl}/market-prices`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Get market prices failed');
    }
    
    return response.json();
  },

  async getWeather() {
    const response = await fetch(`${serverUrl}/weather`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Get weather failed');
    }
    
    return response.json();
  },

  // Community
  async getPosts() {
    const response = await fetch(`${serverUrl}/community/posts`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Get posts failed');
    }
    
    return response.json();
  },

  async createPost(token: string, content: string) {
    const response = await fetch(`${serverUrl}/community/posts`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Create post failed');
    }
    
    return response.json();
  },
};