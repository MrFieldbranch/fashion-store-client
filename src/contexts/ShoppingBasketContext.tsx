import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import apiService from "../services/api-service";

interface ShoppingBasketContextType {
  numberOfItemsInShoppingBasketInNav: number;
  increaseNumberOfItemsInBasketByOne: () => void;
  decreaseNumberOfItemsInBasketByOne: () => void;
}

const ShoppingBasketContext = createContext<ShoppingBasketContextType | undefined>(undefined);

export const useShoppingBasket = (): ShoppingBasketContextType => {
  const context = useContext(ShoppingBasketContext);
  if (!context) {
    throw new Error("useShoppingBasket måste användas inom en ShoppingBasketProvider");
  }
  return context;
};

export const ShoppingBasketProvider = ({ children }: { children: ReactNode }) => {
  const { loggedInUserId } = useAuth();
  const [numberOfItemsInShoppingBasketInNav, setNumberOfItemsInShoppingBasketInNav] = useState<number>(0);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchShoppingBasketItems = async () => {
      try {
        if (!loggedInUserId) {
          setNumberOfItemsInShoppingBasketInNav(0);
          return;
        }
        const response = await apiService.getShoppingBasketItemsAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setNumberOfItemsInShoppingBasketInNav(response.length);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setNumberOfItemsInShoppingBasketInNav(0);
        }
      }
    };
    fetchShoppingBasketItems();
    return () => abortCont.abort();
  }, [loggedInUserId]);

  const increaseNumberOfItemsInBasketByOne = () => {
    setNumberOfItemsInShoppingBasketInNav((prev) => prev + 1);
  };

  const decreaseNumberOfItemsInBasketByOne = () => {
    setNumberOfItemsInShoppingBasketInNav((prev) => Math.max(0, prev - 1));
  };

  return (
    <ShoppingBasketContext.Provider
      value={{
        numberOfItemsInShoppingBasketInNav,
        increaseNumberOfItemsInBasketByOne,
        decreaseNumberOfItemsInBasketByOne,
      }}
    >
      {children}
    </ShoppingBasketContext.Provider>
  );
};
