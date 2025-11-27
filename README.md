# CineMatch 🎬

CineMatch es una aplicación web moderna para descubrir películas, diseñada para ayudar a los usuarios indecisos a encontrar qué ver basándose en su estado de ánimo, tendencias o búsquedas específicas.

## ✨ Características Principales

*   **🔍 Exploración Inteligente:**
    *   **Tendencias:** Descubre las películas más populares del momento.
    *   **Filtro por Estado de Ánimo:** Encuentra películas para "Reír", "Llorar", "Adrenalina" o "Pasar Miedo".
    *   **Búsqueda Avanzada:** Busca por título y filtra por año de lanzamiento.
*   **♾️ Infinite Scroll Híbrido:** Navegación fluida con carga automática de las primeras páginas y un botón de "Cargar más" para facilitar el acceso al pie de página.
*   **🎲 Modo Aleatorio:** ¿No te decides? El botón flotante te sugiere una película al azar.
*   **❤️ Favoritos:** Guarda las películas que quieres ver más tarde (Watchlist).
*   **🎞️ Detalles Completos (Modal):**
    *   Sinopsis, calificación y fecha de estreno.
    *   **Tráiler:** Reproducción integrada de tráilers de YouTube.
    *   **Streaming:** Consulta dónde ver la película (Netflix, Prime, etc.) en tu región.
    *   **Reparto:** Carrusel con los actores principales.
    *   **Similares:** Recomendaciones de películas parecidas con navegación integrada.
*   **🎨 UI/UX Premium:** Diseño responsivo, animaciones suaves, transiciones elegantes y modo oscuro.

## 🛠️ Tecnologías

*   **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Iconos:** [Phosphor Icons](https://phosphoricons.com/)
*   **API:** [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)
*   **Cliente HTTP:** Axios

## 🚀 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TheYruey/CineMatch.git
    cd cinematch
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tu API Key de TMDB:
    ```env
    VITE_TMDB_API_KEY=tu_api_key_aqui
    ```

4.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

```
src/
├── components/     # Componentes de UI (MovieCard, MovieModal, Header, etc.)
├── hooks/          # Custom Hooks (useFavorites, useDebounce, useIntersectionObserver)
├── services/       # Servicios de API (configuración de Axios y endpoints)
├── types/          # Definiciones de interfaces TypeScript
└── App.tsx         # Lógica principal de la aplicación
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerir cambios o mejoras.

---
Desarrollado con ❤️ para los amantes del cine.
