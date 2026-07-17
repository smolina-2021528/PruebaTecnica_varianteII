Documentación del Frontend - Sistema de Gestión de Inventario

Este documento define la arquitectura, el flujo funcional y las reglas de diseño (UI/UX) establecidas para el Frontend del proyecto "InventarioPro". Todos los desarrolladores deben adherirse a estas guías para mantener un código limpio y una experiencia de usuario consistente.

1. Reglas de Diseño y UI/UX (Estilo Moderno y Limpio)

Para evitar una interfaz sobrecargada, confusa o poco profesional, el diseño se basa en un enfoque minimalista, utilizando espacios en blanco, bordes redondeados y una transición nativa entre Modo Claro y Modo Oscuro.

Iconografía (Estricta):

PROHIBIDO el uso de Emojis para representar acciones, menús o estados.

Obligatorio: Utilizar exclusivamente la librería lucide-react. Estos íconos garantizan un aspecto profesional, vectorial y uniforme.

Paleta de Colores y Modo Oscuro (Dark Mode):

El sistema soporta un modo oscuro nativo usando la variante dark: de Tailwind CSS. Todas las nuevas vistas deben ser compatibles con ambos temas.

Fondo general: bg-slate-50 en claro, dark:bg-slate-900 en oscuro.

Contenedores (Cards): bg-white en claro, dark:bg-slate-800 en oscuro, con bordes sutiles (border-slate-100 dark:border-slate-700) y sombras suaves.

Color Primario: Índigo (indigo-600 para botones principales).

Semántica de colores (Pills y Alertas):

Verde (emerald) = Éxito, Ingresos, Stock Saludable.

Rojo (red) = Peligro, Retiros, Sin Stock.

Ámbar/Naranja (amber) = Alertas, Bajo Stock.

Nota: En modo oscuro, los fondos de estas alertas usan transparencias (ej. dark:bg-emerald-900/30) para no ser demasiado brillantes.

Tipografía y Formas:

Uso exclusivo de fuentes sin serifas (sans-serif).

Bordes muy redondeados para suavizar la interfaz (rounded-xl, rounded-2xl).

Animaciones:

Transiciones suaves en botones, modales y cambios de tema (transition-all duration-300, animate-in fade-in). No abusar de animaciones complejas.

2. Flujo Funcional de la Aplicación

La aplicación está dividida en estados lógicos que controlan lo que el usuario ve y puede hacer.

Fase 1: Autenticación

Punto de Entrada: El usuario ingresa a la app y es recibido por el componente LoginView. Se incluye un control para alternar entre Modo Claro y Oscuro.

Acción: Al enviar el formulario, el sistema debe contactar al Servicio de Autenticación.

Transición: Si las credenciales son válidas, el backend devuelve un JWT. El Frontend guarda la sesión (isAuthenticated = true) y redirige al panel principal.

Fase 2: Navegación Principal (Dashboard)

Una vez autenticado, el usuario accede al layout principal:

Sidebar / Menú Hamburguesa: Controla el estado currentView. Incluye opciones de navegación, perfil de usuario y el interruptor para alternar el Tema Oscuro/Claro.

Logout: Destruye la sesión y devuelve al usuario al Login.

Fase 3: Vistas y Módulos

Panel de Control: Solo lectura de KPIs y Alertas urgentes.

Gestión de Productos: CRUD completo. Incluye un buscador y un Modal de Stock Rápido accesible desde la tabla mediante un ícono de flechas, permitiendo ajustes instantáneos.

Entradas / Salidas: Formulario especializado con validaciones (ej. no retirar más del stock actual).

Reportes y Gráficos: Visualización interactiva con recharts. Los gráficos se adaptan automáticamente a la paleta de colores del Modo Oscuro.

3. Guía de Integración con Microservicios (Backend)

Gestión del JWT: Todo token recibido del Servicio de Autenticación debe almacenarse.

Cabeceras HTTP: Toda petición hacia el Servicio A o Servicio B debe incluir: Authorization: Bearer <TU_JWT_AQUI>.

Manejo de Promesas: Reemplaza las funciones locales (como handleAddProduct) con llamadas asíncronas (axios o fetch).

Protección de Rutas: Errores 401 Unauthorized deben forzar el cierre de sesión automático.