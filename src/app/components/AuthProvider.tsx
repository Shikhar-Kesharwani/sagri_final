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
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
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
        loadUserProfile(session);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (passedSession?: any) => {
    try {
      let session = passedSession;
      if (!session) {
        const { data } = await supabase.auth.getSession();
        session = data.session;
      }
      
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          phone: meta?.phone,
          name: meta?.name || session.user.email?.split('@')[0] || 'User',
          role: (meta?.role as UserRole) || 'farmer',
          state: meta?.state,
          district: meta?.district,
          village: meta?.village,
          pincode: meta?.pincode,
          landSize: meta?.landSize,
          primaryCrop: meta?.primaryCrop,
          location: meta?.location,
          points: meta?.points || 0,
          accessToken: session.access_token,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Fast local profile load failed:', error);
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

      // Step 1: Sign up directly with Supabase (no edge function needed)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone,
            state,
            district,
            village,
            pincode,
            landSize,
            primaryCrop,
            location: locationString,
            points: 0,
          },
        },
      });

      if (signUpError) {
        // Email already registered with a different password (e.g. from old auth system)
        if (signUpError.message?.toLowerCase().includes('already registered') ||
            signUpError.message?.toLowerCase().includes('already exists')) {
          throw new Error('This email is already registered. Please delete your old account from Supabase and try again, or contact support.');
        }
        throw signUpError;
      }

      // Step 2: Sign in to get a proper session
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Step 3: Load user profile from the session
      if (data.session) {
        const meta = data.session.user.user_metadata;
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || email,
          phone: meta?.phone,
          name: meta?.name || name,
          role: (meta?.role as UserRole) || role,
          state: meta?.state,
          district: meta?.district,
          village: meta?.village,
          pincode: meta?.pincode,
          landSize: meta?.landSize,
          primaryCrop: meta?.primaryCrop,
          location: meta?.location,
          points: meta?.points || 0,
          accessToken: data.session.access_token,
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session) {
        const meta = data.session.user.user_metadata;
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || email,
          phone: meta?.phone,
          name: meta?.name || data.session.user.email?.split('@')[0] || 'User',
          role: (meta?.role as UserRole) || 'farmer',
          state: meta?.state,
          district: meta?.district,
          village: meta?.village,
          pincode: meta?.pincode,
          landSize: meta?.landSize,
          primaryCrop: meta?.primaryCrop,
          location: meta?.location,
          points: meta?.points || 0,
          accessToken: data.session.access_token,
        });
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

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updatePoints, resetPassword, updatePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}