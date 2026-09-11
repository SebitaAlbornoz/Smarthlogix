import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";

export const Products = () => {
    const { products, loading } = useProducts();

    if (loading) return (
        <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-primary fw-bold">Cargando catálogo...</p>
        </div>
    );

    return (
        <div className="container mb-5">
            <div className="glass-container mb-4 text-center">
                <h2 className="fw-bold" style={{ color: '#0077b6' }}>Nuestros Productos</h2>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {products.map((p) => (
                    <div className="col" key={p.id}>
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
};