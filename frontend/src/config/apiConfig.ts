// Base URL del API Gateway (Spring Cloud Gateway, puerto 8089).
// En desarrollo local usa el .env con VITE_API_URL=http://localhost:8089
// En EC2, se define VITE_API_URL con la IP/dominio público del Gateway en el .env
// que se use al momento de hacer `npm run build` (Vite incrusta el valor en el build).
export const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:8089";
