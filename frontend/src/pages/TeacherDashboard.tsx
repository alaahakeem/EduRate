import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen, Star, Users, DollarSign, Calendar, PlayCircle, ArrowUpRight, User as UserIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Simple JWT decoder helper
const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function TeacherDashboard() {
  const { t, dir } = useLanguage();
  const { token } = useAuth();
  
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const payload = parseJwt(token);
    if (payload) {
      const msClaimName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
      setUserName(payload[msClaimName] || payload.unique_name || payload.name || '');
    }
  }, [token]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/teachers/my-stats'),
          api.get('/teachers/my-bookings')
        ]);
        setStats(statsRes.data);
        setBookings(bookingsRes.data || []);
      } catch (error) {
        console.error("Failed to load teacher dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        
        {/* Hero Section for Teacher */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-slate-900/10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold mb-4">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 animate-pulse ${dir === 'rtl' ? 'mr-2 ml-2' : 'ml-2 mr-2'}`}></span>
                {t('available_to_teach')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {dir === 'rtl' ? `أهلاً بك، أ. ${userName || 'معلم'}` : `Welcome back, Mr/Ms. ${userName || 'Teacher'}`}
              </h2>
              <p className="text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">
                {bookings.length === 0 
                  ? (dir === 'rtl' ? 'حسابك جديد ومستعد للبدء! يمكنك الآن جدولة حصصك واستقبال الطلاب.' : 'Your account is new and ready! Start scheduling classes to welcome students.')
                  : t('teacher_desc')
                }
              </p>
            </div>
            <button className="shrink-0 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center text-sm shadow-sm group">
              <PlayCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-violet-600 group-hover:scale-110 transition-transform`} />
              {t('start_next_class')}
            </button>
          </div>
        </div>

        {/* Grid Layout for Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{t('total_students')}</p>
              <h3 className="text-3xl font-black text-slate-800">{stats?.totalBookings || 0}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{t('monthly_revenue')}</p>
              <h3 className="text-3xl font-black text-slate-800">0<span className={`text-sm text-slate-400 font-medium ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`}>{t('currency')}</span></h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{t('active_courses')}</p>
              <h3 className="text-3xl font-black text-slate-800">{stats?.totalCourses || 0}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{t('general_rating')}</p>
              <h3 className="text-3xl font-black text-slate-800">{stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}<span className={`text-sm text-slate-400 font-medium ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`}>/ 5.0</span></h3>
            </div>
          </div>
        </div>

        {/* Bottom Section - Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">{t('todays_schedule')}</h3>
              <button className="text-sm font-semibold text-violet-600 hover:text-violet-700">{t('full_schedule')}</button>
            </div>
            <div className="space-y-3">
              {bookings.length > 0 ? (
                bookings.map((booking: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center mb-3 sm:mb-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${dir === 'rtl' ? 'ml-3' : 'mr-3'} bg-slate-100 text-slate-500`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">حجز مع: {booking.studentName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(booking.bookingDate).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US')}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">{dir === 'rtl' ? 'ليس لديك حصص مجدولة اليوم.' : 'You have no scheduled classes today.'}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">{t('latest_subscribers')}</h3>
              <button className="text-sm font-semibold text-violet-600 hover:text-violet-700">{t('all_students')}</button>
            </div>
            <div className="space-y-3">
              {bookings.length > 0 ? (
                bookings.slice(0, 5).map((booking: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                    <div className="flex items-center">
                      <div className={`w-9 h-9 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center ${dir === 'rtl' ? 'ml-3' : 'mr-3'} border border-slate-200`}>
                        <UserIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{booking.studentName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(booking.bookingDate).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US')}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">{dir === 'rtl' ? 'لا يوجد طلاب مشتركين بعد.' : 'No students subscribed yet.'}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
