import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { SexProvider } from "./contexts/SexContext.tsx";
import { LikedProductsProvider } from "./contexts/LikedProductsContext.tsx";
import { ShoppingBasketProvider } from "./contexts/ShoppingBasketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SexProvider>
        <LikedProductsProvider>
          <ShoppingBasketProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ShoppingBasketProvider>
        </LikedProductsProvider>
      </SexProvider>
    </AuthProvider>
  </StrictMode>
);
