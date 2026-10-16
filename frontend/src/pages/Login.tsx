import { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, Globe, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, X, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
  const { t, dir, toggleLanguage } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Forgot Password State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (!email || !password) {
      setError(dir === 'rtl' ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      // API Call to ASP.NET Core Backend
      const response = await api.post('/auth/login', { email, password });
      
      const { token, userType, profileId } = response.data;
      
      // Save data using our AuthContext
      login(token, userType, profileId);

      // Navigate dynamically based on role
      if (userType === 'Student') navigate('/dashboard/student');
      else if (userType === 'Teacher') navigate('/dashboard/teacher');
      else if (userType === 'Admin') navigate('/dashboard/admin');
      else if (userType === 'Center') navigate('/dashboard/center');
      else navigate('/'); 
      
    } catch (err: any) {
      // Display error from backend if available, or fallback to generic error
      setError(
        err.response?.data?.message || 
        (typeof err.response?.data === 'string' ? err.response?.data : null) || 
        (dir === 'rtl' ? 'بيانات الدخول غير صحيحة، تأكد من الإيميل وكلمة المرور' : 'Invalid login credentials, please try again')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans transition-all bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 sm:p-6">
      
      {/* Dynamic Animated Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/25 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/25 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Modern Subtle Geometric Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Floating Decorative Badges (Desktop) */}
      <div className="hidden lg:flex items-center gap-3 absolute top-24 left-16 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3 rounded-2xl shadow-xl text-white">
        <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-indigo-200 font-medium">{dir === 'rtl' ? 'تقييمات موثوقة' : 'Verified Ratings'}</p>
          <p className="text-sm font-bold">4.9 / 5.0 ⭐⭐⭐⭐⭐</p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 absolute bottom-24 right-16 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3 rounded-2xl shadow-xl text-white">
        <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-purple-200 font-medium">{dir === 'rtl' ? 'معتمد ومضمون' : 'Certified Platform'}</p>
          <p className="text-sm font-bold">{dir === 'rtl' ? '+50,000 طالب ومعلم' : '50,000+ Students & Teachers'}</p>
        </div>
      </div>

      {/* Absolute Language Switcher */}
      <div className={`absolute top-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50`}>
        <button 
          onClick={toggleLanguage} 
          className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all shadow-sm border border-white/20 backdrop-blur-md"
        >
          <Globe className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-indigo-400`} />
          {t('switch_lang')}
        </button>
      </div>

      {/* Floating Glass Card */}
      <div className="relative z-10 w-full max-w-md px-2 sm:px-0">
        <div className="bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-8 sm:p-10 rounded-[2.5rem]">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-2 tracking-tight">EduRate.</h1>
            <p className="text-slate-800 font-bold text-lg">{t('login_title')}</p>
            <p className="text-slate-500 text-sm mt-1 font-medium">{t('login_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message Alert */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center border border-red-100 transition-all">
                <AlertCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} shrink-0`} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">{t('email')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-11 py-3.5 bg-white/50 border border-white rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 block">{t('password')}</label>
                <button 
                  type="button"
                  onClick={() => {
                    setForgotEmail(email || '');
                    setForgotSuccess(false);
                    setIsForgotModalOpen(true);
                  }}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {t('forgot_password')}
                </button>
              </div>
              <div className="relative">
                <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-11 py-3.5 bg-white/50 border border-white rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center text-slate-400 hover:text-indigo-600 transition-colors`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember-me" className={`block ${dir === 'rtl' ? 'mr-2' : 'ml-2'} text-sm text-slate-600 font-medium`}>
                {t('remember_me')}
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all mt-4 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {t('login_btn')}
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
              {t('no_account')}{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                {t('create_account')}
              </Link>
            </p>
          </div>

        </div>
      </div>
    
      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-7 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {dir === 'rtl' ? 'استعادة كلمة المرور' : 'Reset Password'}
                </h3>
              </div>
              <button 
                onClick={() => setIsForgotModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {dir === 'rtl' ? 'تم إرسال الرابط بنجاح!' : 'Reset Link Sent!'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {dir === 'rtl' 
                      ? `تم إرسال تعليمات إعادة التعيين إلى ${forgotEmail || 'بريدك الإلكتروني'}. تفقد صندوق الوارد والبريد غير الهام.`
                      : `Instructions have been sent to ${forgotEmail || 'your email'}. Check your inbox and spam folder.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-200"
                >
                  {dir === 'rtl' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!forgotEmail) return;
                  setIsForgotLoading(true);
                  setTimeout(() => {
                    setIsForgotLoading(false);
                    setForgotSuccess(true);
                  }, 1000);
                }}
                className="space-y-4"
              >
                <p className="text-xs text-slate-500 leading-relaxed">
                  {dir === 'rtl' 
                    ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور فوراً.' 
                    : 'Enter your registered email and we will send you a reset link immediately.'}
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {dir === 'rtl' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none`}>
                      <Mail className="h-4 w-4 text-indigo-400" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className={`block w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                        dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'
                      }`}
                      placeholder="name@example.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button 
                    type="submit"
                    disabled={isForgotLoading}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5"
                  >
                    {isForgotLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{dir === 'rtl' ? 'إرسال الرابط' : 'Send Reset Link'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
