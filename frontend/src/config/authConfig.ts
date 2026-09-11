import type { Configuration } from "@azure/msal-browser";

// Estos 3 valores dependen del App Registration creado en Azure Entra ID.
// Se definen por variable de entorno para no hardcodear secretos/URLs y
// para poder usar un redirectUri distinto en local vs. EC2.
const CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID as string;
const TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID as string;
const REDIRECT_URI =
    (import.meta.env.VITE_AZURE_REDIRECT_URI as string) || window.location.origin;

export const msalConfig: Configuration = {
    auth: {
        clientId: CLIENT_ID,
        authority: `https://login.microsoftonline.com/${TENANT_ID}`,
        redirectUri: REDIRECT_URI,
        postLogoutRedirectUri: REDIRECT_URI,
    },
    cache: {
        cacheLocation: "sessionStorage",
    },
};

// Scopes que se piden al iniciar sesión (perfil básico + poder llamar al backend).
// Si se expone un scope propio de la API (App ID URI) en Entra ID, agrégalo aquí,
// ej: "api://<API_CLIENT_ID>/access_as_user"
export const loginRequest = {
    scopes: ["openid", "profile", "email"],
};
