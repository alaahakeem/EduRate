import { Search, Sparkles, Users, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSection() {
  const { t, dir } = useLanguage();

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Decorative Blur Circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg leading-tight">
          {t('hero_title_1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">{t('hero_title_2')}</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl md:text-2xl text-indigo-100 mb-10 leading-relaxed">
          {t('hero_desc')}
        </p>

        {/* Large Search Box */}
        <div className="mt-8 max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full flex shadow-2xl border border-white/20">
          <input 
            type="text" 
            className="flex-1 bg-transparent text-white placeholder-indigo-200 px-6 py-4 focus:outline-none text-lg"
            placeholder={dir === 'rtl' ? "عن ماذا تبحث؟ (فيزياء، سنتر الأوائل، أ. أحمد...)" : "What are you looking for? (Physics, Al-Awa2el Center, Mr. Ahmed...)"}
            dir={dir}
          />
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center transition-all transform hover:scale-105 shadow-lg">
            <Search className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-5 w-5`} />
            {t('start_now')}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col items-center transform transition hover:-translate-y-2">
            <Users className="h-10 w-10 text-pink-400 mb-3" />
            <span className="text-4xl font-bold text-white">+5,000</span>
            <span className="text-indigo-200 mt-1">{dir === 'rtl' ? 'طالب مسجل' : 'Registered Students'}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col items-center transform transition hover:-translate-y-2">
            <Sparkles className="h-10 w-10 text-yellow-400 mb-3" />
            <span className="text-4xl font-bold text-white">+300</span>
            <span className="text-indigo-200 mt-1">{dir === 'rtl' ? 'سنتر معتمد' : 'Verified Centers'}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col items-center transform transition hover:-translate-y-2">
            <Star className="h-10 w-10 text-purple-400 mb-3" />
            <span className="text-4xl font-bold text-white">4.8/5</span>
            <span className="text-indigo-200 mt-1">{dir === 'rtl' ? 'متوسط التقييمات' : 'Average Rating'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
