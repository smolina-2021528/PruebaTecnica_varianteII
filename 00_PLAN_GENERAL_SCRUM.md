# Plan general Scrum — Sistema de gestión de inventario

## 1. Objetivo de la prueba

Construir, en 4 horas y 30 minutos, una aplicación web funcional para administrar productos, registrar entradas y salidas de inventario y consultar alertas y reportes.

La solución debe mantenerse funcional al finalizar cada uno de los tres Sprints de 90 minutos.

## 2. Alcance técnico obligatorio

La aplicación se construirá como un monorepo con cuatro proyectos independientes:

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
```

Cada proyecto tendrá su propio `package.json`, dependencias, variables de entorno y puerto.

### Puertos propuestos

| Componente | Puerto |
|---|---:|
| Frontend React/Vite | 5173 |
| Servicio Auth | 4001 |
| Servicio Inventory | 4002 |
| Servicio Reports | 4003 |
| MongoDB | 27017 |

### Tecnologías

- React con Vite
- React Router
- Axios
- Node.js
- Express
- MongoDB con Mongoose
- JWT
- Argon2
- CSS global con variables y componentes reutilizables
- Docker Compose como forma adicional de ejecución
- Git y GitHub

No se utilizarán Redux, gateway, WebSockets, subida de imágenes, roles, paginación ni gráficos complejos. El objetivo es terminar un MVP estable.

## 3. Distribución del equipo

| Integrante | Responsabilidad principal |
|---|---|
| Sebastián | Scrum Master, base técnica, Docker, Auth, Reports, integración y QA |
| Joshua | Servicio Inventory, modelos, movimientos y pruebas backend |
| Leonel | Líder frontend, arquitectura visual, autenticación y supervisión de estilos |
| Oxcal | Productos, categorías y CRUD frontend |
| Cristian | Entradas, salidas, dashboard y reportes frontend |

Todos desarrollarán código y realizarán commits propios.

## 4. Arquitectura funcional

### Servicio Auth

Responsable únicamente de:

- Registro de usuarios.
- Inicio de sesión.
- Hash de contraseñas.
- Emisión de JWT.

### Servicio Inventory

Responsable de:

- CRUD de productos.
- Categorías.
- Entradas.
- Salidas.
- Actualización automática de existencias.
- Historial de movimientos.

### Servicio Reports

No guardará productos ni movimientos.

Consumirá por HTTP los endpoints protegidos de Inventory, reenviando el encabezado `Authorization`, y ejecutará lógica propia para calcular:

- Productos con bajo inventario.
- Productos agotados.
- Productos más vendidos.
- Resumen por categoría.
- Resumen general.

### Frontend

Consumirá los tres servicios:

- Auth para registro e inicio de sesión.
- Inventory para productos, categorías y movimientos.
- Reports para dashboard y reportes.

## 5. Reglas de implementación

### Respuesta estándar

```json
{
  "success": true,
  "message": "Operación realizada",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": []
}
```

### JWT

- Enviado como `Authorization: Bearer <token>`.
- El mismo `JWT_SECRET` estará configurado en Auth, Inventory y Reports.
- Inventory y Reports validarán el token localmente.
- Expiración sugerida: 4 horas.

### Inventario bajo

Un producto será considerado con bajo inventario cuando:

```text
stock > 0 y stock <= minStock
```

`minStock` tendrá valor predeterminado de 5.

## 6. Prioridades

### P0 — No negociable

- Los cuatro proyectos levantan.
- MongoDB conecta.
- Registro e inicio de sesión.
- JWT válido.
- Crear y consultar productos.
- Registrar entrada y salida.
- Actualizar stock.
- Al menos tres endpoints reales en Reports.
- Frontend autenticado y navegación funcional.
- Pull Request al finalizar cada Sprint.
- README funcional.

### P1 — Debe intentarse

- CRUD completo.
- Categorías.
- Cinco reportes solicitados.
- Validación básica cliente/servidor.
- Manejo uniforme de errores.
- Interfaz organizada.

### P2 — Solo después del MVP

- Búsqueda por nombre/categoría.
- Confirmaciones visuales.
- Estados de carga.
- Mejoras responsive.
- Docker completo para todos los servicios.

### Fuera de alcance

- Roles y permisos.
- Recuperación de contraseña.
- Refresh tokens.
- Carga de imágenes.
- Exportación PDF/Excel.
- Gráficas complejas.
- Pruebas automatizadas extensas.
- Arquitectura excesivamente abstracta.

## 7. Plan de los tres Sprints

# Sprint 1 — Base funcional

## Objetivo

Tener la arquitectura completa levantada y una ruta funcional por servicio.

## Cronograma

### Minutos 0–15

Sebastián:

- Crear repositorio.
- Crear estructura del monorepo.
- Agregar archivos base.
- Configurar puertos y variables.
- Configurar Docker/MongoDB.
- Abrir Pull Request de fundación.
- Joshua revisa y aprueba.

El resto del equipo revisa contratos y prepara sus tareas sin escribir sobre `main`.

### Minutos 15–65

Trabajo paralelo:

- Sebastián: Auth y esqueleto de Reports.
- Joshua: modelo Product y primeros endpoints de Inventory.
- Leonel: Vite, rutas, AuthContext, layout y estilos base.
- Oxcal: estructura visual de productos.
- Cristian: estructura visual de movimientos y dashboard.

### Minutos 65–75

- Detener nuevas funcionalidades.
- Probar cada módulo.
- Corregir errores bloqueantes.
- Hacer commits finales.

### Minutos 75–87

- Crear Pull Requests.
- Revisar cambios.
- Resolver conflictos.
- Integrar en `main`.

### Minutos 87–90

Smoke test:

1. Levantar servicios.
2. Registrar usuario.
3. Iniciar sesión.
4. Consultar primer endpoint de Inventory.
5. Consultar primer endpoint de Reports.
6. Abrir frontend.

## Incremento esperado

- Monorepo funcional.
- Auth register/login.
- Product model.
- GET y POST de productos.
- Primer endpoint de Reports.
- Login y registro visibles en frontend.
- Aplicación ejecutable desde `main`.

# Sprint 2 — Lógica principal

## Objetivo

Completar el flujo real de inventario e integrar el frontend.

## Cronograma estándar

- 0–5: Daily breve y actualización desde `main`.
- 5–65: Desarrollo.
- 65–75: Pruebas y congelamiento.
- 75–87: Pull Requests e integración.
- 87–90: Demo del incremento.

## Incremento esperado

- CRUD de productos.
- Categorías.
- Entradas y salidas.
- Validación de stock.
- Historial de movimientos.
- JWT en Inventory y Reports.
- Reports consumiendo Inventory por HTTP.
- Productos y movimientos integrados en frontend.
- Alertas iniciales.

# Sprint 3 — Finalización

## Objetivo

Completar reportes, validaciones, manejo de errores y presentación.

## Incremento esperado

- Cinco endpoints de Reports.
- Dashboard completo.
- Resumen general.
- Búsqueda de productos.
- Validaciones cliente/servidor.
- Manejo de errores.
- Loading y mensajes.
- Consistencia visual.
- README final.
- Prueba completa.
- Integración final a `main`.

## Regla de congelamiento

En el minuto 60 del Sprint 3 se deja de agregar funcionalidad.

Los últimos 30 minutos son exclusivamente para:

- Integración.
- Pruebas.
- README.
- Limpieza de consola.
- Preparación de demostración.
- Verificación de GitHub.

## 8. Definition of Done

Una tarea se considera terminada solamente cuando:

- Compila y ejecuta.
- No rompe funcionalidades existentes.
- Tiene validaciones mínimas.
- Maneja errores previsibles.
- Fue probada manualmente.
- Tiene commit descriptivo.
- Está incluida en un Pull Request.
- Fue revisada por otro integrante.
- Está disponible en `main`.

## 9. Plan de contingencia

### Si Docker falla

Continuar con ejecución local:

```bash
npm install
npm run dev
```

MongoDB podrá ejecutarse localmente. Docker no debe bloquear el MVP.

### Si Reports no logra consumir Inventory

Verificar primero:

1. `INVENTORY_SERVICE_URL`.
2. Encabezado `Authorization`.
3. CORS.
4. Puerto 4002.
5. Respuesta de `/api/products` y `/api/movements`.

No copiar datos de Inventory dentro de Reports.

### Si una vista frontend no está terminada

Priorizar formularios y tablas funcionales. El diseño avanzado se elimina.

### Si hay conflictos Git

- No resolver directamente en `main`.
- Actualizar la rama desde `main`.
- Resolver con el dueño de los archivos.
- Probar antes de completar el PR.

## 10. Flujo de demostración

1. Registrar un usuario.
2. Iniciar sesión.
3. Crear una categoría.
4. Crear un producto con stock 0.
5. Registrar una entrada de 10 unidades.
6. Registrar una salida de 6 unidades.
7. Mostrar stock actual de 4.
8. Ver el producto en bajo inventario.
9. Registrar salida de 4.
10. Ver producto agotado.
11. Mostrar top de productos.
12. Mostrar resumen por categoría.
13. Mostrar resumen general.

Este recorrido demuestra autenticación, JWT, CRUD, movimientos, actualización de stock, comunicación entre servicios, alertas y reportes.
