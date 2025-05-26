import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { SexProvider } from "./contexts/SexContext.tsx";
import { LikedProductsProvider } from "./contexts/LikedProductsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SexProvider>
        <LikedProductsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LikedProductsProvider>
      </SexProvider>
    </AuthProvider>
  </StrictMode>
);
