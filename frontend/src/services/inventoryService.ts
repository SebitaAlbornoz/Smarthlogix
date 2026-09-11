import { API_URL as BASE_URL } from "../config/apiConfig";

const API = `${BASE_URL}/api/inventory/v1`;

export const getProducts = async () => {
    const res = await fetch(API);

    if (!res.ok) throw new Error("Error cargando productos");

    return res.json();
};