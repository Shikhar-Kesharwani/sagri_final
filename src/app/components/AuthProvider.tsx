import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, api } from '../lib/supabase';

export type UserRole = 'farmer' | 'admin' | null;

interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  name: string;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  landSize?: string;
  primaryCrop?: string;
  location?: string;
  points?: number;
  accessToken?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string,
    state?: string,
    district?: string,
    village?: string,
    pincode?: string,
    landSize?: string,
    primaryCrop?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.access_token);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.access_token);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (accessToken: string) => {
    try {
      const response = await api.getProfile(accessToken);
      const profile = response.user;
      
      setUser({
        id: profile.id,
        email: profile.email,
        phone: profile.phone,
        name: profile.name || profile.user_metadata?.name,
        role: profile.role || profile.user_metadata?.role,
        state: profile.state,
        district: profile.district,
        village: profile.village,
        pincode: profile.pincode,
        landSize: profile.landSize,
        primaryCrop: profile.primaryCrop,
        location: profile.location,
        points: profile.points,
        accessToken,
      });
    } catch (error) {
      console.error('Failed to load user profile from API, falling back to Supabase session:', error);
      // FALLBACK: read role directly from the Supabase session user_metadata
      // This ensures the user is always set even if the edge function is down
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata;
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            phone: meta?.phone,
            name: meta?.name || session.user.email?.split('@')[0] || 'User',
            role: (meta?.role as UserRole) || 'farmer', // default to farmer if unknown
            state: meta?.state,
            district: meta?.district,
            location: meta?.location,
            accessToken,
          });
        }
      } catch (fallbackError) {
        console.error('Fallback profile load also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };


  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string,
    state?: string,
    district?: string,
    village?: string,
    pincode?: string,
    landSize?: string,
    primaryCrop?: string
  ) => {
    try {
      const locationString = village && district && state 
        ? `${village}, ${district}, ${state}` 
        : state || 'India';

      // Sign up via backend API
      await api.signup(email, password, name, role!, phone, locationString);

      // Now sign in with Supabase to get session
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Load user profile
      if (data.session) {
        await loadUserProfile(data.session.access_token);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Load user profile
      if (data.session) {
        await loadUserProfile(data.session.access_token);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  const logout = async () => {
    try {
      if (user?.accessToken) {
        await api.signout(user.accessToken);
      }
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API fails
      setUser(null);
    }
  };

  const updatePoints = async (points: number) => {
    if (user && user.accessToken) {
      try {
        const response = await api.updatePoints(user.accessToken, points);
        setUser({ ...user, points: response.points });
      } catch (error) {
        console.error('Update points error:', error);
        // Fallback to local update
        setUser({ ...user, points: (user.points || 0) + points });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updatePoints, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}