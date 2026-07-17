# Cristian — Movimientos, dashboard y reportes frontend

## Responsabilidad principal

Construir el flujo de entradas y salidas, además del dashboard de alertas y reportes.

Áreas propias:

- MovementsPage.
- Formularios de entrada y salida.
- Historial.
- Dashboard.
- Alertas.
- ReportsPage.
- Resumen general.

# Sprint 1

## Estructura visual

Crear:

```text
pages/MovementsPage
pages/DashboardPage
pages/ReportsPage
components/movements/MovementForm
components/movements/MovementTable
components/reports/SummaryCards
```

Puede utilizar datos simulados mientras los servicios estén en desarrollo.

La pantalla de movimientos debe contemplar:

- Selección de producto.
- Tipo de movimiento.
- Cantidad.
- Botón registrar.
- Historial.

### Commit sugerido

```text
feat(frontend): add movement and dashboard page structures
```

# Sprint 2

## Entradas y salidas

Conectar:

- GET products.
- POST entries.
- POST outputs.
- GET movements.

Comportamiento:

1. Seleccionar producto.
2. Mostrar stock actual.
3. Elegir entrada o salida.
4. Ingresar cantidad.
5. Registrar.
6. Mostrar resultado.
7. Actualizar stock e historial.

Para salida:

- Mostrar error si no hay stock suficiente.
- No alterar la interfaz manualmente si el backend rechazó la solicitud.

## Dashboard

Conectar inicialmente:

- GET low-stock.
- GET out-of-stock.
- GET summary.

Mostrar:

- Total de productos.
- Total de unidades.
- Valor de inventario.
- Cantidad con bajo stock.
- Cantidad agotada.
- Listas de alerta.

### Commits sugeridos

```text
feat(frontend): integrate inventory entry and output forms
feat(frontend): add movement history
feat(frontend): integrate inventory alerts dashboard
```

# Sprint 3

## Reportes

Conectar:

- GET top-products.
- GET categories.
- GET summary.

Mostrar:

- Tabla de productos más vendidos.
- Tabla o tarjetas por categoría.
- Resumen general.
- Mensajes si no existen movimientos.

No es obligatorio crear gráficas. Una tabla clara cumple el objetivo y reduce riesgos.

## Validaciones

- Producto obligatorio.
- Cantidad entera mayor que cero.
- Tipo obligatorio.
- Botón desactivado durante solicitud.
- Error visible.
- Limpiar formulario después del éxito.

## QA

Probar:

1. Entrada válida.
2. Salida válida.
3. Salida mayor al stock.
4. Producto agotado.
5. Producto con bajo stock.
6. Historial.
7. Top productos.
8. Resumen por categoría.
9. Resumen general.
10. Reports sin datos.

### Commits sugeridos

```text
feat(frontend): complete inventory reports views
fix(frontend): validate movement forms and api errors
style(frontend): polish dashboard states
```

# Archivos bajo tu control

```text
frontend/src/pages/MovementsPage*
frontend/src/pages/DashboardPage*
frontend/src/pages/ReportsPage*
frontend/src/components/movements/*
frontend/src/components/reports/*
```

Coordinar con Leonel antes de modificar rutas o estilos globales.

# Preguntas que debes poder responder

- ¿Cómo se registra una entrada?
- ¿Cómo se registra una salida?
- ¿Qué hace el frontend cuando no hay stock suficiente?
- ¿Qué endpoints utiliza el dashboard?
- ¿Cómo se calcula el top de productos?
- ¿Cuál es la diferencia entre alerta y reporte?
- ¿Por qué los cálculos se realizan en Reports y no en React?
