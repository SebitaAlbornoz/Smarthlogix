import { useCar } from "../contexts/CartContext";

export const Cart = () => {
    const { items, removeOne, addToCar, formatCLP, totalAmount, clearCart } = useCar();

    if (items.length === 0) {
        return <h3 className="text-center mt-5">Carrito vacío 🛒</h3>;
    }

    return (
        <div className="container mt-4">
            <h2>Carrito</h2>

            {items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between align-items-center border p-2 mb-2">
                    <div>
                        <h5>{item.title}</h5>
                        <small>{formatCLP(item.price)}</small>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-danger" onClick={() => removeOne(item.id)}>
                            -
                        </button>

                        <span>{item.qty}</span>

                        <button className="btn btn-sm btn-success" onClick={() => addToCar(item)}>
                            +
                        </button>
                    </div>
                </div>
            ))}

            <h4 className="mt-3">Total: {formatCLP(totalAmount)}</h4>

            <button className="btn btn-warning mt-2" onClick={clearCart}>
                Vaciar carrito
            </button>
        </div>
    );
};