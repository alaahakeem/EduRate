import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { 
  Calendar, Clock, Users, MapPin, Plus, Search, 
  Sparkles, CheckCircle2, X, Download, UserCheck, ShieldCheck, DollarSign
} from 'lucide-react';

interface ClassSession {
  id: number;
  teacherName: string;
  subject: string;
  grade: string;
  hallName: string;
  hallCapacity: number;
  enrolledStudents: number;
  startTime: string;
  endTime: string;
  day: string;
  isToday?: boolean;
  ticketPrice?: number;
  status: 'ongoing' | 'upcoming' | 'completed';
}

export default function CenterSchedule() {
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const [searchParams] = useSearchParams();

  // Read day param from URL (e.g. ?day=today)
  const dayParam = searchParams.get('day');
  const initialDay = dayParam === 'today' 
    ? (isRtl ? 'اليوم' : 'Today')
    : (isRtl ? 'الكل' : 'All');

  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedHall, setSelectedHall] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Modals state
  const [attendanceSession, setAttendanceSession] = useState<ClassSession | null>(null);
  const [detailsSession, setDetailsSession] = useState<ClassSession | null>(null);

  // Update selected day if search params change
  useEffect(() => {
    if (dayParam === 'today') {
      setSelectedDay(isRtl ? 'اليوم' : 'Today');
    } else if (dayParam === 'all') {
      setSelectedDay(isRtl ? 'الكل' : 'All');
    }
  }, [dayParam, isRtl]);

  const days = isRtl 
    ? ['الكل', 'اليوم', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
    : ['All', 'Today', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  
  const halls = [
    { id: 'all', name: isRtl ? 'جميع القاعات' : 'All Halls' },
    { id: 'h1', name: isRtl ? 'قاعة 1 (الرئيسية - 100 طالب)' : 'Hall 1 (Main - 100 students)' },
    { id: 'h2', name: isRtl ? 'قاعة 2 (المتوسطة - 50 طالب)' : 'Hall 2 (Medium - 50 students)' },
    { id: 'h3', name: isRtl ? 'قاعة 3 (VIP - 25 طالب)' : 'Hall 3 (VIP - 25 students)' },
  ];

  const sessions: ClassSession[] = [
    // Today's 4 classes (Matching CenterDashboard)
    {
      id: 1,
      teacherName: isRtl ? 'أ. أحمد محمود' : 'Mr. Ahmed Mahmoud',
      subject: isRtl ? 'فيزياء 3 ثانوي' : 'Physics (Grade 12)',
      grade: isRtl ? 'الصف الثالث الثانوي' : 'Grade 12',
      hallName: isRtl ? 'قاعة 1 (الرئيسية)' : 'Hall 1 (Main)',
      hallCapacity: 100,
      enrolledStudents: 45,
      ticketPrice: 150,
      startTime: isRtl ? '10:00 ص' : '10:00 AM',
      endTime: isRtl ? '12:00 م' : '12:00 PM',
      day: isRtl ? 'اليوم' : 'Today',
      isToday: true,
      status: 'ongoing',
    },
    {
      id: 2,
      teacherName: isRtl ? 'د. سارة خالد' : 'Dr. Sara Khaled',
      subject: isRtl ? 'أحياء 2 ثانوي' : 'Biology (Grade 11)',
      grade: isRtl ? 'الصف الثاني الثانوي' : 'Grade 11',
      hallName: isRtl ? 'قاعة 3 (VIP)' : 'Hall 3 (VIP)',
      hallCapacity: 25,
      enrolledStudents: 30,
      ticketPrice: 200,
      startTime: isRtl ? '12:30 م' : '12:30 PM',
      endTime: isRtl ? '02:30 م' : '02:30 PM',
      day: isRtl ? 'اليوم' : 'Today',
      isToday: true,
      status: 'upcoming',
    },
    {
      id: 3,
      teacherName: isRtl ? 'م. ياسر علي' : 'Eng. Yasser Ali',
      subject: isRtl ? 'رياضيات 1 ثانوي' : 'Math (Grade 10)',
      grade: isRtl ? 'الصف الأول الثانوي' : 'Grade 10',
      hallName: isRtl ? 'قاعة 2 (المتوسطة)' : 'Hall 2 (Medium)',
      hallCapacity: 50,
      enrolledStudents: 25,
      ticketPrice: 120,
      startTime: isRtl ? '03:00 م' : '03:00 PM',
      endTime: isRtl ? '05:00 م' : '05:00 PM',
      day: isRtl ? 'اليوم' : 'Today',
      isToday: true,
      status: 'upcoming',
    },
    {
      id: 4,
      teacherName: isRtl ? 'أ. منى السيد' : 'Ms. Mona El-Sayed',
      subject: isRtl ? 'لغة عربية' : 'Arabic Language',
      grade: isRtl ? 'الصف الأول الثانوي' : 'Grade 10',
      hallName: isRtl ? 'قاعة 1 (الرئيسية)' : 'Hall 1 (Main)',
      hallCapacity: 100,
      enrolledStudents: 50,
      ticketPrice: 100,
      startTime: isRtl ? '08:00 ص' : '08:00 AM',
      endTime: isRtl ? '10:00 ص' : '10:00 AM',
      day: isRtl ? 'اليوم' : 'Today',
      isToday: true,
      status: 'completed',
    },

    // Saturday
    {
      id: 5,
      teacherName: isRtl ? 'أ. حسام الدين' : 'Mr. Hossam El-Din',
      subject: isRtl ? 'كيمياء' : 'Chemistry',
      grade: isRtl ? 'الصف الثالث الثانوي' : 'Grade 12',
      hallName: isRtl ? 'قاعة 2 (المتوسطة)' : 'Hall 2 (Medium)',
      hallCapacity: 50,
      enrolledStudents: 48,
      ticketPrice: 140,
      startTime: isRtl ? '06:00 م' : '06:00 PM',
      endTime: isRtl ? '08:00 م' : '08:00 PM',
      day: isRtl ? 'السبت' : 'Saturday',
      status: 'upcoming',
    },
    // Sunday
    {
      id: 6,
      teacherName: isRtl ? 'أ. طارق عبد الله' : 'Mr. Tarek Abdullah',
      subject: isRtl ? 'لغة إنجليزية' : 'English',
      grade: isRtl ? 'الصف الثالث الثانوي' : 'Grade 12',
      hallName: isRtl ? 'قاعة 1 (الرئيسية)' : 'Hall 1 (Main)',
      hallCapacity: 100,
      enrolledStudents: 75,
      ticketPrice: 130,
      startTime: isRtl ? '04:00 م' : '04:00 PM',
      endTime: isRtl ? '06:00 م' : '06:00 PM',
      day: isRtl ? 'الأحد' : 'Sunday',
      status: 'upcoming',
    },
    // Monday
    {
      id: 7,
      teacherName: isRtl ? 'م. ياسر علي' : 'Eng. Yasser Ali',
      subject: isRtl ? 'رياضيات بحتة' : 'Pure Mathematics',
      grade: isRtl ? 'الصف الثالث الثانوي' : 'Grade 12',
      hallName: isRtl ? 'قاعة 1 (الرئيسية)' : 'Hall 1 (Main)',
      hallCapacity: 100,
      enrolledStudents: 94,
      ticketPrice: 150,
      startTime: isRtl ? '03:00 م' : '03:00 PM',
      endTime: isRtl ? '05:30 م' : '05:30 PM',
      day: isRtl ? 'الإثنين' : 'Monday',
      status: 'upcoming',
    },
    // Tuesday
    {
      id: 8,
      teacherName: isRtl ? 'د. سارة خالد' : 'Dr. Sara Khaled',
      subject: isRtl ? 'أحياء' : 'Biology',
      grade: isRtl ? 'الصف الثاني الثانوي' : 'Grade 11',
      hallName: isRtl ? 'قاعة 2 (المتوسطة)' : 'Hall 2 (Medium)',
      hallCapacity: 50,
      enrolledStudents: 42,
      ticketPrice: 180,
      startTime: isRtl ? '12:30 م' : '12:30 PM',
      endTime: isRtl ? '02:30 م' : '02:30 PM',
      day: isRtl ? 'الثلاثاء' : 'Tuesday',
      status: 'upcoming',
    },
    // Wednesday
    {
      id: 9,
      teacherName: isRtl ? 'أ. أحمد محمود' : 'Mr. Ahmed Mahmoud',
      subject: isRtl ? 'فيزياء لغات' : 'Physics (Language)',
      grade: isRtl ? 'الصف الثالث الثانوي' : 'Grade 12',
      hallName: isRtl ? 'قاعة 1 (الرئيسية)' : 'Hall 1 (Main)',
      hallCapacity: 100,
      enrolledStudents: 80,
      ticketPrice: 160,
      startTime: isRtl ? '05:00 م' : '05:00 PM',
      endTime: isRtl ? '07:00 م' : '07:00 PM',
      day: isRtl ? 'الأربعاء' : 'Wednesday',
      status: 'upcoming',
    },
    // Thursday
    {
      id: 10,
      teacherName: isRtl ? 'أ. منى السيد' : 'Ms. Mona El-Sayed',
      subject: isRtl ? 'بلاغة ونصوص' : 'Arabic Literature',
      grade: isRtl ? 'الصف الثاني الثانوي' : 'Grade 11',
      hallName: isRtl ? 'قاعة 3 (VIP)' : 'Hall 3 (VIP)',
      hallCapacity: 25,
      enrolledStudents: 20,
      ticketPrice: 110,
      startTime: isRtl ? '02:00 م' : '02:00 PM',
      endTime: isRtl ? '04:00 م' : '04:00 PM',
      day: isRtl ? 'الخميس' : 'Thursday',
      status: 'upcoming',
    },
  ];

  // Specific Day Filter Logic
  const filteredSessions = sessions.filter(session => {
    let matchesDay = false;
    
    if (selectedDay === (isRtl ? 'الكل' : 'All')) {
      matchesDay = true;
    } else if (selectedDay === (isRtl ? 'اليوم' : 'Today')) {
      matchesDay = session.isToday === true || session.day === (isRtl ? 'اليوم' : 'Today');
    } else {
      matchesDay = session.day === selectedDay;
    }

    const matchesHall = selectedHall === 'all' || 
      (selectedHall === 'h1' && (session.hallName.includes('1') || session.hallName.includes('Main'))) ||
      (selectedHall === 'h2' && (session.hallName.includes('2') || session.hallName.includes('Medium'))) ||
      (selectedHall === 'h3' && (session.hallName.includes('3') || session.hallName.includes('VIP')));

    const matchesSearch = session.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      session.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.grade.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDay && matchesHall && matchesSearch;
  });

  const handleBookHall = () => {
    setBookingSuccessMsg(isRtl ? 'تم فتح طلب حجز القاعة بنجاح!' : 'Hall reservation modal opened!');
    setTimeout(() => setBookingSuccessMsg(''), 3000);
  };

  // Mock Students for Attendance
  const mockStudents = [
    { id: 101, name: isRtl ? 'محمد أحمد إبراهيم' : 'Mohamed Ahmed', code: 'ST-101', time: '09:55 ص', status: 'present' },
    { id: 102, name: isRtl ? 'سارة محمود كمال' : 'Sara Mahmoud', code: 'ST-102', time: '10:02 ص', status: 'present' },
    { id: 103, name: isRtl ? 'كريم علي حسن' : 'Karim Ali', code: 'ST-103', time: '-', status: 'excused' },
    { id: 104, name: isRtl ? 'مريم شريف طارق' : 'Mariam Sherif', code: 'ST-104', time: '10:05 ص', status: 'present' },
    { id: 105, name: isRtl ? 'عمر فاروق عبد الله' : 'Omar Farouk', code: 'ST-105', time: '09:50 ص', status: 'present' },
    { id: 106, name: isRtl ? 'ياسمين حسن مصطفى' : 'Yasmine Hassan', code: 'ST-106', time: '-', status: 'absent' },
    { id: 107, name: isRtl ? 'زياد هاني عبد العزيز' : 'Ziad Hany', code: 'ST-107', time: '09:58 ص', status: 'present' },
    { id: 108, name: isRtl ? 'فاطمة محمد ناصر' : 'Fatma Mohamed', code: 'ST-108', time: '10:10 ص', status: 'present' },
  ];

  return (
    <DashboardLayout role="center">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{isRtl ? 'إدارة القاعات والمواعيد' : 'Halls & Schedules Management'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">
                {isRtl ? 'جدول حصص المركز 📅' : 'Center Schedule 📅'}
              </h1>
              <p className="text-slate-300 max-w-xl text-sm md:text-base leading-relaxed">
                {isRtl 
                  ? 'متابعة إشغال القاعات وتوزيع المعلمين والطلاب في الفترات الصباحية والمسائية.'
                  : 'Track room capacity and scheduling of teachers across morning and evening sessions.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleBookHall}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                {isRtl ? 'حجز قاعة لمعلم' : 'Reserve Hall for Teacher'}
              </button>
            </div>
          </div>
        </div>

        {bookingSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-bold text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{bookingSuccessMsg}</span>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          
          {/* Days Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedDay === day 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Search & Hall filter */}
          <div className="flex flex-col md:flex-row gap-4 pt-2 border-t border-slate-100">
            <div className="relative flex-1">
              <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                placeholder={isRtl ? "ابحث باسم المعلم، المادة، أو المرحلة..." : "Search teacher, subject, or grade..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'
                }`}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {halls.map(hall => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold border transition-all whitespace-nowrap ${
                    selectedHall === hall.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {hall.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>{isRtl ? `الحصص المجدولة (${filteredSessions.length})` : `Scheduled Classes (${filteredSessions.length})`}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map(session => {
              const capacityPercentage = Math.round((session.enrolledStudents / session.hallCapacity) * 100);
              const isFull = capacityPercentage >= 90;

              return (
                <div 
                  key={session.id} 
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                      session.status === 'ongoing' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : session.status === 'upcoming' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {session.status === 'ongoing' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      )}
                      {session.status === 'ongoing' ? (isRtl ? 'جارية الآن' : 'Ongoing') : session.status === 'upcoming' ? (isRtl ? 'قادمة' : 'Upcoming') : (isRtl ? 'مكتملة' : 'Completed')}
                    </span>

                    <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      {session.day} • {session.grade}
                    </span>
                  </div>

                  {/* Class Info */}
                  <div className="space-y-2 mb-5">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {session.subject}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                        {session.teacherName[0]}
                      </div>
                      <span>{session.teacherName}</span>
                    </div>
                  </div>

                  {/* Hall and Time Metadata */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3 mb-5 border border-slate-100 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <div className="flex items-center gap-1.5 font-bold">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span>{session.hallName}</span>
                      </div>
                      <span className="font-bold text-slate-500">
                        {isRtl ? `سعة ${session.hallCapacity}` : `Cap: ${session.hallCapacity}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="pt-1">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-500">{isRtl ? 'إشغال القاعة' : 'Occupancy'}</span>
                        <span className={isFull ? 'text-amber-600' : 'text-indigo-600'}>
                          {session.enrolledStudents} / {session.hallCapacity} ({capacityPercentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFull ? 'bg-amber-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${capacityPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => setAttendanceSession(session)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isRtl ? 'سجل الحضور' : 'Attendance'}</span>
                    </button>
                    <button 
                      onClick={() => setDetailsSession(session)}
                      className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{isRtl ? 'تفاصيل الحصة' : 'Details'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredSessions.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">
                {isRtl ? 'لا توجد حصص مجدولة لهذا اليوم' : 'No scheduled classes found for this day'}
              </h3>
              <p className="text-sm text-slate-400">
                {isRtl ? 'جرّب اختيار يوم آخر أو تغيير فلتر القاعات.' : 'Try choosing another day or hall filter.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal 1: Attendance Sheet (سجل الحضور) */}
        {attendanceSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-7 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-xl font-black text-slate-900">
                      {isRtl ? `سجل حضور: ${attendanceSession.subject}` : `Attendance: ${attendanceSession.subject}`}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {attendanceSession.teacherName} • {attendanceSession.hallName} • {attendanceSession.startTime}
                  </p>
                </div>
                <button 
                  onClick={() => setAttendanceSession(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Attendance Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                  <span className="text-xs text-slate-400 font-bold block">{isRtl ? 'إجمالي الحضور' : 'Total Students'}</span>
                  <span className="text-xl font-black text-slate-900">{attendanceSession.enrolledStudents}</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl text-center border border-emerald-100">
                  <span className="text-xs text-emerald-600 font-bold block">{isRtl ? 'حاضر الآن' : 'Present'}</span>
                  <span className="text-xl font-black text-emerald-700">{attendanceSession.enrolledStudents - 3}</span>
                </div>
                <div className="bg-rose-50 p-3 rounded-2xl text-center border border-rose-100">
                  <span className="text-xs text-rose-600 font-bold block">{isRtl ? 'غائب / معتذر' : 'Absent'}</span>
                  <span className="text-xl font-black text-rose-700">3</span>
                </div>
              </div>

              {/* Students List Table */}
              <div className="flex-1 overflow-y-auto border border-slate-100 rounded-2xl">
                <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold sticky top-0 border-b border-slate-100">
                    <tr>
                      <th className="p-3.5">{isRtl ? 'كود الطالب' : 'Student Code'}</th>
                      <th className="p-3.5">{isRtl ? 'اسم الطالب' : 'Student Name'}</th>
                      <th className="p-3.5">{isRtl ? 'وقت الدخول' : 'Check-in Time'}</th>
                      <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {mockStudents.map(st => (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-400">{st.code}</td>
                        <td className="p-3.5 font-bold text-slate-900">{st.name}</td>
                        <td className="p-3.5 text-slate-500" dir="ltr">{st.time}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                            st.status === 'present' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : st.status === 'excused' 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {st.status === 'present' 
                              ? (isRtl ? '✓ حاضر' : 'Present') 
                              : st.status === 'excused' 
                              ? (isRtl ? 'معتذر' : 'Excused') 
                              : (isRtl ? 'غائب' : 'Absent')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <button 
                  onClick={() => alert(isRtl ? 'تم تصدير كشف الحضور بنجاح!' : 'Attendance exported successfully!')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>{isRtl ? 'تصدير الكشف (Excel)' : 'Export Sheet'}</span>
                </button>
                <button 
                  onClick={() => setAttendanceSession(null)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-200"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal 2: Class Details (تفاصيل الحصة) */}
        {detailsSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl p-7 shadow-2xl border border-slate-100 relative space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {isRtl ? 'تفاصيل الحصة والقاعة 📋' : 'Session & Hall Details 📋'}
                  </h3>
                  <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-md inline-block mt-1">
                    {detailsSession.subject} • {detailsSession.grade}
                  </span>
                </div>
                <button 
                  onClick={() => setDetailsSession(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Details Grid */}
              <div className="space-y-3.5 text-xs">
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500 font-bold">{isRtl ? 'المعلم المحاضر:' : 'Instructor:'}</span>
                  <span className="font-bold text-slate-900 text-sm">{detailsSession.teacherName}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500 font-bold">{isRtl ? 'القاعة المحجوزة:' : 'Assigned Hall:'}</span>
                  <span className="font-bold text-indigo-600 text-sm">{detailsSession.hallName} (سعة {detailsSession.hallCapacity})</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500 font-bold">{isRtl ? 'الموعد المحدد:' : 'Timing:'}</span>
                  <span className="font-bold text-slate-800" dir="ltr">{detailsSession.day} • {detailsSession.startTime} - {detailsSession.endTime}</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? 'سعر التذكرة / نصيب السنتر:' : 'Ticket / Center Cut:'}</span>
                  </div>
                  <span className="font-black text-emerald-700 text-sm">
                    {detailsSession.ticketPrice || 150} ج.م / تذكرة (20% للسنتر)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>{isRtl ? 'تجهيزات القاعة المجهزة:' : 'Hall Equipment:'}</span>
                  </div>
                  <span className="font-bold text-slate-700">تكييف مركزي ✓ • شاشة ذكية ✓</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => {
                    alert(isRtl ? 'تم فتح خيار تعديل القاعة أو الموعد' : 'Modify room/time option opened');
                    setDetailsSession(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  {isRtl ? 'تعديل القاعة' : 'Change Hall'}
                </button>
                <button 
                  onClick={() => setDetailsSession(null)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200"
                >
                  {isRtl ? 'تم' : 'Done'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
