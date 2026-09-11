# SmartLogix

Monorepo con el frontend (React + Vite) y el backend (microservicios Spring
Boot/Spring Cloud) de SmartLogix.

```
smartlogix/
├── frontend/   -> SmartLogix-Frontend (React + Vite)
└── backend/    -> storechainparent (Eureka, API Gateway, microservicios)
```

Este despliegue es **manual, sin Docker y sin pipeline de CI/CD**: se hace
`git pull` en la instancia EC2 y se levanta cada servicio a mano (o con los
scripts de ayuda incluidos).

## 1. Requisitos en la instancia EC2

- Java 17+ y Maven
- Node 20+ y npm
- MySQL 8 corriendo (local en la misma EC2, o accesible por red)
- Puertos abiertos en el Security Group: `5173` (o el que sirva el
  frontend), `8089` (API Gateway), `8761` (Eureka) si necesitas verlo, y el
  puerto de MySQL si es una instancia separada.

## 2. Clonar el repo en EC2

```bash
git clone <URL_DE_TU_REPO> smartlogix
cd smartlogix
```

## 3. Bases de datos

Cada microservicio usa su propia base (creadas automáticamente por
Hibernate la primera vez que corre, gracias a `ddl-auto=create/update`):

- `inventory_db` (usado por `microservices/inventory`)
- `order_db` (usado por `microservices/order`)
- `shipment_db` (usado por `microservices/shipment`)

Solo hace falta que el usuario/contraseña de MySQL configurados en cada
`application.properties` (por defecto `root` sin contraseña) existan en el
MySQL de la EC2. Si usas otro usuario/host, sobrescríbelo por variable de
entorno al lanzar el jar, sin tocar el archivo, por ejemplo:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/inventory_db
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=tu_password
```

### Si la base es RDS (3 instancias separadas, una por microservicio)

Cada microservicio apunta a su propia instancia RDS. Antes de crear cada
base, revisa en la consola de esa instancia que su Security Group tenga una
regla de entrada MySQL/Aurora (puerto 3306) con origen = el Security Group
de tu EC2.

Crea la base dentro de cada instancia (Hibernate crea las tablas, no el
schema):

```bash
mysql -h <ENDPOINT_INVENTORY> -u admin -p -e "CREATE DATABASE inventory_db;"
mysql -h <ENDPOINT_ORDER> -u admin -p -e "CREATE DATABASE order_db;"
mysql -h <ENDPOINT_SHIPMENT> -u admin -p -e "CREATE DATABASE shipment_db;"
```

Luego, exporta las 3 variables **justo antes de lanzar cada jar**, con el
endpoint que le corresponde a ese microservicio (no se toca ningún
`application.properties`):

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://<ENDPOINT_INVENTORY>:3306/inventory_db
export SPRING_DATASOURCE_USERNAME=admin
export SPRING_DATASOURCE_PASSWORD=<password_inventory>
nohup java -jar microservices/inventory/target/*.jar > inventory.log 2>&1 &

export SPRING_DATASOURCE_URL=jdbc:mysql://<ENDPOINT_ORDER>:3306/order_db
export SPRING_DATASOURCE_USERNAME=admin
export SPRING_DATASOURCE_PASSWORD=<password_order>
nohup java -jar microservices/order/target/*.jar > order.log 2>&1 &

export SPRING_DATASOURCE_URL=jdbc:mysql://<ENDPOINT_SHIPMENT>:3306/shipment_db
export SPRING_DATASOURCE_USERNAME=admin
export SPRING_DATASOURCE_PASSWORD=<password_shipment>
nohup java -jar microservices/shipment/target/*.jar > shipment.log 2>&1 &
```

Revisa cada log (`tail -f inventory.log`, etc.) para confirmar que arrancó
sin errores de conexión antes de dar por hecho que quedó todo listo.

## 4. Compilar y levantar el backend (orden importa)

Compila todo desde la raíz de `backend/`:

```bash
cd backend
mvn -q -DskipTests clean package
```

Levanta los servicios **en este orden**, cada uno en su propia sesión
(`screen`, `tmux` o `nohup ... &`) para que sigan corriendo tras cerrar el
SSH:

```bash
# 1) Descubrimiento de servicios
nohup java -jar infraestructure/eurekaServer/target/*.jar > eureka.log 2>&1 &

# 2) Gateway (espera ~15-20s a que Eureka levante antes de este y los siguientes)
nohup java -jar infraestructure/apiGateway/target/*.jar > gateway.log 2>&1 &

# 3) Microservicios (orden entre ellos no importa)
nohup java -jar microservices/inventory/target/*.jar > inventory.log 2>&1 &
nohup java -jar microservices/order/target/*.jar > order.log 2>&1 &
nohup java -jar microservices/shipment/target/*.jar > shipment.log 2>&1 &
nohup java -jar microservices/bff/target/*.jar > bff.log 2>&1 &
```

`infraestructure/keyCloakAdapter` ya **no lo llama el frontend** (se
reemplazó por Entra ID/MSAL), así que no hace falta levantarlo salvo que lo
uses para otra cosa.

Revisa que todos se registraron en Eureka: `http://IP_PUBLICA_EC2:8761`.

## 5. CORS del Gateway

En `backend/infraestructure/apiGateway/src/main/resources/application.yml`,
reemplaza el placeholder por la URL pública real donde sirvas el frontend
antes de compilar:

```yaml
allowedOrigins:
  - "http://IP_PUBLICA_EC2:5173"
```

## 6. Frontend

```bash
cd frontend
cp .env.example .env
```

Edita `.env` con los valores reales:

```
VITE_API_URL=http://IP_PUBLICA_EC2:8089
VITE_AZURE_CLIENT_ID=<client id del App Registration en Entra ID>
VITE_AZURE_TENANT_ID=<tenant id>
VITE_AZURE_REDIRECT_URI=http://IP_PUBLICA_EC2:5173
```

`VITE_AZURE_REDIRECT_URI` debe estar agregado tal cual, como "Redirect URI"
tipo **SPA**, en el App Registration de Azure Entra ID — si no coincide
exacto, el login falla.

Build y servir:

```bash
npm install
npm run build
npx serve -s dist -l 5173
```

(`serve` sirve el build de producción; puedes cambiarlo por nginx apuntando
a `frontend/dist` si prefieres.)

## 7. Detener todo

```bash
pkill -f 'target/.*\.jar'   # backend
# y Ctrl+C o kill al proceso de `serve` del frontend
```
