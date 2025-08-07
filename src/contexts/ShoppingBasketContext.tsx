import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import apiService from "../services/api-service";

interface ShoppingBasketContextType {
  totalQuantityInShoppingBasket: number;
  productIdsInShoppingBasket: number[];
  refreshShoppingBasketInNav: () => void;
}

const ShoppingBasketContext = createContext<ShoppingBasketContextType | undefined>(undefined);

export const useShoppingBasket = (): ShoppingBasketContextType => {
  const context = useContext(ShoppingBasketContext);
  if (!context) {
    throw new Error("useShoppingBasket måste användas inom en ShoppingBasketProvider.");
  }
  return context;
};

export const ShoppingBasketProvider = ({ children }: { children: ReactNode }) => {
  const { loggedInUserId } = useAuth();
  const [totalQuantityInShoppingBasket, setTotalQuantityInShoppingBasket] = useState<number>(0);
  const [productIdsInShoppingBasket, setProductIdsInShoppingBasket] = useState<number[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchShoppingBasket = async () => {
      try {
        if (!loggedInUserId) {
          setTotalQuantityInShoppingBasket(0);
          return;
        }
        const response = await apiService.getShoppingBasketAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setTotalQuantityInShoppingBasket(response.totalQuantity);
          setProductIdsInShoppingBasket(response.productIds);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setTotalQuantityInShoppingBasket(0);
        }
      }
    };

    fetchShoppingBasket();
    return () => abortCont.abort();
  }, [loggedInUserId, refreshTrigger]);

  const refreshShoppingBasketInNav = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ShoppingBasketContext.Provider
      value={{
        totalQuantityInShoppingBasket,
        productIdsInShoppingBasket,
        refreshShoppingBasketInNav,
      }}
    >
      {children}
    </ShoppingBasketContext.Provider>
  );
};
