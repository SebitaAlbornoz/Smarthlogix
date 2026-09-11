import { useCar } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
    const {
        items,
        removeOne,
        addToCar,
        removeAllItem,
        clearCart,
        formatCLP,
        totalAmount,
    } = useCar();

    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="text-center p-5 mt-5 glass-container">
                {/* Si tienes tu foto, usa: src={require('../assets/tu-foto.png')} */}
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                    alt="Carrito vacío"
                    className="mb-4"
                    style={{ width: '150px', opacity: 0.8 }}
                />
                <h3 className="fw-bold" style={{ color: '#0077b6' }}>¡Tu carrito está esperando!</h3>
                <p className="text-muted mb-4">No hay productos por aquí. ¡Explora el catálogo y encuentra algo increíble!</p>
                <a href="/" className="btn btn-bubble px-4 rounded-pill fw-bold">
                    Ir a Productos
                </a>
            </div>
        );
    }

    // Dentro de Cart.tsx
    return (
        <div className="container mt-5">
            <div className="glass-container">
                <h2 className="mb-4">🛒 Tu carrito</h2>

                <div className="mt-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="d-flex justify-content-between align-items-center p-3 mb-3 glossy-card"
                        >
                            <div>
                                <h5 className="mb-1">{item.title}</h5>
                                <p className="mb-1 text-primary fw-bold">{formatCLP(item.price)}</p>
                                <small className="text-muted">Cantidad: {item.qty}</small>
                            </div>

                            <div className="d-flex gap-2 align-items-center">
                                <button className="btn btn-sm btn-outline-secondary rounded-circle px-2" onClick={() => removeOne(item.id)}>-</button>
                                <span className="fw-bold mx-2">{item.qty}</span>
                                <button className="btn btn-sm btn-outline-primary rounded-circle px-2" onClick={() => addToCar(item)}>+</button>
                                <button className="btn btn-sm btn-bubble-danger ms-3" onClick={() => removeAllItem(item.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="my-4" style={{ borderColor: 'rgba(0,0,0,0.1)' }} />

                <h4 className="fw-bold">Total: {formatCLP(totalAmount)}</h4>

                <div className="d-flex gap-3 mt-4">
                    <button className="btn btn-outline-danger rounded-pill px-4" onClick={clearCart}>
                        Vaciar carrito
                    </button>
                    <button className="btn btn-bubble" onClick={() => navigate("/checkout")}>
                        Proceder al pago
                    </button>
                </div>
            </div>
        </div>
    );
};