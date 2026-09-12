import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const FROM_KEY = "smartlogix.postLoginRedirect";

export const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Si el usuario venía de una ruta protegida (ej. /admin), lo guardamos en
    // sessionStorage porque loginRedirect recarga la página por completo:
    // el state de react-router no sobrevive esa vuelta.
    const from = (location.state as { from?: string })?.from;
    if (from) {
        sessionStorage.setItem(FROM_KEY, from);
    }

    useEffect(() => {
        if (isAuthenticated) {
            const target = sessionStorage.getItem(FROM_KEY) || "/";
            sessionStorage.removeItem(FROM_KEY);
            navigate(target, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            // Esto navega fuera de la app hacia Microsoft; el código después
            // del await normalmente no llega a ejecutarse.
            await login();
        } catch (err) {
            console.error("Error en login con Entra ID", err);
            setError("No se pudo iniciar sesión. Intenta nuevamente.");
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
            <div className="glass-container text-center" style={{ maxWidth: 420, width: "100%" }}>
                <h2 className="fw-bold mb-2" style={{ color: "#0077b6" }}>
                    🌐 Iniciar sesión
                </h2>
                <p className="text-muted mb-4">
                    Accede a SmartLogix con tu cuenta corporativa de Microsoft (Azure Entra ID).
                </p>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <button
                    className="btn btn-bubble w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    <i className="bi bi-microsoft"></i>
                    {loading ? "Conectando..." : "Iniciar sesión con Microsoft"}
                </button>

                <p className="mt-4 mb-0 text-muted">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="fw-semibold" style={{ color: "#0077b6" }}>
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};
