import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="glass-container text-center text-dark" style={{ maxWidth: '700px' }}>
                <h1 className="display-4 fw-bold mb-3" style={{ color: '#0077b6' }}>
                    Bienvenido a SmartLogix 🍃
                </h1>

                <p className="lead mb-5 text-muted fw-medium">
                    Sistema de ecommerce potenciado por microservicios de última generación.
                    Rápido, fluido y transparente.
                </p>

                <div className="d-flex justify-content-center gap-4 mt-4">
                    <button
                        className="btn btn-bubble px-5 py-3 fs-5"
                        onClick={() => navigate("/products")}
                    >
                        Explorar Catálogo
                    </button>

                    <button
                        className="btn btn-outline-primary rounded-pill px-4 py-3 fw-bold bg-white"
                        style={{ border: '2px solid #00a8ff' }}
                        onClick={() => navigate("/checkout")}
                    >
                        Ir al Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};