import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-267f669b`;

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  const session = localStorage.getItem('supabase.auth.token');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      return parsed.access_token || parsed.currentSession?.access_token || null;
    } catch {
      return null;
    }
  }
  return null;
}

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== MARKETPLACE API ====================

export interface CropListing {
  id: string;
  userId: string;
  userName: string;
  cropType: string;
  cropName: string;
  quantity: number;
  quality: string;
  price: number;
  location: string;
  contactPhone: string;
  description?: string;
  harvestDate?: string;
  status: 'active' | 'sold' | 'cancelled';
  views: number;
  interested: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeedOrder {
  id: string;
  userId: string;
  userName: string;
  items: Array<{
    seedId: number;
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  contactPhone: string;
  paymentMethod: 'cod' | 'online';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentBooking {
  id: string;
  userId: string;
  userName: string;
  equipmentId: number;
  equipmentName: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalCost: number;
  deliveryAddress: string;
  contactPhone: string;
  specialRequirements?: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  id: string;
  userId: string;
  userName: string;
  loanType: string;
  loanName: string;
  amount: number;
  purpose: string;
  landSize?: number;
  annualIncome?: number;
  contactPhone: string;
  address: string;
  documents?: {
    aadhar?: boolean;
    pan?: boolean;
    landRecords?: boolean;
    incomeProof?: boolean;
  };
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// Crop Listings API
export const cropListingsApi = {
  create: async (data: Omit<CropListing, 'id' | 'userId' | 'userName' | 'status' | 'views' | 'interested' | 'createdAt' | 'updatedAt'>): Promise<{ listing: CropListing }> => {
    return apiRequest('/marketplace/crop-listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async (limit = 50): Promise<{ listings: CropListing[] }> => {
    return apiRequest(`/marketplace/crop-listings/all?limit=${limit}`);
  },

  getMy: async (): Promise<{ listings: CropListing[] }> => {
    return apiRequest('/marketplace/crop-listings/my');
  },

  update: async (id: string, data: Partial<CropListing>): Promise<{ listing: CropListing }> => {
    return apiRequest(`/marketplace/crop-listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest(`/marketplace/crop-listings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Seed Orders API
export const seedOrdersApi = {
  create: async (data: Omit<SeedOrder, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>): Promise<{ order: SeedOrder }> => {
    return apiRequest('/marketplace/seed-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMy: async (): Promise<{ orders: SeedOrder[] }> => {
    return apiRequest('/marketplace/seed-orders');
  },
};

// Shopping Cart API
export const cartApi = {
  save: async (items: any[]): Promise<{ success: boolean }> => {
    return apiRequest('/marketplace/cart', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  get: async (): Promise<{ items: any[] }> => {
    return apiRequest('/marketplace/cart');
  },
};

// Equipment Bookings API
export const equipmentBookingsApi = {
  create: async (data: Omit<EquipmentBooking, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>): Promise<{ booking: EquipmentBooking }> => {
    return apiRequest('/marketplace/equipment-bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMy: async (): Promise<{ bookings: EquipmentBooking[] }> => {
    return apiRequest('/marketplace/equipment-bookings');
  },
};

// Loan Applications API
export const loanApplicationsApi = {
  create: async (data: Omit<LoanApplication, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>): Promise<{ application: LoanApplication }> => {
    return apiRequest('/marketplace/loan-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMy: async (): Promise<{ applications: LoanApplication[] }> => {
    return apiRequest('/marketplace/loan-applications');
  },
};