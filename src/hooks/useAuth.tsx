import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser, login as storeLogin, signup as storeSignup, logout as storeLogout, User } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string, role?: "user" | "freelancer") => string | null;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => null,
  signup: () => null,
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const login = (email: string, password: string): string | null => {
    const result = storeLogin(email, password);
    if (typeof result === "string") return result;
    setUser(result);
    return null;
  };

  const signup = (name: string, email: string, password: string, role: "user" | "freelancer" = "user"): string | null => {
    const result = storeSignup(name, email, password, role);
    if (typeof result === "string") return result;
    setUser(result);
    return null;
  };

  const logout = () => {
    storeLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
