import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { SiVercel, SiNetlify } from 'react-icons/si';
import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-white/55 text-center md:text-left">
          © {new Date().getFullYear()} <span className="text-gradient font-display">Manuel Rodríguez Calderón</span>. Construido con React, Three.js & Framer Motion.
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-white/55">
            <span className="uppercase tracking-[0.25em]">Deploy ready</span>
            <span className="chip !py-0.5"><SiVercel /> Vercel</span>
            <span className="chip !py-0.5"><SiNetlify className="text-neon-cyan" /> Netlify</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-neon-cyan transition"><FiGithub /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-neon-purple transition"><FiLinkedin /></a>
            <a href={`mailto:${profile.email}`} className="hover:text-neon-pink transition"><FiMail /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
