import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { 
  Users, CheckCircle2, XCircle, Search, 
  Calendar, Star, Phone, Mail, Sparkles, X, DollarSign, Clock, MapPin, ArrowUpRight
} from 'lucide-react';

interface CenterTeacher {
  id: number;
  name: string;
  subject: string;
  phone: string;
  email: string;
  activeClasses: number;
  totalStudents: number;
  centerRevenue: string;
  totalRevenue: string;
  rating: number;
  status: 'active' | 'suspended';
  classesList?: { id: number; title: string; day: string; time: string; hall: string; students: number }[];
}

interface TeacherRequest {
  id: number;
  teacherName: string;
  subject: string;
  grade: string;
  requestedHall: string;
  timeSlot: string;
  day: string;
  estimatedStudents: number;
  requestDate: string;
}

export default function CenterTeachers() {
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'teachers' | 'requests'>('teachers');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state for Teacher Schedule & Financials
  const [selectedTeacherForSchedule, setSelectedTeacherForSchedule] = useState<CenterTeacher | null>(null);
  const [selectedTeacherForFinance, setSelectedTeacherForFinance] = useState<CenterTeacher | null>(null);

  const [teachers] = useState<CenterTeacher[]>([
    {
      id: 1,
      name: isRtl ? 'أ. أحمد محمود' : 'Mr. Ahmed Mahmoud',
      subject: isRtl ? 'فيزياء' : 'Physics',
      phone: '01012345678',
      email: 'ahmed.physics@example.com',
      activeClasses: 4,
      totalStudents: 180,
      centerRevenue: isRtl ? '4,500 ج' : '4,500 EGP',
      totalRevenue: isRtl ? '22,500 ج' : '22,500 EGP',
      rating: 4.9,
      status: 'active',
      classesList: [
        { id: 1, title: isRtl ? 'فيزياء - الصف الثالث الثانوي' : 'Physics - Grade 12', day: isRtl ? 'السبت' : 'Saturday', time: '10:00 ص - 12:00 م', hall: 'قاعة 1 (الرئيسية)', students: 85 },
        { id: 2, title: isRtl ? 'فيزياء لغات - الصف الثالث الثانوي' : 'Physics (Language) - Grade 12', day: isRtl ? 'الأربعاء' : 'Wednesday', time: '05:00 م - 07:00 م', hall: 'قاعة 1 (الرئيسية)', students: 80 },
        { id: 3, title: isRtl ? 'فيزياء مراجعة - الصف الثاني الثانوي' : 'Physics Revision - Grade 11', day: isRtl ? 'الإثنين' : 'Monday', time: '02:00 م - 04:00 م', hall: 'قاعة 2 (المتوسطة)', students: 15 },
      ]
    },
    {
      id: 2,
      name: isRtl ? 'د. سارة خالد' : 'Dr. Sara Khaled',
      subject: isRtl ? 'أحياء' : 'Biology',
      phone: '01198765432',
      email: 'sara.biology@example.com',
      activeClasses: 3,
      totalStudents: 125,
      centerRevenue: isRtl ? '3,200 ج' : '3,200 EGP',
      totalRevenue: isRtl ? '16,000 ج' : '16,000 EGP',
      rating: 4.8,
      status: 'active',
      classesList: [
        { id: 4, title: isRtl ? 'أحياء - الصف الثاني الثانوي' : 'Biology - Grade 11', day: isRtl ? 'الأحد' : 'Sunday', time: '12:30 م - 02:30 م', hall: 'قاعة 3 (VIP)', students: 30 },
        { id: 5, title: isRtl ? 'أحياء - الصف الثالث الثانوي' : 'Biology - Grade 12', day: isRtl ? 'الثلاثاء' : 'Tuesday', time: '12:30 م - 02:30 م', hall: 'قاعة 2 (المتوسطة)', students: 42 },
      ]
    },
    {
      id: 3,
      name: isRtl ? 'م. ياسر علي' : 'Eng. Yasser Ali',
      subject: isRtl ? 'رياضيات' : 'Mathematics',
      phone: '01234567890',
      email: 'yasser.math@example.com',
      activeClasses: 5,
      totalStudents: 210,
      centerRevenue: isRtl ? '5,800 ج' : '5,800 EGP',
      totalRevenue: isRtl ? '29,000 ج' : '29,000 EGP',
      rating: 5.0,
      status: 'active',
      classesList: [
        { id: 6, title: isRtl ? 'رياضيات 1 ثانوي' : 'Math - Grade 10', day: isRtl ? 'اليوم' : 'Today', time: '03:00 م - 05:00 م', hall: 'قاعة 2 (المتوسطة)', students: 25 },
        { id: 7, title: isRtl ? 'رياضيات بحتة - الصف الثالث الثانوي' : 'Pure Math - Grade 12', day: isRtl ? 'الإثنين' : 'Monday', time: '03:00 م - 05:30 م', hall: 'قاعة 1 (الرئيسية)', students: 94 },
      ]
    },
    {
      id: 4,
      name: isRtl ? 'أ. حسام الدين' : 'Mr. Hossam El-Din',
      subject: isRtl ? 'كيمياء' : 'Chemistry',
      phone: '01511223344',
      email: 'hossam.chem@example.com',
      activeClasses: 2,
      totalStudents: 90,
      centerRevenue: isRtl ? '2,100 ج' : '2,100 EGP',
      totalRevenue: isRtl ? '10,500 ج' : '10,500 EGP',
      rating: 4.7,
      status: 'active',
      classesList: [
        { id: 8, title: isRtl ? 'كيمياء - الصف الثالث الثانوي' : 'Chemistry - Grade 12', day: isRtl ? 'السبت' : 'Saturday', time: '06:00 م - 08:00 م', hall: 'قاعة 2 (المتوسطة)', students: 48 },
      ]
    },
  ]);

  const [requests, setRequests] = useState<TeacherRequest[]>([
    {
      id: 101,
      teacherName: isRtl ? 'أ. طارق عبد الله' : 'Mr. Tarek Abdullah',
      subject: isRtl ? 'لغة إنجليزية' : 'English',
      grade: isRtl ? 'الصف الثالث الثانوي' : 'Grade 12',
      requestedHall: isRtl ? 'قاعة 1 (الرئيسية)' : 'Hall 1 (Main)',
      timeSlot: isRtl ? '04:00 م - 06:00 م' : '04:00 PM - 06:00 PM',
      day: isRtl ? 'الخميس' : 'Thursday',
      estimatedStudents: 75,
      requestDate: isRtl ? 'اليوم، 11:30 ص' : 'Today, 11:30 AM',
    },
    {
      id: 102,
      teacherName: isRtl ? 'أ. مروة الشاذلي' : 'Ms. Marwa El-Shazly',
      subject: isRtl ? 'فلسفة وعلم نفس' : 'Philosophy',
      grade: isRtl ? 'الصف الثاني الثانوي' : 'Grade 11',
      requestedHall: isRtl ? 'قاعة 2 (المتوسطة)' : 'Hall 2 (Medium)',
      timeSlot: isRtl ? '02:00 م - 04:00 م' : '02:00 PM - 04:00 PM',
      day: isRtl ? 'الأحد' : 'Sunday',
      estimatedStudents: 40,
      requestDate: isRtl ? 'أمس، 05:15 م' : 'Yesterday, 05:15 PM',
    },
  ]);

  const handleApprove = (id: number) => {
    const req = requests.find(r => r.id === id);
    if (req) {
      alert(isRtl ? `تمت الموافقة على طلب ${req.teacherName} وحجز ${req.requestedHall}` : `Approved booking request for ${req.teacherName} in ${req.requestedHall}`);
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  const handleReject = (id: number) => {
    const req = requests.find(r => r.id === id);
    if (req) {
      if (confirm(isRtl ? `هل أنت متأكد من رفض طلب ${req.teacherName}؟` : `Are you sure you want to decline ${req.teacherName}'s request?`)) {
        setRequests(requests.filter(r => r.id !== id));
      }
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="center">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'إدارة هيئة التدريس والحجوزات' : 'Faculty & Reservations Management'}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">
              {isRtl ? 'المعلمون والطلبات 👨‍🏫' : 'Teachers & Requests 👨‍🏫'}
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              {isRtl 
                ? 'متابعة المعلمين المسجلين بالسنتر والموافقة على طلبات حجز القاعات الجديدة.'
                : 'Manage center teachers and review incoming room reservation requests.'}
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl relative z-10 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'teachers' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isRtl ? `المعلمون المعتمدون (${teachers.length})` : `Approved Teachers (${teachers.length})`}</span>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'requests' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{isRtl ? 'طلبات الحجز' : 'Booking Requests'}</span>
              {requests.length > 0 && (
                <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {requests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* View 1: Active Teachers */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            
            {/* Search filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <Search className={`w-5 h-5 text-slate-400 ${isRtl ? 'mr-2' : 'ml-2'}`} />
              <input
                type="text"
                placeholder={isRtl ? "ابحث باسم المعلم أو المادة..." : "Search by teacher or subject..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-slate-800"
              />
            </div>

            {/* Teacher Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredTeachers.map(teacher => (
                <div key={teacher.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-indigo-100">
                          {teacher.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-slate-900">{teacher.name}</h3>
                            <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-md font-bold">
                              {isRtl ? 'معتمد' : 'Verified'}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-1">
                            {isRtl ? `مادة ${teacher.subject}` : teacher.subject}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{teacher.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 bg-slate-50/80 p-3.5 rounded-2xl text-center mb-5 border border-slate-100">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block">{isRtl ? 'الحصص' : 'Classes'}</span>
                        <span className="font-black text-slate-800 text-sm">
                          {isRtl ? `${teacher.activeClasses} أسبوعياً` : `${teacher.activeClasses} /wk`}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block">{isRtl ? 'إجمالي الطلاب' : 'Students'}</span>
                        <span className="font-black text-slate-800 text-sm">{teacher.totalStudents}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block">{isRtl ? 'أرباح السنتر' : 'Center Rev'}</span>
                        <span className="font-black text-emerald-600 text-sm">{teacher.centerRevenue}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-4 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span dir="ltr">{teacher.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{teacher.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => setSelectedTeacherForSchedule(teacher)}
                      className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'عرض جدول الحصص' : 'View Schedule'}</span>
                    </button>
                    <button 
                      onClick={() => setSelectedTeacherForFinance(teacher)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isRtl ? 'التقرير المالي' : 'Financials'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* View 2: Booking Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-xl font-black text-slate-900">
                {isRtl ? `طلبات حجز القاعات المعلقة (${requests.length})` : `Pending Booking Requests (${requests.length})`}
              </h2>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">
                  {isRtl ? 'لا توجد طلبات معلقة حالياً' : 'No pending requests at the moment'}
                </h3>
                <p className="text-sm text-slate-400">
                  {isRtl ? 'تمت معالجة كافة طلبات المعلمين لحجز القاعات بنجاح.' : 'All teacher requests have been addressed.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                          {req.teacherName[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{req.teacherName}</h3>
                          <span className="text-xs text-slate-500">{req.subject} • {req.grade}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                          {isRtl ? `القاعة المطلوبة: ${req.requestedHall}` : `Requested Hall: ${req.requestedHall}`}
                        </span>
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          {isRtl ? `الموعد: ${req.day} (${req.timeSlot})` : `Slot: ${req.day} (${req.timeSlot})`}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
                          {isRtl ? `العدد المتوقع: ~${req.estimatedStudents} طالب` : `Expected: ~${req.estimatedStudents} students`}
                        </span>
                        <span className="text-slate-400">
                          {isRtl ? `تاريخ الطلب: ${req.requestDate}` : `Requested on: ${req.requestDate}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => handleReject(req.id)}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        {isRtl ? 'رفض' : 'Decline'}
                      </button>
                      <button 
                        onClick={() => handleApprove(req.id)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isRtl ? 'قبول وتأكيد الحجز' : 'Approve & Confirm'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Modal 1: Teacher Schedule (جدول حصص المعلم) */}
        {selectedTeacherForSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl rounded-3xl p-7 shadow-2xl border border-slate-100 relative space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {isRtl ? `جدول حصص: ${selectedTeacherForSchedule.name} 📅` : `${selectedTeacherForSchedule.name}'s Schedule 📅`}
                  </h3>
                  <p className="text-xs text-indigo-600 font-bold mt-1">
                    {selectedTeacherForSchedule.subject} • {selectedTeacherForSchedule.activeClasses} حصص أسبوعياً بالسنتر
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedTeacherForSchedule(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Classes List */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {selectedTeacherForSchedule.classesList && selectedTeacherForSchedule.classesList.length > 0 ? (
                  selectedTeacherForSchedule.classesList.map(item => (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {item.day} ({item.time})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-indigo-600 font-bold">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.hall}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                        {item.students} طالب
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 text-xs py-6">لا توجد حصص مسجلة</p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setSelectedTeacherForSchedule(null);
                    navigate(`/dashboard/center/schedule`);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isRtl ? 'فتح الجدول العام' : 'Open Full Schedule'}</span>
                </button>
                <button 
                  onClick={() => setSelectedTeacherForSchedule(null)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal 2: Teacher Financial Statement (التقرير المالي للمعلم) */}
        {selectedTeacherForFinance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl p-7 shadow-2xl border border-slate-100 relative space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {isRtl ? `التقرير المالي: ${selectedTeacherForFinance.name} 💰` : `Financial Statement: ${selectedTeacherForFinance.name} 💰`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedTeacherForFinance.subject} • تصفية العوائد ونسبة السنتر
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedTeacherForFinance(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Financial Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xs text-emerald-700 font-bold block mb-1">
                    {isRtl ? 'أرباح السنتر المحققة (20%)' : 'Center Cut (20%)'}
                  </span>
                  <span className="text-2xl font-black text-emerald-800">{selectedTeacherForFinance.centerRevenue}</span>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <span className="text-xs text-indigo-700 font-bold block mb-1">
                    {isRtl ? 'إجمالي دخل الحصص' : 'Total Revenue'}
                  </span>
                  <span className="text-2xl font-black text-indigo-900">{selectedTeacherForFinance.totalRevenue}</span>
                </div>
              </div>

              {/* Settlement Summary */}
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>إجمالي عدد الطلاب المحاسب عليهم:</span>
                  <span className="font-bold text-slate-900">{selectedTeacherForFinance.totalStudents} طالب</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>مستحقات المعلم الصافية:</span>
                  <span className="font-bold text-indigo-600">
                    {parseInt(selectedTeacherForFinance.totalRevenue.replace(/\D/g, '') || '0') - parseInt(selectedTeacherForFinance.centerRevenue.replace(/\D/g, '') || '0')} ج.م
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200/60">
                  <span>حالة التسوية الأخيرة:</span>
                  <span className="font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md">✓ تمت التسوية والتحويل</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setSelectedTeacherForFinance(null);
                    navigate('/dashboard/center/finance');
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{isRtl ? 'الانتقال لصفحة المالية' : 'Open Finance Page'}</span>
                </button>
                <button 
                  onClick={() => setSelectedTeacherForFinance(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
