import { Link, NavLink } from "react-router-dom";
import { useCar } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export const Navbar = () => {
    const { items } = useCar();
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav
            className="navbar navbar-expand-lg sticky-top shadow-sm mb-4"
            style={{
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.8)'
            }}
        >
            <div className="container">
                {/* BRAND */}
                <Link className="navbar-brand fw-bold" to="/" style={{ color: '#0077b6', fontSize: '1.5rem' }}>
                    🌐 SmartLogix
                </Link>

                {/* TOGGLE */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* LINKS */}
                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
                        <li className="nav-item">
                            <NavLink className="nav-link text-primary" to="/">Inicio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link text-primary" to="/products">Productos</NavLink>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <NavLink className="nav-link text-warning fw-bold" to="/admin">⚙️ Admin</NavLink>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        {isAuthenticated ? (
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-primary fw-semibold d-none d-md-inline">
                                    👤 {user?.name ?? user?.username}
                                </span>
                                <button className="btn btn-bubble-danger btn-sm" onClick={logout}>
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-sm btn-outline-primary fw-semibold">
                                Iniciar sesión
                            </Link>
                        )}

                        {/* CART BUTTON */}
                        <Link to="/cart" className="btn btn-bubble d-flex align-items-center gap-2">
                            🛒 Carrito
                            <span className="badge bg-white text-primary rounded-pill shadow-sm">
                                {items.length}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};