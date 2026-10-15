import { useState } from 'react';
import { Mail, Lock, User, CheckCircle2, Globe, ArrowRight, ArrowLeft, AlertCircle, Loader2, Eye, EyeOff, MapPin, GraduationCap, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CustomSelect from '../components/CustomSelect';
import api from '../utils/api';

export default function Register() {
  const { t, dir, toggleLanguage } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('Student');
  
  // Student specific fields
  const [educationalStage, setEducationalStage] = useState('10'); // Default to High School 1
  const [governorate, setGovernorate] = useState('القاهرة');
  const [region, setRegion] = useState('');

  // Teacher specific fields
  const [subjectId, setSubjectId] = useState('1');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError(dir === 'rtl' ? 'الرجاء إكمال البيانات الأساسية' : 'Please fill all basic fields');
      return;
    }

    if (userType === 'Student' && (!governorate || !region)) {
      setError(dir === 'rtl' ? 'الرجاء إدخال المحافظة والمنطقة' : 'Please provide Governorate and Region');
      return;
    }

    setIsLoading(true);

    try {
      const requestData: any = { 
        name, 
        email, 
        username: name, // Ensure username exactly matches name so the backend can link the profile
        password, 
        userType 
      };

      if (userType === 'Student') {
        requestData.educationalStage = parseInt(educationalStage);
        requestData.governorate = governorate;
        requestData.region = region;
      } else if (userType === 'Teacher') {
        requestData.subjectId = parseInt(subjectId);
      }

      await api.post('/auth/register', requestData);
      
      const loginRes = await api.post('/auth/login', { email, password });
      const { token, userType: returnedRole, profileId } = loginRes.data;
      
      login(token, returnedRole, profileId);

      if (returnedRole === 'Student') navigate('/dashboard/student');
      else if (returnedRole === 'Teacher') navigate('/dashboard/teacher');
      else if (returnedRole === 'Center') navigate('/dashboard/center');
      else navigate('/'); 

    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = dir === 'rtl' ? 'حدث خطأ أثناء إنشاء الحساب' : 'Registration failed, please try again';

      if (errorData) {
        if (errorData.Errors && Array.isArray(errorData.Errors)) {
          errorMessage = errorData.Errors.join(' | ');
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(' | ');
        } else if (errorData.Message || errorData.message) {
          errorMessage = errorData.Message || errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans transition-all bg-slate-50 py-12">
      
      <div className="absolute inset-0 z-0 fixed">
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop" 
          alt="Majestic Library" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>

      <div className={`fixed top-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50`}>
        <button 
          onClick={toggleLanguage} 
          className="flex items-center px-4 py-2 bg-white/70 hover:bg-white text-slate-800 rounded-xl text-sm font-bold transition-all shadow-sm border border-white/50 backdrop-blur-md"
        >
          <Globe className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-emerald-600`} />
          {t('switch_lang')}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl p-8 sm:p-10 rounded-[2rem]">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2 tracking-tight">EduRate.</h1>
            <p className="text-slate-800 font-bold text-lg">{t('register_title')}</p>
            <p className="text-slate-500 text-sm mt-1 font-medium">{t('register_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center border border-red-100 transition-all">
                <AlertCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} shrink-0`} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 block">{t('full_name')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                  <User className="h-5 w-5 text-emerald-500" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-11 py-3 bg-white/50 border border-white rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                  placeholder={dir === 'rtl' ? 'الاسم' : 'Name'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 block">{t('email')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                  <Mail className="h-5 w-5 text-emerald-500" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-11 py-3 bg-white/50 border border-white rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 block">{t('password')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                  <Lock className="h-5 w-5 text-emerald-500" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-11 py-3 bg-white/50 border border-white rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center text-slate-400 hover:text-emerald-600 transition-colors`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 block">{t('role')}</label>
              <div className="grid grid-cols-3 gap-2">
                <label className="relative flex cursor-pointer rounded-xl border border-white bg-white/50 p-3 hover:bg-white transition-all shadow-sm">
                  <input 
                    type="radio" 
                    name="role" 
                    value="Student" 
                    checked={userType === 'Student'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="peer sr-only" 
                  />
                  <span className="text-xs sm:text-sm font-bold text-slate-600 peer-checked:text-emerald-700">{t('student')}</span>
                  <CheckCircle2 className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-3 h-4 w-4 text-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity`} />
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-white bg-white/50 p-3 hover:bg-white transition-all shadow-sm">
                  <input 
                    type="radio" 
                    name="role" 
                    value="Teacher" 
                    checked={userType === 'Teacher'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="peer sr-only" 
                  />
                  <span className="text-xs sm:text-sm font-bold text-slate-600 peer-checked:text-emerald-700">{t('teacher')}</span>
                  <CheckCircle2 className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-3 h-4 w-4 text-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity`} />
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-white bg-white/50 p-3 hover:bg-white transition-all shadow-sm">
                  <input 
                    type="radio" 
                    name="role" 
                    value="Center" 
                    checked={userType === 'Center'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="peer sr-only" 
                  />
                  <span className="text-xs sm:text-sm font-bold text-slate-600 peer-checked:text-emerald-700">{dir === 'rtl' ? 'سنتر' : 'Center'}</span>
                  <CheckCircle2 className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-3 h-4 w-4 text-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity`} />
                </label>
              </div>
            </div>

            {/* Dynamic Fields */}
            {userType === 'Student' && (
              <div className="space-y-4 pt-2 border-t border-white/50">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 block">{dir === 'rtl' ? 'المرحلة الدراسية' : 'Educational Stage'}</label>
                  <CustomSelect
                    dir={dir}
                    value={educationalStage}
                    onChange={setEducationalStage}
                    icon={<GraduationCap className="h-5 w-5" />}
                    options={[
                      { value: '1', label: dir === 'rtl' ? 'الصف الأول الابتدائي' : 'Primary 1' },
                      { value: '2', label: dir === 'rtl' ? 'الصف الثاني الابتدائي' : 'Primary 2' },
                      { value: '3', label: dir === 'rtl' ? 'الصف الثالث الابتدائي' : 'Primary 3' },
                      { value: '7', label: dir === 'rtl' ? 'الصف الأول الإعدادي' : 'Middle 1' },
                      { value: '8', label: dir === 'rtl' ? 'الصف الثاني الإعدادي' : 'Middle 2' },
                      { value: '9', label: dir === 'rtl' ? 'الصف الثالث الإعدادي' : 'Middle 3' },
                      { value: '10', label: dir === 'rtl' ? 'الصف الأول الثانوي' : 'High School 1' },
                      { value: '11', label: dir === 'rtl' ? 'الصف الثاني الثانوي' : 'High School 2' },
                      { value: '12', label: dir === 'rtl' ? 'الصف الثالث الثانوي' : 'High School 3' }
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">{dir === 'rtl' ? 'المحافظة' : 'Governorate'}</label>
                    <CustomSelect
                      dir={dir}
                      value={governorate}
                      onChange={setGovernorate}
                      icon={<MapPin className="h-4 w-4" />}
                      options={[
                        { value: 'القاهرة', label: dir === 'rtl' ? 'القاهرة' : 'Cairo' },
                        { value: 'الجيزة', label: dir === 'rtl' ? 'الجيزة' : 'Giza' },
                        { value: 'الإسكندرية', label: dir === 'rtl' ? 'الإسكندرية' : 'Alexandria' }
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">{dir === 'rtl' ? 'المنطقة' : 'Region'}</label>
                    <input 
                      type="text" 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/50 border border-white rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm text-sm"
                      placeholder={dir === 'rtl' ? 'مثال: مدينة نصر' : 'e.g. Nasr City'}
                    />
                  </div>
                </div>
              </div>
            )}

            {userType === 'Teacher' && (
              <div className="space-y-4 pt-2 border-t border-white/50">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 block">{dir === 'rtl' ? 'المادة الدراسية' : 'Subject'}</label>
                    <CustomSelect
                      dir={dir}
                      value={subjectId}
                      onChange={setSubjectId}
                      icon={<BookOpen className="h-5 w-5" />}
                      options={[
                        { value: '1', label: dir === 'rtl' ? 'الرياضيات' : 'Mathematics' },
                        { value: '2', label: dir === 'rtl' ? 'الفيزياء' : 'Physics' },
                        { value: '3', label: dir === 'rtl' ? 'الكيمياء' : 'Chemistry' },
                        { value: '4', label: dir === 'rtl' ? 'الأحياء' : 'Biology' },
                        { value: '5', label: dir === 'rtl' ? 'اللغة الإنجليزية' : 'English' },
                        { value: '6', label: dir === 'rtl' ? 'اللغة العربية' : 'Arabic' }
                      ]}
                    />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-200 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all mt-6 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {t('register_btn')}
                  {dir === 'rtl' ? (
                    <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {t('have_account')}{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                {t('login_now')}
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
