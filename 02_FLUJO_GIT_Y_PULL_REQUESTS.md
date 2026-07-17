# Flujo Git y Pull Requests

## Objetivo

Evidenciar trabajo colaborativo sin poner en riesgo la rama `main`.

## Reglas obligatorias

- Nadie desarrolla directamente en `main`.
- Cada integrante trabaja en su propia rama.
- Cada integrante realiza commits propios.
- Todo cambio entra mediante Pull Request.
- Otro integrante debe revisar y aprobar.
- `main` debe quedar funcional al terminar cada Sprint.

## Inicio del repositorio

GitHub puede crear la rama `main` con un README inicial.

Sebastián crea la primera rama:

```bash
git checkout main
git pull origin main
git checkout -b sprint-1/sebastian-foundation
```

Después crea la estructura mínima y abre un PR temprano.

Joshua revisa y aprueba ese PR.

Cuando el PR se integra:

```bash
git checkout main
git pull origin main
```

Todos crean sus ramas desde ese punto.

## Ramas propuestas

### Sprint 1

```text
sprint-1/sebastian-auth-foundation
sprint-1/joshua-inventory-core
sprint-1/leonel-frontend-core
sprint-1/oxcal-products-ui
sprint-1/cristian-dashboard-ui
```

### Sprint 2

```text
sprint-2/sebastian-reports
sprint-2/joshua-inventory-movements
sprint-2/leonel-frontend-integration
sprint-2/oxcal-products-integration
sprint-2/cristian-movements-reports
```

### Sprint 3

```text
sprint-3/sebastian-qa-docs
sprint-3/joshua-backend-validation
sprint-3/leonel-visual-polish
sprint-3/oxcal-product-validation
sprint-3/cristian-dashboard-polish
```

Cada rama nueva debe crearse desde el `main` actualizado.

## Flujo al comenzar cada Sprint

```bash
git checkout main
git pull origin main
git checkout -b sprint-N/nombre-alcance
```

## Commits

Formato recomendado:

```text
tipo(área): descripción corta
```

Ejemplos:

```text
chore(repo): initialize monorepo structure
feat(auth): implement user registration
feat(inventory): add product creation endpoint
feat(inventory): register stock output
feat(reports): add low stock report
feat(frontend): add protected application layout
fix(frontend): handle expired session
docs(readme): add execution instructions
```

Evitar commits como:

```text
cambios
avance
fix
final
prueba
```

## Frecuencia de commits

Cada integrante debe realizar al menos:

- Un commit durante Sprint 1.
- Uno o más commits durante Sprint 2.
- Un commit de mejora o corrección durante Sprint 3.

Los commits deben contener cambios comprensibles y relacionados.

## Pull Requests

Título:

```text
[Sprint N] Área - incremento
```

Ejemplo:

```text
[Sprint 2] Inventory - product movements and stock updates
```

Descripción:

```markdown
## Cambios
- Implementa entradas.
- Implementa salidas.
- Actualiza stock.
- Agrega validaciones.

## Cómo probar
1. Iniciar sesión.
2. Crear producto.
3. Registrar entrada.
4. Registrar salida.

## Checklist
- [x] Compila.
- [x] Probado manualmente.
- [x] No modifica archivos ajenos sin coordinación.
```

## Distribución de revisiones

| Autor | Revisor principal |
|---|---|
| Sebastián | Joshua |
| Joshua | Sebastián |
| Leonel | Oxcal |
| Oxcal | Leonel |
| Cristian | Leonel |

Cristian también puede revisar cambios pequeños de frontend de Oxcal para evidenciar colaboración.

## Ventanas de integración

### Minuto 65

Congelar nuevas funcionalidades.

### Minuto 65–75

- Probar localmente.
- Revisar `git status`.
- Crear commit.
- Hacer push.

### Minuto 75–87

- Abrir PR.
- Revisar archivos.
- Aprobar.
- Resolver conflictos.
- Integrar.

### Minuto 87–90

- Todos actualizan `main`.
- Sebastián ejecuta smoke test.
- Se confirma incremento funcional.

## Cómo actualizar una rama antes del PR

```bash
git checkout main
git pull origin main
git checkout sprint-N/nombre-alcance
git merge main
```

Resolver conflictos en la rama personal, nunca en `main`.

Después:

```bash
git add .
git commit -m "chore(git): resolve integration conflicts"
git push origin sprint-N/nombre-alcance
```

## Archivos con alto riesgo de conflicto

Solo el responsable indicado debe modificarlos sin coordinación:

| Archivo o área | Responsable |
|---|---|
| `docker-compose.yml` | Sebastián |
| README raíz | Sebastián |
| Variables `.env.example` | Sebastián |
| Rutas principales frontend | Leonel |
| Estilos globales | Leonel |
| Modelos Inventory | Joshua |
| Auth | Sebastián |
| Reports backend | Sebastián |
| Productos frontend | Oxcal |
| Movimientos/reportes frontend | Cristian |

## Manejo de conflictos

1. Identificar al dueño del archivo.
2. Revisar ambos cambios juntos.
3. Conservar el contrato API acordado.
4. Ejecutar la aplicación.
5. Hacer commit de resolución.
6. Volver a solicitar revisión.

No aceptar automáticamente `ours` o `theirs` sin leer.

## Evidencia final en GitHub

Antes de entregar, verificar:

- Cinco autores con commits.
- Ramas visibles.
- PRs de los tres Sprints.
- Comentarios o aprobaciones.
- `main` sin cambios pendientes.
- README actualizado.
- Último workflow manual probado.
