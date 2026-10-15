import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';

  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 inline-block">
              EduRate.
            </span>
            <p className="text-gray-400 leading-relaxed max-w-sm text-sm">
              {isRtl 
                ? 'منصتك الأولى للتعليم التفاعلي. نوصلك بأفضل المدرسين والسناتر التعليمية المعتمدة لتحقيق التفوق الدراسي بأسهل الطرق.' 
                : 'Your premier interactive learning platform. Connecting you with top certified teachers and educational centers for effortless academic excellence.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 border-b border-gray-800 pb-2 text-indigo-400 uppercase tracking-wider">
              {isRtl ? 'روابط هامة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  {isRtl ? 'الرئيسية' : 'Home'}
                </a>
              </li>
              <li>
                <a href="#teachers" className="text-gray-400 hover:text-white transition">
                  {isRtl ? 'تصفح المدرسين' : 'Top Teachers'}
                </a>
              </li>
              <li>
                <a href="#centers" className="text-gray-400 hover:text-white transition">
                  {isRtl ? 'السناتر المعتمدة' : 'Accredited Centers'}
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-400 hover:text-white transition">
                  {isRtl ? 'تسجيل الدخول' : 'Sign In'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 border-b border-gray-800 pb-2 text-indigo-400 uppercase tracking-wider">
              {isRtl ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-2.5 text-gray-400 text-sm">
              <li>📧 support@edurate.com</li>
              <li dir="ltr" className={isRtl ? 'text-right' : 'text-left'}>📞 +20 123 456 7890</li>
              <li>{isRtl ? '📍 القاهرة، مصر' : '📍 Cairo, Egypt'}</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
          <p>
            {isRtl 
              ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} - منصة EduRate التعليمية` 
              : `All Rights Reserved © ${new Date().getFullYear()} - EduRate Educational Platform`}
          </p>
        </div>
      </div>
    </footer>
  );
}
