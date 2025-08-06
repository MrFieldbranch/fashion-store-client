import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { SexProvider } from "./contexts/SexContext.tsx";
import { LikedProductsProvider } from "./contexts/LikedProductsContext.tsx";
import { ShoppingBasketProvider } from "./contexts/ShoppingBasketContext.tsx";
import { ToastProvider } from "./contexts/ToastContext.tsx";
import { RatingReminderProvider } from "./contexts/RatingReminderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SexProvider>
        <LikedProductsProvider>
          <ShoppingBasketProvider>
            <ToastProvider>
              <RatingReminderProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </RatingReminderProvider>
            </ToastProvider>
          </ShoppingBasketProvider>
        </LikedProductsProvider>
      </SexProvider>
    </AuthProvider>
  </StrictMode>
);
