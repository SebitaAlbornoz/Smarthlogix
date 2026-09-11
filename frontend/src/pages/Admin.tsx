import { useEffect, useState } from "react";
import { getOrders, approveOrder, addStock, getProductMovements } from "../services/adminService";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../contexts/AuthContext";

export const Admin = () => {
    const { getAccessToken } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const { products, fetchProducts } = useProducts();
    const [stockInputs, setStockInputs] = useState<{ [key: number]: number }>({});

    // 🔥 Nuevos estados para el historial
    const [movements, setMovements] = useState<{ [key: number]: any[] }>({});
    const [viewingHistory, setViewingHistory] = useState<number | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const token = await getAccessToken();
            if (!token) return;
            const data = await getOrders(token);
            setOrders(data.reverse());
        } catch (error) {
            console.error("Error al cargar órdenes", error);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            const token = await getAccessToken();
            if (!token) return;
            await approveOrder(id, token);
            loadOrders();
        } catch (error) {
            alert("No se pudo aprobar la orden.");
        }
    };

    const handleAddStock = async (id: number) => {
        const qty = stockInputs[id];
        if (!qty || qty <= 0) return alert("Ingresa una cantidad válida mayor a 0");

        try {
            const token = await getAccessToken();
            if (!token) return;
            await addStock(id, qty, token);
            setStockInputs({ ...stockInputs, [id]: 0 });
            fetchProducts();
            // Si el historial está abierto, lo recargamos para que se vea el nuevo movimiento
            if (viewingHistory === id) {
                loadHistory(id);
            }
        } catch (error) {
            alert("Error al agregar stock.");
        }
    };

    // 🔥 Nueva función para cargar y mostrar el historial
    const loadHistory = async (id: number) => {
        try {
            const token = await getAccessToken();
            if (!token) return;
            const data = await getProductMovements(id, token);
            setMovements({ ...movements, [id]: data });
        } catch (error) {
            console.error("Error cargando historial", error);
        }
    };

    const toggleHistory = (id: number) => {
        if (viewingHistory === id) {
            setViewingHistory(null); // Cerrar si ya está abierto
        } else {
            setViewingHistory(id); // Abrir
            loadHistory(id); // Cargar datos
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <h2 className="fw-bold text-center mb-4" style={{ color: '#0077b6' }}>⚙️ Panel de Administración</h2>

            <div className="row g-4">
                {/* COLUMNA DE ÓRDENES */}
                <div className="col-md-6">
                    <div className="glass-container h-100">
                        <h4 className="fw-bold text-muted mb-3">📦 Gestión de Órdenes</h4>
                        {orders.length === 0 ? <p>No hay órdenes registradas.</p> : null}

                        {orders.map(order => (
                            <div key={order.id} className="glossy-card p-3 mb-3 border-0">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <strong style={{ color: '#0077b6' }}>ID: {order.id} | {order.orderNumber}</strong>
                                    <span className={`badge ${order.status === 'CREADO' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="mb-1 small text-muted"><strong>Cliente:</strong> {order.client}</p>
                                <p className="mb-2 small text-muted"><strong>Dirección:</strong> {order.address}</p>

                                {order.status === 'CREADO' && (
                                    <button
                                        className="btn btn-sm btn-bubble w-100 mt-2"
                                        onClick={() => handleApprove(order.id)}
                                    >
                                        ✅ Aprobar y Despachar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DE INVENTARIO */}
                <div className="col-md-6">
                    <div className="glass-container h-100">
                        <h4 className="fw-bold text-muted mb-3">🗄️ Reposición e Historial</h4>

                        {products.map(product => (
                            <div key={product.id} className="glossy-card p-3 mb-3 border-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-0">{product.title}</h6>
                                        <small className="text-muted">Stock actual: <strong className={product.stock <= 0 ? 'text-danger' : 'text-success'}>{product.stock}</strong></small>
                                    </div>

                                    <div className="d-flex gap-2">
                                        {/* 🔥 BOTÓN DE HISTORIAL */}
                                        <button
                                            className="btn btn-sm btn-outline-info rounded-circle"
                                            onClick={() => toggleHistory(product.id)}
                                            title="Ver Historial"
                                        >
                                            📜
                                        </button>

                                        <input
                                            type="number"
                                            className="form-control form-control-sm text-center border-0 shadow-sm"
                                            style={{ width: '70px', borderRadius: '10px' }}
                                            placeholder="0"
                                            min="1"
                                            value={stockInputs[product.id] || ''}
                                            onChange={(e) => setStockInputs({...stockInputs, [product.id]: parseInt(e.target.value)})}
                                        />
                                        <button
                                            className="btn btn-sm btn-outline-primary rounded-circle"
                                            onClick={() => handleAddStock(product.id)}
                                            title="Agregar Stock"
                                        >
                                            ➕
                                        </button>
                                    </div>
                                </div>

                                {/* 🔥 DESPLEGABLE DE HISTORIAL */}
                                {viewingHistory === product.id && (
                                    <div className="mt-3 p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.8)' }}>
                                        <h6 className="fw-bold text-muted small mb-2 border-bottom pb-1">Últimos Movimientos</h6>

                                        {(!movements[product.id] || movements[product.id].length === 0) ? (
                                            <p className="small text-muted mb-0">No hay movimientos registrados aún.</p>
                                        ) : (
                                            <ul className="list-unstyled mb-0 small">
                                                {movements[product.id].map((mov: any) => (
                                                    <li key={mov.id} className="d-flex justify-content-between align-items-center py-1">
                                                        <span>
                                                            {mov.movementType === 'IN' ? '🟢' : '🔴'} <span className="text-muted ms-1">{mov.reason}</span>
                                                        </span>
                                                        <strong className={mov.movementType === 'IN' ? 'text-success' : 'text-danger'}>
                                                            {mov.movementType === 'IN' ? '+' : '-'}{mov.quantity}
                                                        </strong>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};