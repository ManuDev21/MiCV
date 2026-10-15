# Manuel Rodríguez Calderón — MiCV NEXUS Experience (`NEXUS: Electric Soul`)

Portafolio Full-Stack inmersivo con dirección artística **NEXUS: Electric Soul**, protagonizado por un **Dragón Eléctrico 3D interactivo** (React Three Fiber + Three.js), un **Gafete Profesional Holográfico Arrastrable** (`InteractiveIDCard.tsx`) con cara frontal y reverso técnico, y un sistema visual reutilizable de **Glassmorphism + Neumorfismo Oscuro**.

## Características Principales

1. **Dragón Eléctrico 3D Reactivo (`src/components/3d/ElectricDragon.tsx`)**:
   - Criatura digital tridimensional con cabeza esculpida, cuernos de plasma, mandíbula articulada, ojos emisivos, núcleo energético torácico, alas articuladas con membrana holográfica de doble capa y columna/cola serpentina de 26 vértebras.
   - Seguimiento jerárquico del cursor en tiempo real mediante amortiguación física (`THREE.MathUtils.damp`), arcos eléctricos procedimentales, ondas de choque al interactuar y adaptación espacial al desplazamiento del scroll.
   - Incluye fallback automático (`DragonFallback.tsx`) cuando WebGL no está disponible y soporte preparado mediante la prop `modelUrl` por si en el futuro se desea sustituir o combinar con un modelo externo `.glb`.
2. **Gafete Profesional Holográfico Arrastrable (`src/components/3d/InteractiveIDCard.tsx`)**:
   - Identificación interactiva con datos reales de `src/data/profile.ts` y fotografía personal (`/Yo.jpeg`).
   - Arrastre real con límites elásticos, retorno amortiguado con resortes (`useSpring`), rotación tridimensional en ejes X/Y/Z, reflejo especular dinámico y giro entre anverso (identidad) y reverso (stack, métricas y acceso directo a GitHub).
3. **Sistema Visual Glassmorphism & Neumorfismo Oscuro (`src/components/ui/`)**:
   - Componentes reutilizables: `GlassPanel`, `HolographicCard`, `MagneticButton`, `NeonButton` y `EnergyDivider`.
4. **Rendimiento y Accesibilidad**:
   - Pausa automática del bucle de renderizado WebGL cuando la pestaña no está visible.
   - Adaptación de densidad de partículas y `devicePixelRatio` en dispositivos móviles.
   - Soporte completo para `prefers-reduced-motion` y navegación por teclado.

## Stack Tecnológico

- React 18 + TypeScript + Vite
- Tailwind CSS
- Three.js + React Three Fiber (`@react-three/fiber`) + Drei (`@react-three/drei`)
- Framer Motion + GSAP (`ScrollTrigger`) + Lenis (smooth scroll sincronizado)
- React Icons + SweetAlert2

## Scripts

```bash
npm install
npm run dev      # Servidor de desarrollo en http://localhost:5173
npm run build    # Verificación TypeScript (tsc -b) + compilación de producción Vite
npm run preview  # Vista previa del build de producción
```
