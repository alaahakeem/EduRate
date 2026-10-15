import { BookOpen, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { t, dir, toggleLanguage } = useLanguage();

  return (
    <div className="fixed w-full top-0 z-50 p-4 transition-all font-sans">
      <nav className="max-w-7xl mx-auto bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg shadow-indigo-900/10 rounded-2xl px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <BookOpen className={`h-7 w-7 text-indigo-700 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            <span className="text-2xl font-black text-slate-900 tracking-tight">EduRate.</span>
          </div>
          
          {/* Navigation Links - Fixed spacing using 'gap' instead of 'space-x' */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-800 hover:text-indigo-700 font-bold transition-colors">{t('nav_home')}</a>
            <a href="#centers" className="text-slate-800 hover:text-indigo-700 font-bold transition-colors">{t('nav_courses')}</a>
            <a href="#teachers" className="text-slate-800 hover:text-indigo-700 font-bold transition-colors">{t('nav_teachers')}</a>
            <a href="#contact" className="text-slate-800 hover:text-indigo-700 font-bold transition-colors">{t('nav_contact')}</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage} 
              className="flex items-center px-3 py-1.5 bg-white/50 hover:bg-white/80 text-slate-800 rounded-lg text-sm font-bold transition-colors border border-white/50 shadow-sm"
            >
              <Globe className={`w-4 h-4 ${dir === 'rtl' ? 'ml-1.5' : 'mr-1.5'}`} />
              {t('switch_lang')}
            </button>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-slate-900 font-bold hover:text-indigo-700 transition-colors">
                {t('login_btn')}
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5">
                {t('register_btn')}
              </Link>
            </div>
            
          </div>
        </div>
      </nav>
    </div>
  );
}
