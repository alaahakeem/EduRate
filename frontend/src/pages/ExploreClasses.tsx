import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, MapPin, Calendar, Clock, BookOpen, Loader2, CheckCircle, GraduationCap, DollarSign, Tag, X, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function ExploreClasses() {
  const { t, dir } = useLanguage();
  const { userType } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingId, setBookingId] = useState<number | null>(null);
  
  // Modal state for booking & promo code
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Toasts
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/sessions');
        const validSessions = (res.data || []).filter((s: any) => {
          const isFuture = new Date(s.startTime) > new Date();
          return s.status === 'Available' && isFuture;
        });
        setSessions(validSessions);
      } catch (err) {
        console.error("Error fetching sessions", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const openBookingModal = (session: any) => {
    if (userType !== 'Student') {
      setErrorMsg(dir === 'rtl' ? 'يجب تسجيل الدخول كطالب لحجز الحصة' : 'You must login as a student to book.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    setSelectedSession(session);
    setPromoCode('');
    setPromoDiscount(null);
    setPromoMessage(null);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoMessage({
        text: dir === 'rtl' ? 'يرجى كتابة كود الخصم أولاً' : 'Please enter a promo code first',
        type: 'error'
      });
      return;
    }

    setIsValidatingPromo(true);
    setPromoMessage(null);

    try {
      const res = await api.post('/PromoCodes/validate', {
        code: promoCode.trim().toUpperCase(),
        teacherId: selectedSession?.teacherId,
        centerId: selectedSession?.centerId
      });

      const discount = res.data?.discountPercentage || 0;
      setPromoDiscount(discount);
      setPromoMessage({
        text: res.data?.message || (dir === 'rtl' ? `تم تفعيل الخصم بنجاح (${discount}%)` : `Promo applied (${discount}%)`),
        type: 'success'
      });
    } catch (err: any) {
      setPromoDiscount(null);
      const errMsg = err.response?.data?.message || err.response?.data || (dir === 'rtl' ? 'كود الخصم غير صالح أو منتهي الصلاحية' : 'Invalid or expired promo code');
      setPromoMessage({
        text: errMsg,
        type: 'error'
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSession) return;
    
    setBookingId(selectedSession.id);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.post('/bookings', { sessionId: selectedSession.id });
      setSelectedSession(null);
      setSuccessMsg(dir === 'rtl' ? 'تم تأكيد حجز الحصة بنجاح!' : 'Class booked successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/dashboard/student/schedule');
      }, 2000);
    } catch (err: any) {
      console.error("Failed to book", err);
      setErrorMsg(err.response?.data?.message || err.response?.data || (dir === 'rtl' ? 'حدث خطأ أثناء الحجز' : 'Failed to book session'));
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setBookingId(null);
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'استكشاف الحصص' : 'Explore Classes'}</h1>
              <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'ابحث عن أفضل المعلمين والسناتر واحجز حصتك الآن' : 'Find top teachers and centers and book your class now'}</p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-bold flex items-center justify-center animate-in fade-in slide-in-from-top-4 shadow-sm">
            <CheckCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl font-bold flex items-center justify-center animate-in fade-in slide-in-from-top-4 shadow-sm">
            <AlertCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {errorMsg}
          </div>
        )}

        {/* Classes Grid */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col group relative overflow-hidden">
                  
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-transparent opacity-50 rounded-bl-[100px] -z-0"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-100/50">
                        {session.educationalStage || 'المرحلة الدراسية'}
                      </div>
                      <div className="flex items-center text-emerald-600 font-black bg-emerald-50 px-2.5 py-1 rounded-md text-sm border border-emerald-100">
                        <DollarSign className="w-3.5 h-3.5" />
                        {session.price} {t('currency')}
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{session.title}</h3>
                    
                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-center text-sm text-slate-600 font-medium">
                        <GraduationCap className={`w-4 h-4 text-indigo-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                        <span>{session.teacherName || 'مدرس غير محدد'}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 font-medium">
                        <MapPin className={`w-4 h-4 text-rose-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                        <span>{session.centerName || 'سنتر غير محدد'}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 font-medium">
                        <Calendar className={`w-4 h-4 text-emerald-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                        <span>{new Date(session.startTime).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US')}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 font-medium">
                        <Clock className={`w-4 h-4 text-amber-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                        <span dir="ltr">
                          {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                          {' - '} 
                          {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => openBookingModal(session)}
                      className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black hover:bg-indigo-600 transition-all flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
                    >
                      <BookOpen className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                      {dir === 'rtl' ? 'احجز الحصة الآن' : 'Book Class Now'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-700 mb-2">{dir === 'rtl' ? 'لا توجد حصص متاحة حالياً' : 'No available classes right now'}</h3>
                <p className="text-slate-500 max-w-sm">{dir === 'rtl' ? 'يرجى العودة لاحقاً أو التحقق من إعدادات البحث الخاصة بك.' : 'Please check back later or modify your search criteria.'}</p>
              </div>
            )}
          </div>
        )}

        {/* Modern Booking & Promo Code Modal */}
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                    {dir === 'rtl' ? 'تأكيد حجز مقعد' : 'Seat Booking'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{selectedSession.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Session Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400">{dir === 'rtl' ? 'المعلم' : 'Teacher'}:</span>
                  <span className="font-black text-slate-800 text-sm">{selectedSession.teacherName || 'أستاذ المادة'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400">{dir === 'rtl' ? 'السنتر' : 'Center'}:</span>
                  <span className="font-bold text-slate-700">{selectedSession.centerName || 'سنتر تعليمي'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400">{dir === 'rtl' ? 'الموعد' : 'Time'}:</span>
                  <span className="font-bold text-indigo-600" dir="ltr">
                    {new Date(selectedSession.startTime).toLocaleDateString()} ({new Date(selectedSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                </div>
              </div>

              {/* Promo Code Input Section */}
              <div className="space-y-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/70">
                <label className="flex items-center gap-2 text-xs font-black text-indigo-950">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  <span>{dir === 'rtl' ? 'هل لديك كود خصم؟' : 'Have a Promo Code?'}</span>
                </label>
                
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder={dir === 'rtl' ? 'مثال: WELCOME20' : 'e.g. WELCOME20'}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isValidatingPromo}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isValidatingPromo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{dir === 'rtl' ? 'تطبيق' : 'Apply'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Promo Code Feedback Message */}
                {promoMessage && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    promoMessage.type === 'success' 
                      ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-100/70 text-rose-800 border border-rose-200'
                  }`}>
                    {promoMessage.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{promoMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>{dir === 'rtl' ? 'سعر الحصة الأصلي' : 'Original Price'}:</span>
                  <span className={promoDiscount ? 'line-through text-slate-400 font-bold' : 'font-black text-slate-800'}>
                    {selectedSession.price} {t('currency')}
                  </span>
                </div>

                {promoDiscount && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span>{dir === 'rtl' ? `قيمة الخصم (${promoDiscount}%)` : `Discount (${promoDiscount}%)`}:</span>
                    <span>-{(selectedSession.price * (promoDiscount / 100)).toFixed(0)} {t('currency')}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-slate-900 font-black text-sm">
                  <span>{dir === 'rtl' ? 'الإجمالي المطلوب دفعه' : 'Total to Pay'}:</span>
                  <span className="text-indigo-600 text-lg">
                    {promoDiscount 
                      ? (selectedSession.price * (1 - promoDiscount / 100)).toFixed(0) 
                      : selectedSession.price} {t('currency')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={bookingId === selectedSession.id}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {bookingId === selectedSession.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{dir === 'rtl' ? 'تأكيد الحجز والخصم' : 'Confirm & Book'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
