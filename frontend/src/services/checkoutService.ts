import { API_URL as BASE_URL } from "../config/apiConfig";

export const checkout = async (payload: any) => {
    console.log("PAYLOAD CHECKOUT:", payload);

    const res = await fetch(`${BASE_URL}/api/bff/v1/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.text();
        console.error("ERROR BACKEND:", error);
        throw new Error("Error en checkout");
    }

    return res.json();
};