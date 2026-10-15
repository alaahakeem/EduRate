import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle, Users, BookOpen, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TopTeachers() {
  const navigate = useNavigate();
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

  const teachers = [
    { 
      id: 1, 
      name: isRtl ? "أ. أحمد محمود" : "Mr. Ahmed Mahmoud", 
      subject: isRtl ? "فيزياء" : "Physics", 
      rating: "4.9", 
      reviews: 120, 
      students: "1.2k", 
      price: isRtl ? "150 ج" : "150 EGP", 
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&q=80",
      coverImage: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80",
      bio: isRtl 
        ? "معلم أول معتمد لمادة الفيزياء للثانوية العامة بخبرة تزيد عن 12 عاماً، يتميز بتبسيط القوانين وحل مئات الأسئلة التفاعلية."
        : "Senior certified Physics teacher for secondary school with over 12 years of experience, specializing in intuitive concept mastery and problem-solving."
    },
    { 
      id: 2, 
      name: isRtl ? "د. سارة خالد" : "Dr. Sara Khaled", 
      subject: isRtl ? "أحياء" : "Biology", 
      rating: "4.8", 
      reviews: 95, 
      students: "850+", 
      price: isRtl ? "200 ج" : "200 EGP", 
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      coverImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=600&q=80",
      bio: isRtl
        ? "دكتوراه في العلوم الحيوية، تقدم شرحاً تفاعلياً مدعوماً بالرسوم ثلاثية الأبعاد ونماذج بنك المعرفة."
        : "PhD in Biological Sciences, delivering interactive lectures supported by 3D visuals and official knowledge bank models."
    },
    { 
      id: 3, 
      name: isRtl ? "أ. محمد علي" : "Mr. Mohamed Ali", 
      subject: isRtl ? "رياضيات" : "Mathematics", 
      rating: "5.0", 
      reviews: 200, 
      students: "2k+", 
      price: isRtl ? "100 ج" : "100 EGP", 
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
      bio: isRtl
        ? "خبير التفاضل والتكامل والجبر، حاصل على درع التميز التعليمي، صاحب أسلوب فريد في التعامل مع المسائل الصعبة."
        : "Calculus and Algebra specialist with prestigious teaching honors, known for making difficult equations straightforward."
    },
    { 
      id: 4, 
      name: isRtl ? "م. ياسمين طارق" : "Eng. Yasmine Tarek", 
      subject: isRtl ? "كيمياء" : "Chemistry", 
      rating: "4.7", 
      reviews: 85, 
      students: "600+", 
      price: isRtl ? "120 ج" : "120 EGP", 
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
      bio: isRtl
        ? "مهندسة كيميائية متخصصة في تدريس الكيمياء العضوية وغير العضوية بطرق ابتكارية تضمن الفهم الكامل."
        : "Chemical engineer specializing in organic and inorganic chemistry with innovative pedagogical methods."
    },
  ];

  return (
    <section id="teachers" className="py-20 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            {isRtl ? 'نخبة من ' : 'Elite of '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {isRtl ? 'أفضل المدرسين' : 'Top Teachers'}
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            {isRtl ? 'تعلم على يد خبراء متخصصين وحقق أعلى الدرجات' : 'Learn from specialized experts and achieve the highest scores'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map(teacher => (
            <div key={teacher.id} className="bg-white rounded-3xl shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 group flex flex-col justify-between">
              <div>
                {/* Cover Image Background */}
                <div className="h-32 relative overflow-visible">
                  <img src={teacher.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-indigo-900/30"></div>
                  
                  <img 
                    src={teacher.image} 
                    alt={teacher.name} 
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover group-hover:scale-105 transition-transform z-10"
                  />
                </div>
                
                <div className="pt-16 pb-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  
                  <span className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
                    {teacher.subject}
                  </span>

                  <div className="flex justify-center items-center gap-1.5 mb-4 bg-gray-50 py-2 rounded-xl">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-800">{teacher.rating}</span>
                    <span className="text-gray-400 text-sm">
                      ({teacher.reviews} {isRtl ? 'تقييم' : 'reviews'})
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4 px-2">
                    <div className="flex flex-col items-center">
                      <Users className="w-4 h-4 mb-1 text-indigo-500" />
                      <span>{teacher.students} {isRtl ? 'طالب' : 'students'}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <BookOpen className="w-4 h-4 mb-1 text-indigo-500" />
                      <span>{teacher.price}{isRtl ? '/ساعة' : '/hr'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md cursor-pointer text-sm"
                >
                  {isRtl ? 'عرض الملف' : 'View Profile'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    
      {/* Teacher Profile Preview Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-7 shadow-2xl border border-slate-100 relative space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedTeacher.image} 
                  alt={selectedTeacher.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-black text-slate-900">{selectedTeacher.name}</h3>
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg inline-block mt-1">
                    {isRtl ? `مادة ${selectedTeacher.subject}` : `${selectedTeacher.subject} Subject`}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTeacher(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">{isRtl ? 'التقييم' : 'Rating'}</span>
                <span className="font-black text-slate-800 text-sm flex items-center justify-center gap-1">
                  ⭐ {selectedTeacher.rating}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-1">{isRtl ? 'الطلاب' : 'Students'}</span>
                <span className="font-black text-slate-800 text-sm">{selectedTeacher.students}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-1">{isRtl ? 'سعر الحصة' : 'Rate'}</span>
                <span className="font-black text-emerald-600 text-sm">{selectedTeacher.price}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/60 leading-relaxed">
              <span className="font-bold text-indigo-900 block mb-1">
                {isRtl ? 'نبذة عن المعلم:' : 'About the Teacher:'}
              </span>
              <p>{selectedTeacher.bio}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedTeacher(null)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
              <button 
                onClick={() => {
                  setSelectedTeacher(null);
                  navigate('/login');
                }}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isRtl ? 'احجز حصة الآن' : 'Book Class Now'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
