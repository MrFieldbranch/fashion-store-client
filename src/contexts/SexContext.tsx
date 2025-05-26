import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Sex = "Unisex" | "Male" | "Female";

interface SexContextValue {
  sex: Sex | null;
  setSex: (sex: Sex) => void;
}

const SexContext = createContext<SexContextValue | undefined>(undefined);

export const useSex = (): SexContextValue => {
  const context = useContext(SexContext);
  if (!context) {
    throw new Error("useSex måste användas inom en SexProvider.");
  }
  return context;
};

export const SexProvider = ({ children }: { children: ReactNode }) => {
  const [sex, setSexState] = useState<Sex | null>(null);

  useEffect(() => {
    const storedSex = localStorage.getItem("chosenSex");
    if (storedSex === "Unisex" || storedSex === "Male" || storedSex === "Female") {
      setSexState(storedSex);
    }
  }, []);

  const setSex = (newSex: Sex) => {
    localStorage.setItem("chosenSex", newSex);
    setSexState(newSex);
  };

  return <SexContext.Provider value={{ sex, setSex }}>{children}</SexContext.Provider>;
};
