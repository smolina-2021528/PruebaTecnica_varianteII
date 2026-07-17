# Inventory System

Monorepo para una aplicaciÃ³n web de gestiÃ³n de inventario construida con React,
Node.js, Express, MongoDB y JWT.

## Estructura

```text
inventory-system/
â”œâ”€â”€ docs/
â”œâ”€â”€ frontend/
â”œâ”€â”€ service-auth/
â”œâ”€â”€ service-inventory/
â”œâ”€â”€ service-reports/
â”œâ”€â”€ docker-compose.yml
â”œâ”€â”€ package.json
â”œâ”€â”€ README.md
â””â”€â”€ .gitignore
```

## Puertos

| Componente | Puerto |
|---|---:|
| Frontend | 5173 |
| Auth | 4001 |
| Inventory | 4002 |
| Reports | 4003 |
| MongoDB | 27017 |

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Git.
- Docker Desktop opcional.

## InstalaciÃ³n

Desde la raÃ­z del repositorio:

```bash
npm install
```

Crear los archivos locales de entorno:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item service-auth/.env.example service-auth/.env
Copy-Item service-inventory/.env.example service-inventory/.env
Copy-Item service-reports/.env.example service-reports/.env
```

Los archivos `.env` no deben subirse.

Auth, Inventory y Reports deben utilizar exactamente el mismo valor de
`JWT_SECRET`.

## EjecuciÃ³n

Iniciar MongoDB con Docker:

```bash
npm run docker:up
```

Iniciar todos los proyectos:

```bash
npm run dev
```

TambiÃ©n pueden iniciarse individualmente:

```bash
npm run dev:frontend
npm run dev:auth
npm run dev:inventory
npm run dev:reports
```

## VerificaciÃ³n inicial

- Frontend: `http://localhost:5173`
- Auth: `http://localhost:4001/api/health`
- Inventory: `http://localhost:4002/api/health`
- Reports: `http://localhost:4003/api/health`

## Flujo Git

- `main`: versiÃ³n estable y demostrable.
- `develop`: integraciÃ³n del Sprint.
- Ramas personales: trabajo de cada integrante.
- No se trabaja directamente en `main` ni en `develop`.
- Todo cambio entra mediante Pull Request.
- Otro integrante debe revisar el Pull Request.

Flujo para actualizar una rama personal:

```bash
git checkout develop
git pull origin develop
git checkout <rama-personal>
git merge develop
```

Las ramas personales abren Pull Request hacia `develop`.

Al finalizar el Sprint, despuÃ©s del smoke test, se abre un Pull Request de
`develop` hacia `main`.

## Responsabilidades

| Integrante | Ãrea principal |
|---|---|
| SebastiÃ¡n | Base, Auth, Reports, Docker, integraciÃ³n y QA |
| Joshua | Inventory backend, modelos y movimientos |
| Leonel | Arquitectura frontend, autenticaciÃ³n y estilos |
| Oxcal | Productos, categorÃ­as y CRUD frontend |
| Cristian | Movimientos, dashboard y reportes frontend |

## Contratos principales

- Base path: `/api`.
- JWT: `Authorization: Bearer <token>`.
- Auth: `http://localhost:4001`.
- Inventory: `http://localhost:4002`.
- Reports: `http://localhost:4003`.
- Frontend: `http://localhost:5173`.
- Token local: `inventory_token`.
- Usuario local: `inventory_user`.
- Este MVP no implementa roles ni permisos.