import { useEffect, useState } from "react";
import { getProducts } from "../services/inventoryService";
import type { Product } from "../types/product";

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    //  Separamos la función para poder llamarla desde afuera
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error obteniendo productos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 🔥 Ahora exportamos fetchProducts también
    return { products, loading, fetchProducts };
};