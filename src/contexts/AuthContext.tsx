import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import apiService from "../services/api-service";

interface AuthContextType {
  loggedInUserId: string | null;
  loggedInUserFirstName: string | null;
  loggedInUserLastName: string | null;
  userRole: string | null;
  login: (userId: string, userFirstName: string, userLastName: string, token: string, role: string) => void;
  logout: () => void;
  hydrated: boolean;
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
  const [loggedInUserLastName, setLoggedInUserLastName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);  
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Initialize state from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("loggedInUserId");
    const storedUserFirstName = localStorage.getItem("loggedInUserFirstName");
    const storedUserLastName = localStorage.getItem("loggedInUserLastName");
    const storedToken = localStorage.getItem("token");
    const storedUserRole = localStorage.getItem("userRole");

    if (storedUserId && storedUserFirstName && storedUserLastName && storedToken && storedUserRole) {
      setLoggedInUserId(storedUserId);
      setLoggedInUserFirstName(storedUserFirstName);
      setLoggedInUserLastName(storedUserLastName);
      setUserRole(storedUserRole);
      apiService.setAuthorizationHeader(storedToken);
    }

    setHydrated(true);
  }, []);

  const login = (userId: string, userFirstName: string, userLastName: string, token: string, role: string) => {
    localStorage.setItem("loggedInUserId", userId);
    localStorage.setItem("loggedInUserFirstName", userFirstName);
    localStorage.setItem("loggedInUserLastName", userLastName);
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    setLoggedInUserId(userId);
    setLoggedInUserFirstName(userFirstName);
    setLoggedInUserLastName(userLastName);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loggedInUserFirstName");
    localStorage.removeItem("loggedInUserLastName");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setLoggedInUserId(null);
    setLoggedInUserFirstName(null);
    setLoggedInUserLastName(null);
    setUserRole(null);
    apiService.removeAuthorizationHeader();    
  };

  return (
    <AuthContext.Provider
      value={{ loggedInUserId, loggedInUserFirstName, loggedInUserLastName, userRole, login, logout, hydrated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
