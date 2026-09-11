import { NavLink } from "react-router-dom";
import { useCar } from "../contexts/CartContext"

export const Test = () => {

  const { items, clearCart, addToCar, removeOne, removeAllItem, formatCLP, totalAmount } = useCar();

  if (items.length === 0) {
    return (
      <main className="container py-4">
        <div className="card card-gray p-4 text-white text-center">
          <h1 className="h3 mb-2">Carrito</h1>
          <p className="text-white py-3">El carrito esta vacío en este momento. Puedes ir a rellenarlo para comenzar con las pruebas en el boton de abajo.</p>
          <NavLink to="/products" className="nav-link">
              <button type="button" className="btn btn-outline-light">Ir a productos</button>
            </NavLink>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="card p-4 bg-dark text-light border-secondary">
        
        <header className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0">Laboratorio de Pruebas: Carrito</h1>
          <button className="btn btn-danger btn-sm" onClick={clearCart}>
            Vaciar carrito
          </button>
        </header>

        <section className="row g-4">
          <div className="col-12 col-lg-8">
            <ul className="list-group">
              {items.map((it) => {
                const subtotal = it.price * it.qty;
                return (
                  <li key={it.id} className="list-group-item bg-dark text-light border-secondary d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={it.imageSrc} alt={it.title} width={64} height={64} className="object-fit-contain bg-secondary rounded p-1" />
                      <div>
                        <h6 className="mb-1">{it.title}</h6>
                        <small className="text-muted">{formatCLP(it.price)} c/u</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-outline-secondary btn-sm px-2" onClick={() => removeOne(it.id)}>-</button>
                      <span className="fw-bold px-1">{it.qty}</span>
                      <button className="btn btn-outline-secondary btn-sm px-2" onClick={() => addToCar(it)}>+</button>
                    </div>

                    <div className="text-end" style={{ minWidth: 100 }}>
                      <div className="fw-bold">{formatCLP(subtotal)}</div>
                      <button className="btn btn-link text-danger p-0 small text-decoration-none" onClick={() => removeAllItem(it.id)}>
                        Eliminar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="col-12 col-lg-4">
            <div className="p-3 bg-secondary bg-opacity-10 rounded border border-secondary">
              <h5 className="mb-3">Resumen</h5>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Total</span>
                <span className="h4 mb-0 fw-bold text-success">{formatCLP(totalAmount)}</span>
              </div>
              <hr className="border-secondary" />
              <div className="d-grid">
                <button className="btn btn-success" onClick={() => alert("Simulando envío al Backend...")}>
                  Proceder al pago
                </button>
              </div>
            </div>
          </aside>
        </section>

      </div>
    </main>
  );
}