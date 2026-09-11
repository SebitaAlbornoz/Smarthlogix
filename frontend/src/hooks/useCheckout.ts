import { checkout } from "../services/checkoutService";
import { useCar } from "../contexts/CartContext";

export const useCheckout = () => {
    const { items, clearCart } = useCar();

    // Ahora recibe el nombre y la dirección por parámetro
    const pay = async (clientName: string, clientAddress: string) => {
        const payload = {
            client: clientName,
            address: clientAddress, // 🔥 NUEVO CAMPO
            details: items.map((i) => ({
                productId: i.id,
                quantity: i.qty,
            }))
        };

        const order = await checkout(payload);
        clearCart();
        return order;
    };

    return { pay };
};