import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, Settings, LogOut, Menu, User as UserIcon, Bell, Users, Video, BarChart, Shield, DollarSign, Activity, Globe, Search, CheckCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

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

export default function DashboardLayout({ children, role }: { children: React.ReactNode, role: 'student' | 'teacher' | 'admin' | 'center' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, dir, toggleLanguage } = useLanguage();
  const { token, logout } = useAuth();
  
  const [userName, setUserName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [readIds, setReadIds] = useState<number[]>([]);

  const notificationsByRole: Record<string, { id: number; titleAr: string; titleEn: string; timeAr: string; timeEn: string }[]> = {
    center: [
      { id: 1, titleAr: 'طلب حجز جديد من أ. طارق عبد الله لقاعة 1 (الرئيسية)', titleEn: 'New booking request from Mr. Tarek Abdullah for Hall 1', timeAr: 'منذ 10 دقائق', timeEn: '10m ago' },
      { id: 2, titleAr: 'تمت تسوية أرباح حصة الفيزياء (أ. أحمد محمود) بنجاح', titleEn: 'Physics class revenue settled successfully', timeAr: 'منذ ساعتين', timeEn: '2h ago' },
      { id: 3, titleAr: 'تم تأكيد حجز قاعة 2 لـ د. سارة خالد', titleEn: 'Hall 2 reservation confirmed for Dr. Sara Khaled', timeAr: 'منذ 5 ساعات', timeEn: '5h ago' },
    ],
    teacher: [
      { id: 1, titleAr: 'قام الطالب كريم علي بحجز مقعد في حصة الفيزياء', titleEn: 'Student Karim Ali booked a seat in Physics class', timeAr: 'منذ 15 دقيقة', timeEn: '15m ago' },
      { id: 2, titleAr: 'وافق سنتر الأوائل على طلب حجز القاعة الكبرى', titleEn: 'Al-Awa2el Center approved your grand hall request', timeAr: 'منذ ساعة', timeEn: '1h ago' },
      { id: 3, titleAr: 'تم إيداع أرباح مبيعات الحصص في محفظتك', titleEn: 'Class earnings deposited into your wallet', timeAr: 'منذ يوم', timeEn: '1d ago' },
    ],
    student: [
      { id: 1, titleAr: 'تذكير: موعد حصة الفيزياء مع أ. أحمد محمود غداً 10:00 ص', titleEn: 'Reminder: Physics class tomorrow at 10:00 AM', timeAr: 'منذ 30 دقيقة', timeEn: '30m ago' },
      { id: 2, titleAr: 'تم تأكيد حجز مقعدك بنجاح في سنتر الأوائل', titleEn: 'Your booking confirmed at Al-Awa2el Center', timeAr: 'منذ 3 ساعات', timeEn: '3h ago' },
      { id: 3, titleAr: 'تمت إضافة 50 نقطة مكافأة إلى رصيدك', titleEn: '50 reward points added to your balance', timeAr: 'منذ يوم', timeEn: '1d ago' },
    ],
    admin: [
      { id: 1, titleAr: 'طلب انضمام جديد من المعلم أ. حسام الدين بانتظار المراجعة', titleEn: 'New teacher registration pending review: Mr. Hossam', timeAr: 'منذ 20 دقيقة', timeEn: '20m ago' },
      { id: 2, titleAr: 'تم تسجيل سنتر جديد: سنتر الأوائل التعليمي', titleEn: 'New center registered: Al-Awa2el Center', timeAr: 'منذ ساعتين', timeEn: '2h ago' },
      { id: 3, titleAr: 'تقرير الأرباح الأسبوعي للمنصة جاهز للتحميل', titleEn: 'Weekly platform financial report is ready', timeAr: 'منذ يوم', timeEn: '1d ago' },
    ],
  };

  const currentNotifications = notificationsByRole[role] || notificationsByRole['student'];

  const markAllRead = () => {
    setReadIds(currentNotifications.map(n => n.id));
    setUnreadCount(0);
  };


  useEffect(() => {
    const payload = parseJwt(token);
    if (payload) {
      // .NET ClaimTypes.Name maps to this long schema URL
      const msClaimName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
      setUserName(payload[msClaimName] || payload.unique_name || payload.name || '');
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: t('home'), icon: BookOpen, path: '/dashboard/student' },
    { name: dir === 'rtl' ? 'استكشاف الحصص' : 'Explore Classes', icon: Search, path: '/dashboard/student/explore' },
    { name: t('my_schedule'), icon: Calendar, path: '/dashboard/student/schedule' },
    { name: t('messages'), icon: MessageSquare, path: '/dashboard/student/messages' },
    { name: t('settings'), icon: Settings, path: '/dashboard/student/settings' },
  ];

  const teacherLinks = [
    { name: t('home'), icon: BookOpen, path: '/dashboard/teacher' },
    { name: t('my_courses'), icon: Video, path: '/dashboard/teacher/courses' },
    { name: t('students'), icon: Users, path: '/dashboard/teacher/students' },
    { name: t('sales'), icon: BarChart, path: '/dashboard/teacher/sales' },
    { name: t('settings'), icon: Settings, path: '/dashboard/teacher/settings' },
  ];

  const adminLinks = [
    { name: t('overview'), icon: Activity, path: '/dashboard/admin' },
    { name: t('users'), icon: Users, path: '/dashboard/admin/users' },
    { name: dir === 'rtl' ? 'المواد الدراسية' : 'Subjects', icon: BookOpen, path: '/dashboard/admin/subjects' },
    { name: t('finance'), icon: DollarSign, path: '/dashboard/admin/finance' },
    { name: t('reports'), icon: BarChart, path: '/dashboard/admin/reports' },
  ];

  const centerLinks = [
    { name: dir === 'rtl' ? 'نظرة عامة' : 'Overview', icon: LayoutDashboard, path: '/dashboard/center' },
    { name: dir === 'rtl' ? 'جدول الحصص' : 'Schedule', icon: Calendar, path: '/dashboard/center/schedule' },
    { name: dir === 'rtl' ? 'المعلمون' : 'Teachers', icon: Users, path: '/dashboard/center/teachers' },
    { name: dir === 'rtl' ? 'المالية' : 'Finance', icon: DollarSign, path: '/dashboard/center/finance' },
    { name: dir === 'rtl' ? 'الإعدادات' : 'Settings', icon: Settings, path: '/dashboard/center/settings' },
  ];

  const links = role === 'admin' ? adminLinks 
              : role === 'center' ? centerLinks
              : role === 'teacher' ? teacherLinks 
              : studentLinks;

  return (
    <div dir={dir} className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 transition-all">
      {/* Elegant Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 bg-white ${dir === 'rtl' ? 'border-l' : 'border-r'} border-slate-200 z-20 shadow-sm`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
              EduRate.
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="text-xs font-bold text-slate-400 mb-4 px-2 uppercase tracking-wider">{t('main_menu')}</div>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.name} to={link.path} className={`flex items-center px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-indigo-50/80 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
                <link.icon className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'} ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium text-sm group">
            <LogOut className={`w-5 h-5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'} text-slate-400 group-hover:text-red-500 transition-colors`} />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Sleek Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 sticky top-0 shadow-sm">
          <div className="flex items-center">
            <button className={`lg:hidden text-slate-500 hover:text-indigo-600 ${dir === 'rtl' ? 'ml-4' : 'mr-4'} transition-colors`}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">{t('dashboard')}</h1>
          </div>
          
          <div className={`flex items-center ${dir === 'rtl' ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
            <button onClick={toggleLanguage} className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">
              <Globe className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('switch_lang')}
            </button>
            
            {/* Interactive Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all relative"
                title={dir === 'rtl' ? 'الإشعارات' : 'Notifications'}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className={`absolute top-1.5 ${dir === 'rtl' ? 'right-1.5' : 'left-1.5'} flex h-2.5 w-2.5`}>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-white"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className={`absolute top-full mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 ${
                    dir === 'rtl' ? 'left-0' : 'right-0'
                  }`}>
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <h3 className="font-black text-slate-900 text-sm">
                          {dir === 'rtl' ? 'مركز الإشعارات' : 'Notifications'}
                        </h3>
                        {unreadCount > 0 && (
                          <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                            {unreadCount} {dir === 'rtl' ? 'جديد' : 'new'}
                          </span>
                        )}
                      </div>
                      
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>{dir === 'rtl' ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {currentNotifications.map((n) => {
                        const isRead = readIds.includes(n.id);
                        return (
                          <div 
                            key={n.id}
                            onClick={() => {
                              if (!isRead) {
                                setReadIds([...readIds, n.id]);
                                setUnreadCount(Math.max(0, unreadCount - 1));
                              }
                            }}
                            className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                              isRead 
                                ? 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50' 
                                : 'bg-indigo-50/60 border-indigo-100/70 text-slate-800 hover:bg-indigo-50'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                isRead ? 'bg-slate-300' : 'bg-indigo-600 animate-pulse'
                              }`}></span>
                              <div className="flex-1 space-y-1">
                                <p className="text-xs font-bold leading-snug">
                                  {dir === 'rtl' ? n.titleAr : n.titleEn}
                                </p>
                                <span className="text-[10px] text-slate-400 font-medium block">
                                  {dir === 'rtl' ? n.timeAr : n.timeEn}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-center">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {dir === 'rtl' ? 'تمت مزامنة جميع الإشعارات لحظياً ✓' : 'All notifications synced in real-time ✓'}
                      </span>
                    </div>

                  </div>
                </>
              )}
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigate(`/dashboard/${role}/settings`)}
            >
              <span className={`text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors hidden sm:block ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                {userName || t(role as any)}
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 border border-indigo-200">
                <UserIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
