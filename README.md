# Manuel Rodríguez Calderón — CV / Portafolio

Portafolio web premium con diseño futurista (cyberpunk minimalista), fondo 3D, animaciones, glassmorphism y soporte para modo claro/oscuro.

## Stack

- React 18 + TypeScript + Vite
- TailwindCSS
- Framer Motion + GSAP + AOS
- React Three Fiber + Drei + Three.js
- Lenis (smooth scroll)
- React Router DOM
- React Icons
- React Parallax Tilt
- SweetAlert2

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Estructura

```
src/
├── components/      UI compartido (Navbar, Loader, Cursor, etc.)
├── sections/        Secciones del CV (Hero, About, Skills, …)
├── hooks/           useTheme, useLenis
├── data/            Datos del perfil
└── index.css        Estilos base y utilidades
```

## Personalización

- Datos en `src/data/profile.ts`.
- Foto en `public/Yo.jpeg`.
- CV PDF: coloca el archivo en `public/CV-Manuel-Rodriguez.pdf` para que funcione el botón **Descargar CV**.
