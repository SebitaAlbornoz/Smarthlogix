import type {Product} from "../types/product";
import { API_URL as BASE_URL } from "../config/apiConfig";

const API_URL = `${BASE_URL}/api/inventory/v1`;

export const getProducts = async (): Promise<Product[]> => {
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error("Error cargando productos");
    }

    return res.json();
};