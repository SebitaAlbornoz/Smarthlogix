import { createContext, useState, type ReactNode, useContext } from "react";

export type Product = {
    id: number;
    title: string;
    description?: string;
    category?: string;
    price: number;
    imageSrc: string;
};

export type CartItem = Product & { qty: number };

type CartContextType = {
    items: CartItem[];
    addToCar: (p: Product) => void;
    removeOne: (id: number) => void;
    removeItem: (id: number) => void;
    removeAllItem: (id: number) => void; // Corregido a number minúscula
    clearCart: () => void;
    formatCLP: (n: number) => string;
    totalAmount: number; // ¡Agregado!
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCar = (p: Product) => {
        setItems((prev) => {
            const exist = prev.find((e) => e.id === p.id);
            if (!exist) {
                return [...prev, { ...p, qty: 1 }];
            } else {
                return prev.map((e) => e.id === p.id ? { ...e, qty: e.qty + 1 } : e);
            }
        });
    };

    const formatCLP = (n: number) =>
        new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
        }).format(n);

    const removeOne = (id: number) => {
        setItems((prev) => {
            const it = prev.find((x) => x.id === id);
            if (!it) return prev;
            if (it.qty === 1) return prev.filter((x) => x.id !== id);
            return prev.map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x));
        });
    };

    const removeItem = (id: number) => {
        setItems((prev) => {
            const producto = prev.find((x) => x.id === id);
            if (!producto) return prev;
            if (producto.qty === 1) {
                return prev.filter((x) => x.id !== id);
            }
            return prev.map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x));
        });
    };


    const removeAllItem = (id: number) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
    };

    const clearCart = () => setItems([]);

    //calcula el monto total
    const totalAmount = items.reduce((acc, it) => acc + (it.price * it.qty), 0);

    return (
        <CartContext.Provider 
            value={{ items, addToCar, removeOne, removeItem, removeAllItem, clearCart, formatCLP, totalAmount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCar = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('Error en el useCart/Context');
    return ctx;
};