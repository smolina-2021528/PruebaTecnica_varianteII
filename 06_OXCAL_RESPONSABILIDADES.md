# Oxcal — Productos y categorías frontend

## Responsabilidad principal

Construir la administración de productos y categorías.

Áreas propias:

- Página de productos.
- Tabla.
- Formulario.
- Crear.
- Editar.
- Eliminar.
- Buscar.
- Filtrar por categoría.
- Gestión básica de categorías.

# Sprint 1

## Estructura visual

Crear componentes:

```text
pages/ProductsPage
components/products/ProductTable
components/products/ProductForm
components/products/ProductModal
```

Puede trabajar temporalmente con datos simulados mientras Joshua termina los endpoints.

Campos visibles:

- Nombre.
- Categoría.
- Precio.
- Stock.
- Stock mínimo.
- Acciones.

Usar los componentes comunes definidos por Leonel.

### Commit sugerido

```text
feat(frontend): add products page structure
```

# Sprint 2

## Integración CRUD

Conectar:

- GET products.
- POST product.
- PUT product.
- DELETE product.
- GET categories.
- POST category.
- DELETE category.

## Comportamiento

### Crear

- Abrir formulario.
- Validar campos.
- Enviar solicitud.
- Cerrar modal.
- Recargar lista.
- Mostrar éxito o error.

### Editar

- Cargar datos actuales.
- Permitir cambiar nombre, categoría, precio y stock mínimo.
- Evitar modificar stock directamente si el equipo acuerda usar solo movimientos.

### Eliminar

- Solicitar confirmación.
- Ejecutar DELETE.
- Actualizar tabla.

### Búsqueda

Enviar `search` y `category` como query params o filtrar localmente si el backend aún no está listo.

### Commits sugeridos

```text
feat(frontend): integrate product crud
feat(frontend): add category management
feat(frontend): add product search and filters
```

# Sprint 3

## Validaciones

- Nombre obligatorio.
- Categoría obligatoria.
- Precio >= 0.
- Stock inicial >= 0.
- Stock mínimo >= 0.
- Números convertidos antes de enviar.
- Mensaje de error visible.

## Estados

- Loading.
- Sin productos.
- Error de red.
- Operación exitosa.
- Botón desactivado durante guardado.

## QA

Probar:

1. Crear producto.
2. Crear producto inválido.
3. Editar.
4. Cancelar edición.
5. Eliminar.
6. Buscar.
7. Filtrar.
8. Recargar página.
9. Token expirado.
10. Backend apagado.

### Commits sugeridos

```text
fix(frontend): validate product forms
fix(frontend): handle product loading and empty states
```

# Archivos bajo tu control

```text
frontend/src/pages/ProductsPage*
frontend/src/components/products/*
```

Coordinar con Leonel antes de modificar:

```text
frontend/src/routes/
frontend/src/styles/
frontend/src/components/common/
```

# Preguntas que debes poder responder

- ¿Cómo se crea un producto?
- ¿Cómo se actualiza la tabla después de guardar?
- ¿Cómo se manejan errores?
- ¿Por qué no se modifica el stock desde edición?
- ¿Cómo funciona la búsqueda?
- ¿Cómo se validan los campos numéricos?
