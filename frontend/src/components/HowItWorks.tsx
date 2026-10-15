import { Rocket, ShieldCheck, CreditCard, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const { dir, t } = useLanguage();

  const features = [
    {
      icon: <Rocket className="w-8 h-8 text-pink-500" />,
      title: dir === 'rtl' ? 'ابحث واحجز بسهولة' : 'Search & Book Easily',
      desc: dir === 'rtl' ? 'آلاف الحصص والمواعيد متاحة بضغطة زر وبدون تعقيد.' : 'Thousands of sessions available at your fingertips.',
      bg: 'bg-pink-50',
    },
    {
      icon: <CreditCard className="w-8 h-8 text-indigo-500" />,
      title: dir === 'rtl' ? 'دفع إلكتروني آمن' : 'Secure Online Payment',
      desc: dir === 'rtl' ? 'محفظة إلكترونية ووسائل دفع متعددة تناسب الجميع.' : 'E-wallet and multiple payment methods suitable for everyone.',
      bg: 'bg-indigo-50',
    },
    {
      icon: <LayoutDashboard className="w-8 h-8 text-purple-500" />,
      title: dir === 'rtl' ? 'إدارة شاملة للمعلمين' : 'Comprehensive Teacher Tools',
      desc: dir === 'rtl' ? 'لوحة تحكم متطورة لإدارة الحصص، الطلاب، والمبيعات.' : 'Advanced dashboard to manage classes, students, and sales.',
      bg: 'bg-purple-50',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: dir === 'rtl' ? 'أمان وموثوقية' : 'Safety & Reliability',
      desc: dir === 'rtl' ? 'جميع السناتر والمعلمين موثقين ومعتمدين من الإدارة.' : 'All centers and teachers are verified and approved by administration.',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
            {dir === 'rtl' ? 'لماذا تختار ' : 'Why Choose '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">EduRate</span>
            {dir === 'rtl' ? '؟' : '?'}
          </h2>
          <p className="text-xl text-slate-500">
            {dir === 'rtl' ? 'المنصة المتكاملة الأولى التي تربط بين الطالب، المعلم، والسنتر في مكان واحد.' : 'The first integrated platform connecting students, teachers, and centers in one place.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Call to action card */}
        <div className="mt-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              {dir === 'rtl' ? 'مستعد للانضمام إلى المستقبل؟' : 'Ready to join the future?'}
            </h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
              {dir === 'rtl' ? 'سجل الآن مجاناً وابدأ رحلتك التعليمية معنا في بيئة حديثة ومتطورة.' : 'Sign up now for free and start your educational journey in a modern environment.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/register?type=student" className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                {dir === 'rtl' ? 'طالب جديد' : 'New Student'}
              </a>
              <a href="/register?type=teacher" className="px-8 py-4 bg-indigo-800 text-white border border-indigo-700 rounded-full font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-transform shadow-xl">
                {dir === 'rtl' ? 'تسجيل كمعلم' : 'Register as Teacher'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
