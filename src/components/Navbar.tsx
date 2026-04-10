import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { settings } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const ensureExternalLink = (url?: string) => {
    if (!url || url === '#') return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '홈', path: '/' },
    { name: '전문가 소개', path: '/about' },
    { name: '보상및사례', path: '/cases' },
    { name: '상담신청', path: '/contact' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[var(--point-color)]" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">{settings.name}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[var(--point-color)] ${location.pathname === link.path ? 'text-[var(--point-color)]' : 'text-gray-600'}`}
            >
              {link.name}
            </Link>
          ))}
          <a 
            href={ensureExternalLink(settings.kakaoUrl)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary py-2 px-6 text-sm"
          >
            무료카톡상담하기
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-6 px-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-medium text-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href={ensureExternalLink(settings.kakaoUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary text-center mt-4"
              onClick={() => setIsOpen(false)}
            >
              무료카톡상담하기
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
