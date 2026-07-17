# Leonel — Líder Frontend y unificación visual

## Responsabilidad principal

Definir la arquitectura frontend y garantizar que Oxcal y Cristian trabajen con los mismos patrones.

Áreas propias:

- Vite.
- React Router.
- AuthContext.
- ProtectedRoute.
- Layout.
- Navegación.
- Sistema visual.
- Componentes base.
- Revisión de frontend.
- Integración de vistas.

# Sprint 1

## Base React

Crear:

```text
src/
├── api/
├── components/
├── context/
├── layouts/
├── pages/
├── routes/
├── styles/
└── utils/
```

## Rutas propuestas

```text
/register
/login
/dashboard
/products
/movements
/reports
```

## Autenticación frontend

Implementar:

- AuthContext.
- Lectura inicial desde localStorage.
- Función login.
- Función logout.
- ProtectedRoute.
- Redirección a login.
- Axios de Auth.

## Layout

Crear:

- Sidebar o navbar.
- Encabezado.
- Contenedor principal.
- Opción de cerrar sesión.
- Navegación clara.

## Sistema visual

Definir variables:

```css
--color-primary
--color-background
--color-surface
--color-text
--color-muted
--color-danger
--color-warning
--color-success
--radius
--shadow
```

Crear componentes base:

- Button.
- Input.
- Select.
- Card.
- Table.
- Modal.
- Alert/Message.
- Loader.

No desarrollar diez variantes. Una versión consistente es suficiente.

### Commits sugeridos

```text
feat(frontend): initialize react application structure
feat(frontend): add authentication context and protected routes
feat(frontend): add application layout and design tokens
```

# Sprint 2

## Integración

Crear tres clientes Axios:

- authApi.
- inventoryApi.
- reportsApi.

Agregar interceptor para JWT en Inventory y Reports.

Ante 401:

- Borrar sesión.
- Redirigir a login.

## Supervisión

Revisar que:

- Oxcal use componentes compartidos.
- Cristian use componentes compartidos.
- No existan estilos en línea innecesarios.
- No se dupliquen modales, tablas o loaders.
- Las rutas estén conectadas.
- Los nombres coincidan con el contrato API.

## Integración visual

Unificar:

- Encabezados.
- Espaciados.
- Botones.
- Formularios.
- Tablas.
- Estados vacíos.
- Mensajes de error.

### Commits sugeridos

```text
feat(frontend): configure authenticated api clients
refactor(frontend): unify shared visual components
```

# Sprint 3

## Mejoras visuales

Prioridad:

1. Legibilidad.
2. Navegación.
3. Responsive básico.
4. Estados de carga.
5. Errores.
6. Confirmaciones.

No invertir tiempo en animaciones o gráficos complejos.

## QA frontend

Verificar:

- Refresh conserva sesión.
- Logout limpia sesión.
- Rutas protegidas no abren sin token.
- Formularios bloquean campos vacíos.
- Botones se desactivan durante solicitudes.
- Las tablas tienen estado vacío.
- Los errores del backend se muestran.
- No hay errores importantes en consola.
- Navegación funciona en todas las páginas.

### Commits sugeridos

```text
fix(frontend): handle loading and api error states
style(frontend): unify responsive application layout
```

# Coordinación

Oxcal es dueño de:

```text
pages/Products*
components/products/*
```

Cristian es dueño de:

```text
pages/Movements*
pages/Dashboard*
pages/Reports*
components/movements/*
components/reports/*
```

Leonel es dueño de:

```text
context/
layouts/
routes/
styles/
components/common/
```

# Preguntas que debes poder responder

- ¿Cómo se protege una ruta?
- ¿Dónde se guarda el JWT?
- ¿Cómo Axios agrega el token?
- ¿Qué ocurre con un 401?
- ¿Cómo se evita duplicar estilos?
- ¿Por qué se eligió Context y no Redux?
- ¿Cómo se distribuyeron las vistas entre frontend?
