import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import apiService from "../services/api-service";

interface AuthContextType {
  loggedInUserId: string | null;
  loggedInUserFirstName: string | null;
  userRole: string | null;
  login: (userId: string, userName: string, token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth måste användas inom en AuthProvider.");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [loggedInUserFirstName, setLoggedInUserFirstName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Initialize state from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("loggedInUserId");
    const storedUserName = localStorage.getItem("loggedInUserFirstName");
    const storedToken = localStorage.getItem("token");
    const storedUserRole = localStorage.getItem("userRole");

    if (storedUserId && storedUserName && storedToken && storedUserRole) {
      setLoggedInUserId(storedUserId);
      setLoggedInUserFirstName(storedUserName);
      setUserRole(storedUserRole);
      apiService.setAuthorizationHeader(storedToken);
    }
  }, []);

  const login = (userId: string, userName: string, token: string, role: string) => {
    localStorage.setItem("loggedInUserId", userId);
    localStorage.setItem("loggedInUserFirstName", userName);
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    setLoggedInUserId(userId);
    setLoggedInUserFirstName(userName);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loggedInUserFirstName");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setLoggedInUserId(null);
    setLoggedInUserFirstName(null);
    setUserRole(null);
    apiService.removeAuthorizationHeader();
  };

  return (
    <AuthContext.Provider value={{ loggedInUserId, loggedInUserFirstName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
