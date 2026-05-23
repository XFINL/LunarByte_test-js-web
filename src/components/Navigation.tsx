import { useState, useEffect } from 'react';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-white font-bold text-2xl tracking-wider">
          LUNARBYTE
        </div>
        <div className="flex gap-8">
          {['首页', '服务', '关于'].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index === 0 ? 'hero' : index === 1 ? 'services' : 'about')}
              className="text-white/80 hover:text-white transition-colors duration-300 font-medium"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
