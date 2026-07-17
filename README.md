# Inventory System

Sistema web de gestión de inventario construido como monorepo con React, Node.js, Express, MongoDB y JWT.

El objetivo del proyecto es permitir que un usuario pueda registrarse, iniciar sesión, administrar productos y categorías, registrar entradas y salidas de inventario, consultar alertas y revisar reportes generales.

## Tabla de contenido

- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Puertos](#puertos)
- [Requisitos](#requisitos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Ejecución local](#ejecución-local)
- [Ejecución con Docker](#ejecución-con-docker)
- [Scripts disponibles](#scripts-disponibles)
- [Endpoints principales](#endpoints-principales)
- [Flujo de demostración](#flujo-de-demostración)
- [Casos negativos recomendados](#casos-negativos-recomendados)
- [Integrantes y responsabilidades](#integrantes-y-responsabilidades)
- [Flujo Git recomendado](#flujo-git-recomendado)
- [Solución de problemas](#solución-de-problemas)
- [Alcance del MVP](#alcance-del-mvp)

## Tecnologías

- React con Vite
- React Router
- Axios
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Argon2
- CSS global con componentes reutilizables
- Docker Compose para MongoDB
- Git y GitHub

## Arquitectura

La solución está dividida en cuatro proyectos independientes dentro de un monorepo.

### Frontend

Aplicación React encargada de:

- Registro e inicio de sesión.
- Navegación protegida.
- Administración de productos.
- Administración de categorías.
- Registro de entradas y salidas.
- Dashboard de alertas.
- Reportes de inventario.

### Servicio Auth

Servicio responsable únicamente de:

- Registro de usuarios.
- Hash de contraseñas con Argon2.
- Inicio de sesión.
- Emisión de JWT.

Este servicio no administra productos ni movimientos.

### Servicio Inventory

Servicio central de inventario. Administra:

- Productos.
- Categorías.
- Entradas de stock.
- Salidas de stock.
- Historial de movimientos.

Nunca debe permitir stock negativo.

### Servicio Reports

Servicio de reportes. No guarda productos ni movimientos.

Consume Inventory por HTTP, reenvía el encabezado `Authorization` y calcula:

- Productos con bajo inventario.
- Productos agotados.
- Productos más vendidos.
- Resumen por categoría.
- Resumen general.

## Estructura del proyecto

```text
inventory-system/
├── frontend/
├── service-auth/
├── service-inventory/
├── service-reports/
├── docker-compose.yml
├── package.json
├── README.md
└── .gitignore

Puertos
Componente	Puerto	URL base
Frontend React/Vite	5173	http://localhost:5173
Servicio Auth	4001	http://localhost:4001
Servicio Inventory	4002	http://localhost:4002
Servicio Reports	4003	http://localhost:4003
MongoDB	27017	mongodb://localhost:27017
Requisitos
Node.js 20 o superior.
npm 10 o superior.
Git.
Docker Desktop, opcional pero recomendado para MongoDB.
Navegador moderno.

Verificar versiones:

node --version
npm --version
git --version
docker --version
Variables de entorno

Cada proyecto tiene su propio archivo .env.example.

Los archivos .env reales no deben subirse al repositorio.

Frontend — frontend/.env
VITE_AUTH_API_URL=http://localhost:4001/api
VITE_INVENTORY_API_URL=http://localhost:4002/api
VITE_REPORTS_API_URL=http://localhost:4003/api
Auth — service-auth/.env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/inventory_auth
JWT_SECRET=change_me
JWT_EXPIRES_IN=4h
CLIENT_URL=http://localhost:5173
Inventory — service-inventory/.env
PORT=4002
MONGODB_URI=mongodb://localhost:27017/inventory_core
JWT_SECRET=change_me
CLIENT_URL=http://localhost:5173
Reports — service-reports/.env
PORT=4003
JWT_SECRET=change_me
INVENTORY_SERVICE_URL=http://localhost:4002
CLIENT_URL=http://localhost:5173
JWT

Auth, Inventory y Reports deben usar exactamente el mismo valor de:

JWT_SECRET=change_me

Auth emite el token. Inventory y Reports lo validan localmente.

El token se envía así:

Authorization: Bearer <token>
CORS en red local

Si el frontend se abre desde una IP de red, por ejemplo:

http://172.26.192.1:5173

entonces los servicios backend deben permitir ese origen en CLIENT_URL.

Ejemplo:

CLIENT_URL=http://localhost:5173,http://172.26.192.1:5173

Después de cambiar .env, se deben reiniciar los servicios backend.

Instalación

Desde la raíz del repositorio:

npm install

Crear archivos .env desde los ejemplos.

En PowerShell:

Copy-Item frontend/.env.example frontend/.env
Copy-Item service-auth/.env.example service-auth/.env
Copy-Item service-inventory/.env.example service-inventory/.env
Copy-Item service-reports/.env.example service-reports/.env

En Bash:

cp frontend/.env.example frontend/.env
cp service-auth/.env.example service-auth/.env
cp service-inventory/.env.example service-inventory/.env
cp service-reports/.env.example service-reports/.env
Ejecución local
1. Levantar MongoDB con Docker
npm run docker:up
2. Levantar todos los proyectos
npm run dev
3. Abrir la aplicación
http://localhost:5173
Ejecución individual

También se puede levantar cada proyecto por separado.

npm run dev:frontend
npm run dev:auth
npm run dev:inventory
npm run dev:reports

Se recomienda usar una terminal por servicio cuando se esté depurando.

Ejecución con Docker

El docker-compose.yml incluido levanta MongoDB.

docker compose up -d mongodb

Ver estado:

docker compose ps

Detener servicios:

docker compose down

Eliminar también los datos de MongoDB:

docker compose down -v
Scripts disponibles

Desde la raíz del proyecto:

Script	Descripción
npm run dev	Levanta frontend, Auth, Inventory y Reports en paralelo
npm run dev:frontend	Levanta solo el frontend
npm run dev:auth	Levanta solo Auth
npm run dev:inventory	Levanta solo Inventory
npm run dev:reports	Levanta solo Reports
npm run build:frontend	Compila el frontend
npm run docker:up	Levanta MongoDB con Docker
npm run docker:down	Detiene los contenedores
Verificación inicial

Con los servicios levantados, verificar:

Frontend:  http://localhost:5173
Auth:      http://localhost:4001/api/health
Inventory: http://localhost:4002/api/health
Reports:   http://localhost:4003/api/health

Cada health endpoint debe responder con success: true.

Endpoints principales

Todas las respuestas siguen una estructura estándar.

Respuesta exitosa:

{
  "success": true,
  "message": "Operación realizada",
  "data": {}
}

Respuesta con error:

{
  "success": false,
  "message": "Descripción del error",
  "errors": []
}
Auth

Base URL:

http://localhost:4001/api
Método	Endpoint	Descripción	Requiere JWT
GET	/health	Verifica estado del servicio	No
POST	/auth/register	Registra usuario	No
POST	/auth/login	Inicia sesión y devuelve JWT	No
Registro
POST /api/auth/register

Body:

{
  "name": "Sebastián Molina",
  "email": "sebastian@example.com",
  "password": "12345678"
}
Login
POST /api/auth/login

Body:

{
  "email": "sebastian@example.com",
  "password": "12345678"
}

Respuesta esperada:

{
  "success": true,
  "message": "Inicio de sesión correcto",
  "data": {
    "token": "jwt",
    "user": {
      "_id": "string",
      "name": "Sebastián Molina",
      "email": "sebastian@example.com"
    }
  }
}

La contraseña nunca debe regresar en la respuesta.

Inventory

Base URL:

http://localhost:4002/api

Todos los endpoints de Inventory requieren:

Authorization: Bearer <token>
Método	Endpoint	Descripción
GET	/health	Verifica estado del servicio
GET	/products	Lista productos
GET	/products/:id	Obtiene un producto por ID
POST	/products	Crea producto
PUT	/products/:id	Actualiza producto
DELETE	/products/:id	Elimina producto
GET	/categories	Lista categorías
POST	/categories	Crea categoría
DELETE	/categories/:id	Elimina categoría
POST	/entries	Registra entrada de stock
POST	/outputs	Registra salida de stock
GET	/movements	Lista movimientos
Producto

Modelo base:

{
  "_id": "string",
  "name": "Laptop",
  "category": "Tecnología",
  "price": 5000,
  "stock": 10,
  "minStock": 5,
  "createdAt": "date",
  "updatedAt": "date"
}

Crear producto:

POST /api/products

Body:

{
  "name": "Laptop",
  "category": "Tecnología",
  "price": 5000,
  "stock": 0,
  "minStock": 5
}

Buscar o filtrar:

GET /api/products?search=laptop&category=Tecnología
Categoría

Crear categoría:

POST /api/categories

Body:

{
  "name": "Tecnología"
}

Una categoría no debe eliminarse si está siendo utilizada por productos.

Entrada de stock
POST /api/entries

Body:

{
  "productId": "string",
  "quantity": 10
}

Resultado:

Crea movimiento ENTRY.
Aumenta el stock.
Guarda previousStock y newStock.
Salida de stock
POST /api/outputs

Body:

{
  "productId": "string",
  "quantity": 3
}

Validaciones:

Cantidad entera mayor que cero.
Producto existente.
Stock suficiente.
Nunca permitir stock negativo.

Resultado:

Crea movimiento OUTPUT.
Disminuye el stock.
Guarda previousStock y newStock.
Movimientos
GET /api/movements

Filtros opcionales:

GET /api/movements?type=ENTRY
GET /api/movements?type=OUTPUT
GET /api/movements?productId=<id>

Modelo base:

{
  "_id": "string",
  "productId": "string",
  "productName": "Laptop",
  "type": "ENTRY",
  "quantity": 10,
  "previousStock": 0,
  "newStock": 10,
  "createdAt": "date"
}
Reports

Base URL:

http://localhost:4003/api

Todos los endpoints de Reports requieren:

Authorization: Bearer <token>

Reports consulta Inventory por HTTP y reenvía el token recibido.

Método	Endpoint	Descripción
GET	/health	Verifica estado del servicio
GET	/alerts/low-stock	Productos con bajo inventario
GET	/alerts/out-of-stock	Productos agotados
GET	/reports/top-products	Productos más vendidos
GET	/reports/categories	Resumen por categoría
GET	/reports/summary	Resumen general
Bajo inventario
GET /api/alerts/low-stock

Regla:

stock > 0 && stock <= minStock

Respuesta:

{
  "success": true,
  "message": "Productos con bajo inventario",
  "data": {
    "count": 1,
    "products": []
  }
}
Agotados
GET /api/alerts/out-of-stock

Regla:

stock === 0
Productos más vendidos
GET /api/reports/top-products

Regla:

Toma los movimientos OUTPUT.
Agrupa por producto.
Suma la cantidad vendida.
Ordena de mayor a menor.

Respuesta:

{
  "success": true,
  "message": "Productos más vendidos",
  "data": {
    "products": [
      {
        "productId": "string",
        "name": "Laptop",
        "totalSold": 15
      }
    ]
  }
}
Resumen por categoría
GET /api/reports/categories

Respuesta:

{
  "success": true,
  "message": "Resumen por categorías",
  "data": {
    "categories": [
      {
        "category": "Tecnología",
        "productCount": 3,
        "totalUnits": 20,
        "inventoryValue": 15000
      }
    ]
  }
}
Resumen general
GET /api/reports/summary

Respuesta:

{
  "success": true,
  "message": "Resumen general de inventario",
  "data": {
    "totalProducts": 10,
    "totalUnits": 75,
    "inventoryValue": 25000,
    "lowStockCount": 2,
    "outOfStockCount": 1
  }
}
Frontend

Rutas principales:

Ruta	Descripción	Protegida
/register	Registro de usuario	No
/login	Inicio de sesión	No
/dashboard	Dashboard principal	Sí
/products	Administración de productos y categorías	Sí
/movements	Entradas, salidas e historial	Sí
/reports	Reportes generales	Sí

El frontend guarda:

inventory_token
inventory_user

en localStorage.

Ante error 401, debe limpiar sesión y redirigir a /login.

Flujo de demostración

Este flujo permite validar el funcionamiento completo del sistema.

Abrir http://localhost:5173.
Registrar un usuario.
Iniciar sesión.
Crear una categoría, por ejemplo Tecnología.
Crear un producto con stock inicial 0 y stock mínimo 5.
Registrar una entrada de 10 unidades.
Verificar que el stock suba a 10.
Registrar una salida válida de 6 unidades.
Verificar que el stock quede en 4.
Confirmar que el producto aparezca en bajo inventario.
Registrar una salida válida de 4 unidades.
Verificar que el stock quede en 0.
Confirmar que el producto aparezca como agotado.
Revisar el reporte de productos más vendidos.
Revisar el resumen por categoría.
Revisar el resumen general.
Intentar una salida mayor al stock disponible.
Confirmar que el sistema muestra error y no deja stock negativo.
Cerrar sesión.
Casos negativos recomendados
Auth
Registro con correo duplicado.
Registro con contraseña corta.
Login con contraseña incorrecta.
Login con usuario inexistente.
Seguridad JWT
Consultar Inventory sin token.
Consultar Reports sin token.
Enviar token inválido.
Usar token expirado.
Productos
Crear producto sin nombre.
Crear producto sin categoría.
Crear producto con precio negativo.
Crear producto con stock negativo.
Crear producto con stock mínimo negativo.
Buscar producto inexistente.
Consultar producto con ObjectId inválido.
Categorías
Crear categoría vacía.
Crear categoría duplicada.
Eliminar una categoría usada por productos.
Movimientos
Entrada con cantidad cero.
Entrada con cantidad decimal.
Salida con cantidad negativa.
Salida mayor al stock disponible.
Movimiento con producto inexistente.
Movimiento con ObjectId inválido.
Reports
Consultar Reports con Inventory apagado.
Confirmar respuesta clara con error 502 o mensaje de servicio no disponible.
Confirmar que Reports no almacena productos ni movimientos.
Integrantes y responsabilidades
Integrante	Responsabilidad
Sebastián	Scrum Master, configuración raíz, Docker, Auth, Reports, integración, README y QA final
Joshua	Backend Inventory, productos, categorías, movimientos, entradas, salidas y pruebas backend
Leonel	Líder frontend, rutas, AuthContext, ProtectedRoute, layout, navegación y componentes comunes
Oxcal	Productos frontend, categorías frontend, CRUD, búsqueda y filtros
Cristian	Movimientos frontend, dashboard, alertas, reportes y resumen general