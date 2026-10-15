import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen, Star, Clock, Trophy, MessageSquare, Calendar, PlayCircle, ArrowUpRight, User as UserIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { t, dir } = useLanguage();
  
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          api.get('/student/my-profile'),
          api.get('/student/my-bookings')
        ]);
        setProfile(profileRes.data);
        setBookings(bookingsRes.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  // Find the next upcoming session
  const upcomingBookings = bookings.filter(b => new Date(b.startTime) > new Date()).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const nextSession = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        
        {/* Refined Hero Section */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold mb-4">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 animate-pulse ${dir === 'rtl' ? 'mr-2 ml-2' : 'ml-2 mr-2'}`}></span>
                {t('online_now')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {dir === 'rtl' ? `مرحباً، ${profile?.name || 'طالب'}` : `Welcome, ${profile?.name || 'Student'}`}
              </h2>
              <p className="text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">{t('student_desc')}</p>
            </div>
            <Link 
              to="/dashboard/student/explore" 
              className="shrink-0 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center text-sm shadow-sm group"
            >
              <PlayCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} text-indigo-600 group-hover:scale-110 transition-transform`} />
              {dir === 'rtl' ? 'استكشاف الحصص' : 'Explore Classes'}
            </Link>
          </div>
        </div>

        {/* Grid Layout for Stats & Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{t('total_points')}</p>
              <h3 className="text-3xl font-black text-slate-800">{profile?.rewardPoints || 0}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{dir === 'rtl' ? 'رصيد المحفظة' : 'Wallet Balance'}</p>
              <h3 className="text-3xl font-black text-slate-800">{profile?.walletBalance || 0} <span className="text-sm text-slate-400 font-medium">{dir === 'rtl' ? 'ج.م' : 'EGP'}</span></h3>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 shadow-sm border border-indigo-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100/50 px-2 py-1 rounded-md">
                {nextSession ? (dir === 'rtl' ? 'الجلسة القادمة' : 'Next Session') : (dir === 'rtl' ? 'لا توجد جلسات' : 'No Sessions')}
              </span>
            </div>
            <div>
              {nextSession ? (
                <>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{nextSession.sessionTitle}</h3>
                  <div className="flex items-center text-sm font-bold text-indigo-700 mt-2">
                    <Clock className={`w-4 h-4 ${dir === 'rtl' ? 'ml-1.5' : 'mr-1.5'}`} />
                    {new Date(nextSession.startTime).toLocaleTimeString(dir === 'rtl' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">{dir === 'rtl' ? 'ليس لديك أي جلسات قادمة محجوزة.' : 'You have no upcoming booked sessions.'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">{dir === 'rtl' ? 'الحجوزات الخاصة بك' : 'Your Bookings'}</h3>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{t('view_all')}</button>
            </div>
            <div className="space-y-3">
              {bookings.length > 0 ? (
                bookings.slice(0, 3).map((booking, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{booking.sessionTitle}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(booking.startTime).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US')} • {booking.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">{dir === 'rtl' ? 'لا توجد حجوزات حالياً' : 'No bookings yet'}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">{t('recent_messages')}</h3>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{t('inbox')}</button>
            </div>
            <div className="space-y-3">
               {[
                { name: dir === 'rtl' ? 'إدارة المنصة' : 'Platform Admin', msg: dir === 'rtl' ? 'أهلاً بك في منصة EduRate، نتمنى لك رحلة تعليمية ممتعة!' : 'Welcome to EduRate, we wish you a joyful learning journey!', time: dir === 'rtl' ? 'اليوم' : 'Today' },
              ].map((msg, idx) => (
                <div key={idx} className="flex items-start p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                  <div className={`w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center ${dir === 'rtl' ? 'ml-3' : 'mr-3'} border border-white shadow-sm`}>
                    <UserIcon className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-bold text-slate-800 text-sm truncate">{msg.name}</p>
                      <span className={`text-xs text-slate-400 ${dir === 'rtl' ? 'mr-2' : 'ml-2'} shrink-0`}>{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{msg.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
