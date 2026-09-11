import type { Product } from "../types/product";
import { useCar } from "../contexts/CartContext";

export const ProductCard = ({ product }: { product: Product }) => {
    const { addToCar, formatCLP } = useCar();
    const outOfStock = product.stock <= 0;

    return (
        <div className="card glossy-card p-3 h-100 border-0">
            <div className="position-relative">
                <img
                    src={product.imageSrc}
                    alt={product.title}
                    className="card-img-top rounded-4 shadow-sm"
                    style={{ height: "200px", objectFit: "cover", background: "rgba(255,255,255,0.8)" }}
                />
                <span
                    className={`badge position-absolute top-0 end-0 m-3 p-2 shadow ${outOfStock ? "bg-danger" : "bg-success"}`}
                    style={{ borderRadius: "12px", backdropFilter: "blur(4px)" }}
                >
                    {outOfStock ? "Sin stock" : `Stock: ${product.stock}`}
                </span>
            </div>

            <div className="card-body d-flex flex-column mt-2 p-0 pt-3">
                <h5 className="fw-bold text-dark">{product.title}</h5>
                <p className="text-muted small flex-grow-1">{product.description}</p>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className="fs-5" style={{ color: '#0077b6' }}>
                        {formatCLP(product.price)}
                    </strong>
                </div>

                <button
                    className={`btn ${outOfStock ? 'btn-secondary' : 'btn-bubble'} w-100 rounded-pill fw-bold py-2`}
                    disabled={outOfStock}
                    onClick={() => addToCar(product)}
                >
                    {outOfStock ? "No disponible" : "Agregar al carrito"}
                </button>
            </div>
        </div>
    );
};