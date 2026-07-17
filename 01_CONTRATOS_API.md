# Contratos de API

Este documento debe ser leído por todos antes de programar. Su objetivo es evitar que frontend y backend utilicen nombres o estructuras diferentes.

## Convenciones

- Base path: `/api`
- JSON en todas las solicitudes.
- JWT: `Authorization: Bearer <token>`
- Fechas en formato ISO.
- Identificadores de MongoDB como cadenas.
- Cantidades enteras positivas.
- Precio numérico igual o mayor a cero.

## Respuesta exitosa

```json
{
  "success": true,
  "message": "Operación realizada",
  "data": {}
}
```

## Respuesta con error

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": []
}
```

## Códigos HTTP

| Código | Uso |
|---:|---|
| 200 | Consulta o actualización correcta |
| 201 | Recurso creado |
| 400 | Datos inválidos |
| 401 | Token ausente, inválido o expirado |
| 404 | Recurso no encontrado |
| 409 | Correo o categoría duplicada |
| 500 | Error interno |

# Servicio Auth — `http://localhost:4001`

## Modelo User

```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "date"
}
```

La contraseña nunca debe aparecer en la respuesta.

## POST `/api/auth/register`

Body:

```json
{
  "name": "Sebastián Molina",
  "email": "sebastian@example.com",
  "password": "12345678"
}
```

Respuesta 201:

```json
{
  "success": true,
  "message": "Usuario registrado",
  "data": {
    "user": {
      "_id": "string",
      "name": "Sebastián Molina",
      "email": "sebastian@example.com"
    }
  }
}
```

## POST `/api/auth/login`

Body:

```json
{
  "email": "sebastian@example.com",
  "password": "12345678"
}
```

Respuesta 200:

```json
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
```

# Servicio Inventory — `http://localhost:4002`

Todos los endpoints requieren JWT.

## Modelo Product

```json
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
```

## Modelo Movement

```json
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
```

Valores de `type`:

- `ENTRY`
- `OUTPUT`

## Modelo Category

```json
{
  "_id": "string",
  "name": "Tecnología",
  "createdAt": "date"
}
```

## GET `/api/products`

Parámetros opcionales:

```text
?search=laptop&category=Tecnología
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "products": []
  }
}
```

## GET `/api/products/:id`

Retorna un producto.

## POST `/api/products`

```json
{
  "name": "Laptop",
  "category": "Tecnología",
  "price": 5000,
  "stock": 0,
  "minStock": 5
}
```

## PUT `/api/products/:id`

Acepta los mismos campos editables del producto.

No se recomienda editar el stock directamente después de crear el producto. Las modificaciones normales deben realizarse mediante entradas y salidas.

## DELETE `/api/products/:id`

Elimina el producto.

Para ahorrar tiempo, el historial de movimientos podrá conservar el nombre del producto aunque el producto sea eliminado.

## GET `/api/categories`

```json
{
  "success": true,
  "data": {
    "categories": []
  }
}
```

## POST `/api/categories`

```json
{
  "name": "Tecnología"
}
```

## DELETE `/api/categories/:id`

No debe eliminar una categoría que esté siendo utilizada, o debe responder con error 400.

## POST `/api/entries`

```json
{
  "productId": "string",
  "quantity": 10
}
```

Resultado:

- Crea movimiento `ENTRY`.
- Aumenta el stock.
- Guarda stock anterior y nuevo.

## POST `/api/outputs`

```json
{
  "productId": "string",
  "quantity": 3
}
```

Validaciones:

- Cantidad mayor que cero.
- Producto existente.
- Stock suficiente.

Resultado:

- Crea movimiento `OUTPUT`.
- Disminuye el stock.
- Nunca permite stock negativo.

## GET `/api/movements`

Filtros opcionales:

```text
?type=OUTPUT&productId=<id>
```

Este endpoint será consumido también por Reports.

# Servicio Reports — `http://localhost:4003`

Todos los endpoints requieren JWT.

Reports debe reenviar el token recibido cuando consulte Inventory.

## GET `/api/alerts/low-stock`

Regla:

```text
stock > 0 y stock <= minStock
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "count": 1,
    "products": []
  }
}
```

## GET `/api/alerts/out-of-stock`

Regla:

```text
stock === 0
```

## GET `/api/reports/top-products`

Agrupa movimientos `OUTPUT` por producto.

Respuesta:

```json
{
  "success": true,
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
```

Orden descendente por `totalSold`.

## GET `/api/reports/categories`

Agrupa productos por categoría.

```json
{
  "success": true,
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
```

## GET `/api/reports/summary`

```json
{
  "success": true,
  "data": {
    "totalProducts": 10,
    "totalUnits": 75,
    "inventoryValue": 25000,
    "lowStockCount": 2,
    "outOfStockCount": 1
  }
}
```

# Variables de entorno

## Auth

```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/inventory_auth
JWT_SECRET=change_me
JWT_EXPIRES_IN=4h
CLIENT_URL=http://localhost:5173
```

## Inventory

```env
PORT=4002
MONGODB_URI=mongodb://localhost:27017/inventory_core
JWT_SECRET=change_me
CLIENT_URL=http://localhost:5173
```

## Reports

```env
PORT=4003
JWT_SECRET=change_me
INVENTORY_SERVICE_URL=http://localhost:4002
CLIENT_URL=http://localhost:5173
```

## Frontend

```env
VITE_AUTH_API_URL=http://localhost:4001/api
VITE_INVENTORY_API_URL=http://localhost:4002/api
VITE_REPORTS_API_URL=http://localhost:4003/api
```

# Contrato frontend

El token se guarda en:

```text
localStorage key: inventory_token
```

El usuario se guarda en:

```text
localStorage key: inventory_user
```

Las instancias Axios deben agregar automáticamente:

```text
Authorization: Bearer <token>
```

Ante un error 401:

- Limpiar token.
- Limpiar usuario.
- Redirigir a `/login`.
