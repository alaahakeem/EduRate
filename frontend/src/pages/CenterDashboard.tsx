import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function CenterDashboard() {
  const { dir } = useLanguage();
  const navigate = useNavigate();

  const isRtl = dir === 'rtl';

  const stats = [
    { 
      title: isRtl ? 'حصص اليوم' : "Today's Classes", 
      value: '12', 
      icon: Calendar, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      trend: isRtl ? '+2 عن الأمس' : '+2 vs yesterday' 
    },
    { 
      title: isRtl ? 'معلمون نشطون' : 'Active Teachers', 
      value: '8', 
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-100', 
      trend: isRtl ? '3 في انتظار الموافقة' : '3 pending review' 
    },
    { 
      title: isRtl ? 'إجمالي الحضور' : 'Total Attendance', 
      value: '450', 
      icon: BookOpen, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100', 
      trend: isRtl ? '+15% هذا الأسبوع' : '+15% this week' 
    },
    { 
      title: isRtl ? 'أرباح المركز' : 'Center Revenue', 
      value: isRtl ? '12,500 ج' : '12,500 EGP', 
      icon: DollarSign, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100', 
      trend: isRtl ? '+8% هذا الشهر' : '+8% this month' 
    },
  ];

  const recentClasses = [
    { 
      id: 1, 
      teacher: isRtl ? 'أ. أحمد محمود' : 'Mr. Ahmed Mahmoud', 
      subject: isRtl ? 'فيزياء 3 ثانوي' : 'Physics (Grade 12)', 
      time: isRtl ? '10:00 ص - 12:00 م' : '10:00 AM - 12:00 PM', 
      hall: isRtl ? 'قاعة 1' : 'Hall 1', 
      students: 45, 
      status: isRtl ? 'مستمرة' : 'Ongoing' 
    },
    { 
      id: 2, 
      teacher: isRtl ? 'د. سارة خالد' : 'Dr. Sara Khaled', 
      subject: isRtl ? 'أحياء 2 ثانوي' : 'Biology (Grade 11)', 
      time: isRtl ? '12:30 م - 02:30 م' : '12:30 PM - 02:30 PM', 
      hall: isRtl ? 'قاعة 3' : 'Hall 3', 
      students: 30, 
      status: isRtl ? 'قادمة' : 'Upcoming' 
    },
    { 
      id: 3, 
      teacher: isRtl ? 'م. ياسر علي' : 'Eng. Yasser Ali', 
      subject: isRtl ? 'رياضيات 1 ثانوي' : 'Math (Grade 10)', 
      time: isRtl ? '03:00 م - 05:00 م' : '03:00 PM - 05:00 PM', 
      hall: isRtl ? 'قاعة 2' : 'Hall 2', 
      students: 25, 
      status: isRtl ? 'قادمة' : 'Upcoming' 
    },
    { 
      id: 4, 
      teacher: isRtl ? 'أ. منى السيد' : 'Ms. Mona El-Sayed', 
      subject: isRtl ? 'لغة عربية' : 'Arabic Language', 
      time: isRtl ? '08:00 ص - 10:00 ص' : '08:00 AM - 10:00 AM', 
      hall: isRtl ? 'قاعة 1' : 'Hall 1', 
      students: 50, 
      status: isRtl ? 'مكتملة' : 'Completed' 
    },
  ];

  return (
    <DashboardLayout role="center">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {isRtl ? 'مرحباً بك في إدارة السنتر 🏢' : 'Welcome to Center Admin 🏢'}
            </h1>
            <p className="text-slate-500 text-lg">
              {isRtl 
                ? 'نظرة عامة على نشاط المركز، الحجوزات، والمعلمين اليوم.' 
                : "Overview of today's center activities, bookings, and teachers."}
            </p>
          </div>
          <div className="flex gap-3 relative z-10">
            <button 
              onClick={() => navigate('/dashboard/center/schedule?day=today')}
              className="px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-2xl transition-all shadow-sm flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              {isRtl ? 'جدول اليوم' : "Today's Schedule"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-slate-500 font-medium mb-1">{stat.title}</h3>
              <div className="text-3xl font-black text-slate-900 mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-lg">
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Classes Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-500" />
              {isRtl ? 'جدول حصص اليوم' : "Today's Schedule"}
            </h2>
            <button 
              onClick={() => navigate('/dashboard/center/schedule?day=all')}
              className="text-indigo-600 font-bold hover:text-indigo-800 text-sm transition-colors"
            >
              {isRtl ? 'عرض كل الحصص ←' : 'View All Classes →'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="p-4 font-bold">{isRtl ? 'المعلم / المادة' : 'Teacher / Subject'}</th>
                  <th className="p-4 font-bold">{isRtl ? 'الموعد' : 'Time'}</th>
                  <th className="p-4 font-bold">{isRtl ? 'القاعة' : 'Hall'}</th>
                  <th className="p-4 font-bold">{isRtl ? 'الطلاب' : 'Students'}</th>
                  <th className="p-4 font-bold">{isRtl ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{cls.teacher}</div>
                      <div className="text-sm text-slate-500">{cls.subject}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-700 bg-slate-100 inline-block px-3 py-1 rounded-lg">
                        {cls.time}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-indigo-600">{cls.hall}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <Users className="w-4 h-4 text-slate-400" />
                        {cls.students}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold
                        ${cls.status === 'مستمرة' || cls.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' : 
                          cls.status === 'مكتملة' || cls.status === 'Completed' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'}`}>
                        {cls.status === 'مكتملة' || cls.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        {cls.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
