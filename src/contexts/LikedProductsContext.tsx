import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import apiService from "../services/api-service";
import { useAuth } from "./AuthContext";

interface LikedProductsContextType {
  likedProductsCountInNav: number;
  /* increaseLikedInNavByOne: () => void;
  decreaseLikedInNavByOne: () => void; */
  refreshLikedProductsInNav: () => void;
}

const LikedProductsContext = createContext<LikedProductsContextType | undefined>(undefined);

export const useLikedProducts = (): LikedProductsContextType => {
  const context = useContext(LikedProductsContext);
  if (!context) {
    throw new Error("useLikedProducts måste användas inom en LikedProductsProvider.");
  }
  return context;
};

export const LikedProductsProvider = ({ children }: { children: ReactNode }) => {
  const { loggedInUserId } = useAuth();
  const [likedProductsCountInNav, setLikedProductsCountInNav] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchProducts = async () => {
      try {
        if (!loggedInUserId) {
          setLikedProductsCountInNav(0);
          return;
        }
        const response = await apiService.getLikedProductsAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setLikedProductsCountInNav(response.length);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setLikedProductsCountInNav(0);
        }
      }
    };
    fetchProducts();
    return () => abortCont.abort();
  }, [loggedInUserId, refreshTrigger]);

  const refreshLikedProductsInNav = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  /* const increaseLikedInNavByOne = () => {
    setLikedProductsCountInNav((prev) => prev + 1);
  };

  const decreaseLikedInNavByOne = () => {
    setLikedProductsCountInNav((prev) => Math.max(0, prev - 1));
  }; */

  return (
    <LikedProductsContext.Provider
      value={{ likedProductsCountInNav, refreshLikedProductsInNav }}
    >
      {children}
    </LikedProductsContext.Provider>
  );
};
