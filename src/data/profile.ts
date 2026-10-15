import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiBootstrap,
  SiJquery,
  SiNestjs,
  SiNodedotjs,
  SiGraphql,
  SiFlask,
  SiPython,
  SiPhp,
  SiMysql,
  SiPostgresql,
  SiMariadb,
  SiGit,
  SiGithub,
  SiTypeorm,
  SiFirebase,
  SiStripe,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

export const profile = {
  name: 'Manuel Rodríguez Calderón',
  role: 'Full Stack Developer | Software Engineer',
  roles: [
    'Full Stack Developer',
    'Software Engineer',
    'Frontend & Backend Developer',
    'React • NestJS • GraphQL',
  ],
  location: 'San Nicolas Peralta, Lerma, Estado de México.',
  email: 'manuelrodriguezcalderon10@gmail.com',
  phone: '722 839 64 72',
  github: 'https://github.com/ManuDev21',
  linkedin: 'https://linkedin.com/',
  photo: '/Yo.jpeg',
  cv: '/CV Oficial.pdf',
  about:
    'Estudiante Técnico Superior en Desarrollo de Software Multiplataforma con experiencia en el desarrollo de aplicaciones web y móviles modernas utilizando tecnologías frontend y backend. Apasionado por construir interfaces elegantes, sistemas escalables y experiencias de usuario fluidas con un enfoque en performance, arquitectura limpia y diseño moderno.',
  stats: [
    { label: 'Proyectos', value: 15 },
    { label: 'Tecnologías', value: 20 },
    { label: 'Años de práctica', value: 3 },
    { label: 'Certificaciones', value: 3 },
  ],
};

export type Skill = { name: string; level: number; icon: IconType };

export const skills: Record<string, Skill[]> = {
  Frontend: [
    { name: 'React', level: 92, icon: SiReact },
    { name: 'React Native', level: 90, icon: SiReact },
    { name: 'TypeScript', level: 88, icon: SiTypescript },
    { name: 'JavaScript', level: 92, icon: SiJavascript },
    { name: 'HTML5', level: 95, icon: SiHtml5 },
    { name: 'CSS3', level: 92, icon: SiCss },
    { name: 'TailwindCSS', level: 90, icon: SiTailwindcss },
    { name: 'Bootstrap', level: 95, icon: SiBootstrap },
    { name: 'jQuery', level: 90, icon: SiJquery },
  ],
  Backend: [
    { name: 'NestJS', level: 95, icon: SiNestjs },
    { name: 'Node.js', level: 92, icon: SiNodedotjs },
    { name: 'GraphQL', level: 92, icon: SiGraphql },
    { name: 'Flask', level: 88, icon: SiFlask },
    { name: 'Python', level: 90, icon: SiPython },
    { name: 'PHP', level: 72, icon: SiPhp },
  ],
  'Bases de datos': [
    { name: 'MySQL', level: 95, icon: SiMysql },
    { name: 'PostgreSQL', level: 82, icon: SiPostgresql },
    { name: 'MariaDB', level: 90, icon: SiMariadb },
  ],
  Herramientas: [
    { name: 'Git', level: 90, icon: SiGit },
    { name: 'GitHub', level: 90, icon: SiGithub },
    { name: 'TypeORM', level: 84, icon: SiTypeorm },
    { name: 'Firebase', level: 78, icon: SiFirebase },
    { name: 'APIREST', level: 75, icon: SiStripe },
  ],
};

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  summary: string;
  tags: string[];
  details: string[];
  repoUrl?: string;
}

export const experience: ExperienceItem[] = [
  {
    title: 'ÍXA · PWA de Recomendación Turística con IA — Pueblos Mágicos',
    company: 'Proyecto Full Stack + Machine Learning • Pueblos Mágicos (Isla Mujeres)',
    period: '2025 — 2026',
    repoUrl: 'https://github.com/ManuDev21/PWA-Proyecto-Pueblos-Magicos',
    summary:
      'Progressive Web App (PWA) impulsada por Inteligencia Artificial que identifica el perfil turístico del visitante y recomienda experiencias personalizadas (cultural, gastronómico, ecológico, comunitario, bienestar y fotográfico) promoviendo el turismo alternativo y sostenible en los Pueblos Mágicos.',
    tags: [
      'React 19',
      'Vite PWA',
      'FastAPI',
      'Python',
      'Scikit-Learn (IA/ML)',
      'SQLAlchemy',
      'MySQL 8',
      'Three.js',
      'GSAP',
      'Framer Motion',
      'Zustand',
      'React Query',
      'TailwindCSS',
    ],
    details: [
      'Motor de recomendación híbrido de 2 capas con Machine Learning (Random Forest, KNN y Decision Tree con Scikit-Learn, Pandas y NumPy) que clasifica el perfil del viajero y calcula el porcentaje de confianza con justificación explicable.',
      'Arquitectura Backend en Python + FastAPI bajo Clean Architecture (SOLID, Repository Pattern y Service Layer) con SQLAlchemy ORM, Pydantic y base de datos relacional MySQL 8 (5 perfiles, 6 categorías, 10 preguntas y 17 experiencias).',
      'Frontend con Feature-Based Architecture en React 19 + Vite, Splash cinematográfico interactivo con partículas Three.js y GSAP, Chatbot conversacional integrado y Quiz inteligente interactivo.',
      'Generador dinámico de itinerarios (medio día, 1 día, 2 días y fin de semana) con ubicaciones en mapas interactivos (Leaflet / Google Maps) y descarga de folleto personalizado en PDF (jsPDF).',
      'Panel Administrativo con analítica y gráficas (Recharts y Chart.js), gestión CRUD de categorías, experiencias y preguntas, estadísticas de IA y selector de tema institucional persistido globalmente.',
      'PWA instalable en Android e iOS con Web App Manifest, Service Worker, soporte offline-first y Smart Cache mediante vite-plugin-pwa.',
    ],
  },
  {
    title: 'Sistema de Gestión Deportiva',
    company: 'Filial Escuela de Fútbol Cañeros Toluca',
    period: '2024 — Presente',
    repoUrl: 'https://github.com/ManuDev21/esforza-caneros',
    summary:
      'Desarrollo Full Stack de plataforma para administración y control de jugadores con panel administrativo moderno e interfaces responsivas.',
    tags: ['React', 'NestJS', 'GraphQL', 'TypeORM', 'MySQL'],
    details: [
      'Arquitectura Full Stack con React + NestJS + GraphQL.',
      'Modelado de datos con TypeORM sobre MySQL.',
      'Sistema administrativo y control de jugadores.',
      'Interfaces responsivas y modernas; gestión de registros y panel admin.',
    ],
  },
  {
    title: 'Landing Pages Modernas',
    company: 'Proyectos Freelance',
    period: '2023 — 2024',
    summary:
      'Desarrollo de páginas web modernas para Restaurante Gourmet, DJ Profesional y Escuela de Fútbol con animaciones premium.',
    tags: ['React', 'TailwindCSS', 'Framer Motion', 'GSAP'],
    details: [
      'Restaurante Gourmet — branding y experiencia inmersiva.',
      'DJ Profesional — sitio audiovisual con animaciones GSAP.',
      'Escuela de Fútbol — sitio institucional responsivo.',
    ],
  },
  {
    title: 'Sistema E-Commerce',
    company: 'Proyecto Académico / Personal',
    period: '2023',
    repoUrl: 'https://github.com/ManuDev21/ShopTech',
    summary:
      'Plataforma E-Commerce con catálogo, carrito de compras, panel administrativo y gestión de usuarios.',
    tags: ['Python', 'Flask', 'MySQL', 'Bootstrap'],
    details: [
      'Catálogo de productos y carrito persistente.',
      'Panel administrativo y gestión de usuarios.',
      'Diseño responsive moderno.',
    ],
  },
];

export const education = [
  {
    school: 'CECYTEM Plantel Xonacatlán',
    title: 'Carrera Técnica en Programación',
    period: '2021 — 2024',
  },
  {
    school: 'Universidad Tecnológica del Valle de Toluca',
    title: 'TSU en Desarrollo de Software Multiplataforma',
    period: '2024 — Presente',
  },
];

export const certifications = [
  {
    name: 'JavaScript Essentials 1',
    issuer: 'Cisco Networking Academy & OpenEDG JS Institute',
    url: '#',
  },
  {
    name: 'Python Essentials 1',
    issuer: 'Cisco Networking Academy & OpenEDG JS Institute',
    url: '#',
  },
  {
    name: 'Python Essentials 2',
    issuer: 'Cisco Networking Academy & OpenEDG JS Institute',
    url: '#',
  },
];
