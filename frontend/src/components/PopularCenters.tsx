import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, X, ArrowLeft, ArrowRight, Building, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PopularCenters() {
  const navigate = useNavigate();
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const [selectedCenter, setSelectedCenter] = useState<any | null>(null);

  const centers = [
    { 
      id: 1, 
      name: isRtl ? "سنتر الأوائل" : "Al-Awa2el Center", 
      location: isRtl ? "الدقي، الجيزة" : "Dokki, Giza", 
      rating: "4.8", 
      programs: isRtl ? ["ثانوية عامة", "لغات", "علمي وأدبي"] : ["General Secondary", "Languages", "Science & Arts"], 
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
      description: isRtl 
        ? "سنتر تعليمي متكامل مجهز بشاشات عرض ذكية، قاعات مكيفة ومجهزة بنظام عزل صوتي متطور، وخدمة تسجيل حضور رقمية."
        : "Integrated educational center featuring smart display screens, air-conditioned acoustic halls, and digital attendance tracking."
    },
    { 
      id: 2, 
      name: isRtl ? "أكاديمية المستقبل" : "Future Academy", 
      location: isRtl ? "مدينة نصر، القاهرة" : "Nasr City, Cairo", 
      rating: "4.9", 
      programs: isRtl ? ["إعدادي", "ثانوي", "كورسات مكثفة"] : ["Preparatory", "Secondary", "Intensive Courses"], 
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
      description: isRtl 
        ? "أكاديمية رائدة في القاهرة تضم أكبر نخبة من المدرسين، مع توفير معامل علمية وقاعات تدريبية فسيحة."
        : "Leading Cairo academy hosting top educators, equipped with modern science labs and spacious lecture halls."
    },
    { 
      id: 3, 
      name: isRtl ? "رواد النجاح" : "Success Pioneers Center", 
      location: isRtl ? "المعادي، القاهرة" : "Maadi, Cairo", 
      rating: "4.7", 
      programs: isRtl ? ["لغات", "IGCSE", "الدبلومة الأمريكية"] : ["Languages", "IGCSE", "American Diploma"], 
      image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80",
      description: isRtl 
        ? "بيئة أكاديمية ممتازة مخصصة للشهادات الدولية والثانوية العامة، مع متابعة دورية وتقارير أداء للطلاب وأولياء الأمور."
        : "Prestigious academic environment for international curricula and secondary education with regular performance reports."
    },
  ];

  return (
    <section id="centers" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {isRtl ? 'سناتر ' : 'Certified '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {isRtl ? 'تعليمية معتمدة' : 'Educational Centers'}
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              {isRtl ? 'أماكن مجهزة بأحدث الوسائل لضمان بيئة دراسية مثالية' : 'Fully equipped spaces ensuring the ideal study environment'}
            </p>
          </div>
          <button 
            onClick={() => navigate("/login")} 
            className="hidden md:flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <span>{isRtl ? 'عرض الكل' : 'View All'}</span>
            {isRtl ? '←' : '→'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {centers.map(center => (
            <div key={center.id} className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 border border-gray-100 group flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <img 
                    src={center.image} 
                    alt={center.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-sm`}>
                    <span className="text-yellow-500 mr-1 ml-1">⭐</span> {center.rating}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{center.name}</h3>
                  <p className="text-gray-500 mb-4 flex items-center text-sm">
                    <MapPin className={`w-4 h-4 text-rose-500 ${isRtl ? 'ml-1.5' : 'mr-1.5'}`} />
                    <span>{center.location}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {center.programs.map((prog, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button 
                  onClick={() => setSelectedCenter(center)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Building className="w-4 h-4" />
                  <span>{isRtl ? 'تصفح المواعيد والخدمات' : 'Browse Schedule & Details'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Details Preview Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-7 shadow-2xl border border-slate-100 relative space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img 
                src={selectedCenter.image} 
                alt={selectedCenter.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <button 
                onClick={() => setSelectedCenter(null)}
                className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors cursor-pointer`}
              >
                <X className="w-5 h-5" />
              </button>
              <div className={`absolute bottom-3 ${isRtl ? 'right-4' : 'left-4'} text-white`}>
                <h3 className="text-2xl font-black">{selectedCenter.name}</h3>
                <p className="text-xs text-slate-200 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{selectedCenter.location}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-600">{isRtl ? 'التقييم العام:' : 'Overall Rating:'}</span>
                <span className="font-black text-amber-600">⭐ {selectedCenter.rating} / 5.0 {isRtl ? '(ممتاز)' : '(Excellent)'}</span>
              </div>

              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100/60 space-y-2">
                <span className="font-bold text-indigo-900 block">{isRtl ? 'المراحل والبرامج المتاحة:' : 'Available Programs:'}</span>
                <div className="flex flex-wrap gap-2">
                  {selectedCenter.programs.map((p: string, i: number) => (
                    <span key={i} className="bg-white px-2.5 py-1 rounded-md text-indigo-700 font-bold border border-indigo-100 shadow-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span>{p}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block">{isRtl ? 'عن السنتر والتجهيزات:' : 'About the Center:'}</span>
                <p className="text-slate-500 leading-relaxed">{selectedCenter.description}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedCenter(null)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
              <button 
                onClick={() => {
                  setSelectedCenter(null);
                  navigate('/login');
                }}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isRtl ? 'عرض جدول السنتر' : 'View Schedule'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
