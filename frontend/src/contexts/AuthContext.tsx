import { createContext, useContext, type ReactNode } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError, type AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "../config/authConfig";

type AuthContextType = {
    isAuthenticated: boolean;
    user: AccountInfo | null;
    login: () => Promise<void>;
    logout: () => void;
    getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const user = accounts[0] ?? null;

    // Dispara el login contra Azure Entra ID. Usamos loginRedirect (navegación
    // de página completa) en vez de loginPopup: los popups dependen de que la
    // ventana principal pueda leer el storage de la ventana emergente, algo
    // que navegadores con protecciones de privacidad fuertes (Brave, Safari
    // con ITP, etc.) bloquean, dejando el popup abierto sin completar el login.
    const login = async () => {
        await instance.loginRedirect(loginRequest);
    };

    const logout = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    };

    // Obtiene el access token vigente para adjuntarlo como Bearer al llamar al backend.
    // Intenta primero en silencio (sin mostrar UI) y si el token expiró, redirige
    // a Microsoft para renovarlo (misma razón que en login: nada de popups).
    const getAccessToken = async (): Promise<string | null> => {
        if (accounts.length === 0) return null;

        try {
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            });
            return response.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                await instance.acquireTokenRedirect(loginRequest);
                return null; // la página navega fuera; no hay token que devolver en esta carga
            }
            console.error("Error obteniendo el access token de Entra ID", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return ctx;
};
