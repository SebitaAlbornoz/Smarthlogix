import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { CartProvider } from "./contexts/CartContext";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/authConfig";
import { AuthProvider } from "./contexts/AuthContext";

// Instancia de MSAL para Azure Entra ID. Se crea una sola vez fuera del render.
const msalInstance = new PublicClientApplication(msalConfig);

// Si ya hay una cuenta autenticada previamente (sesión guardada), la deja activa.
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const account = (event.payload as { account?: import("@azure/msal-browser").AccountInfo }).account;
        if (account) msalInstance.setActiveAccount(account);
    }
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MsalProvider instance={msalInstance}>
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </MsalProvider>
    </StrictMode>
);