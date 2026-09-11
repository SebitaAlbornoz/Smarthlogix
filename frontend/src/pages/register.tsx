import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Nota de arquitectura: con Azure Entra ID la creación de cuentas no se hace con un
// formulario propio de usuario/contraseña (eso es lo que hacía el backend viejo contra
// Keycloak). La cuenta se crea o bien: a) la registra un administrador en el tenant de
// Entra ID, o b) si el App Registration tiene habilitado un flujo de autoservicio
// (Entra External ID / "user flow" de sign-up-or-sign-in), la propia pantalla de Microsoft
// que se abre al autenticar ofrece la opción "Crear una". Por eso esta página dispara el
// mismo flujo de MSAL en vez de pedir usuario/contraseña.
export const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError(null);
        setLoading(true);
        try {
            await login();
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Error en registro con Entra ID", err);
            setError("No se pudo completar el registro. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
            <div className="glass-container text-center" style={{ maxWidth: 460, width: "100%" }}>
                <h2 className="fw-bold mb-2" style={{ color: "#0077b6" }}>
                    🌐 Crear cuenta
                </h2>
                <p className="text-muted mb-4">
                    SmartLogix usa Azure Entra ID para gestionar cuentas. Al continuar se abrirá
                    la pantalla de Microsoft, donde puedes iniciar sesión o crear una cuenta nueva
                    si tu organización lo permite.
                </p>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <button
                    className="btn btn-bubble w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    <i className="bi bi-microsoft"></i>
                    {loading ? "Conectando..." : "Registrarme con Microsoft"}
                </button>

                <p className="mt-4 mb-0 text-muted">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="fw-semibold" style={{ color: "#0077b6" }}>
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};
