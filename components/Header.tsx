
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'عني', href: '#about' },
    { name: 'إنجازاتي', href: '#achievements' },
    { name: 'المهارات', href: '#skills' },
    { name: 'تواصل', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            أ
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            إنجازاتي
          </span>
        </div>

        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-gray-600 hover:text-sky-500 font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <button className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105">
          تحميل الملف PDF
        </button>
      </div>
    </header>
  );
};

export default Header;
