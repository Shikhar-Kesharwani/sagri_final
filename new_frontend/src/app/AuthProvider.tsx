import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "farmer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  state: string;
  district: string;
  village: string;
  landSize: string;
  primaryCrop: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrPhone: string, pass: string) => Promise<User>;
  signup: (userData: Partial<User>) => Promise<User>;
  logout: () => void;
  updatePoints: (delta: number) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  quickLoginAsFarmer: () => void;
  quickLoginAsAdmin: () => void;
}

const DEMO_FARMER: User = {
  id: "usr_farmer_ramesh",
  name: "Ramesh Kumar (किसान)",
  email: "farmer@sagri.com",
  phone: "9876543210",
  role: "farmer",
  state: "Punjab",
  district: "Ludhiana",
  village: "Sahnewal",
  landSize: "5.5 Acres",
  primaryCrop: "Wheat & Paddy",
  points: 250,
};

const DEMO_ADMIN: User = {
  id: "usr_admin_monu",
  name: "Dr. Monu Singh (Admin)",
  email: "admin@sagri.com",
  phone: "9812345678",
  role: "admin",
  state: "Uttar Pradesh",
  district: "Greater Noida",
  village: "Bennett AgTech Hub",
  landSize: "100 Acres",
  primaryCrop: "Wheat",
  points: 999,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("sagri_auth_user");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_FARMER; // Default logged in as Ramesh Kumar for instant experience
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("sagri_auth_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("sagri_auth_user");
      }
    } catch {}
  }, [user]);

  const login = async (identifier: string, pass: string): Promise<User> => {
    const clean = identifier.trim().toLowerCase();
    if (clean.includes("admin") || pass === "admin123") {
      setUser(DEMO_ADMIN);
      return DEMO_ADMIN;
    }
    // Farmer login fallback
    const farmerUser: User = {
      ...DEMO_FARMER,
      email: clean.includes("@") ? clean : `${clean}@sagri.app`,
      phone: !clean.includes("@") ? clean : DEMO_FARMER.phone,
    };
    setUser(farmerUser);
    return farmerUser;
  };

  const signup = async (userData: Partial<User>): Promise<User> => {
    const newUser: User = {
      id: "usr_" + Date.now(),
      name: userData.name || "Kisan Sathi",
      email: userData.email || `${userData.phone || Date.now()}@sagri.app`,
      phone: userData.phone || "9876543210",
      role: userData.role || "farmer",
      state: userData.state || "Punjab",
      district: userData.district || "Ludhiana",
      village: userData.village || "Sahnewal",
      landSize: userData.landSize || "5 Acres",
      primaryCrop: userData.primaryCrop || "Wheat",
      points: 150,
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("sagri_auth_user");
    } catch {}
  };

  const updatePoints = (delta: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, points: Math.max(0, (prev.points || 0) + delta) };
      try {
        localStorage.setItem("sagri_auth_user", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const quickLoginAsFarmer = () => {
    setUser(DEMO_FARMER);
    setIsModalOpen(false);
  };

  const quickLoginAsAdmin = () => {
    setUser(DEMO_ADMIN);
    setIsModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updatePoints,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
        quickLoginAsFarmer,
        quickLoginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
