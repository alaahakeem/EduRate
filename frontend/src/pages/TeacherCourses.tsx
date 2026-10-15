import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen, Plus, Calendar, MapPin, Clock, Edit2, Trash2, X, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function TeacherCourses() {
  const { t, dir } = useLanguage();
  const { profileId, logout } = useAuth();
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [educationalStage, setEducationalStage] = useState('');
  const [grade, setGrade] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [centerId, setCenterId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Dropdown State
  const [isStageOpen, setIsStageOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isCenterOpen, setIsCenterOpen] = useState(false);

  const stages = [
    { value: 'primary', label: dir === 'rtl' ? 'المرحلة الابتدائية' : 'Primary Stage' },
    { value: 'preparatory', label: dir === 'rtl' ? 'المرحلة الإعدادية' : 'Preparatory Stage' },
    { value: 'secondary', label: dir === 'rtl' ? 'المرحلة الثانوية' : 'Secondary Stage' },
    { value: 'university', label: dir === 'rtl' ? 'المرحلة الجامعية' : 'University' }
  ];

  const getGradesForStage = (stage: string) => {
    if (stage === 'primary') return [
      { value: '1', label: dir === 'rtl' ? 'الصف الأول' : '1st Grade' },
      { value: '2', label: dir === 'rtl' ? 'الصف الثاني' : '2nd Grade' },
      { value: '3', label: dir === 'rtl' ? 'الصف الثالث' : '3rd Grade' },
      { value: '4', label: dir === 'rtl' ? 'الصف الرابع' : '4th Grade' },
      { value: '5', label: dir === 'rtl' ? 'الصف الخامس' : '5th Grade' },
      { value: '6', label: dir === 'rtl' ? 'الصف السادس' : '6th Grade' },
    ];
    if (stage === 'preparatory') return [
      { value: '1', label: dir === 'rtl' ? 'الصف الأول' : '1st Grade' },
      { value: '2', label: dir === 'rtl' ? 'الصف الثاني' : '2nd Grade' },
      { value: '3', label: dir === 'rtl' ? 'الصف الثالث' : '3rd Grade' },
    ];
    if (stage === 'secondary') return [
      { value: '1', label: dir === 'rtl' ? 'الصف الأول' : '1st Grade' },
      { value: '2', label: dir === 'rtl' ? 'الصف الثاني' : '2nd Grade' },
      { value: '3', label: dir === 'rtl' ? 'الصف الثالث' : '3rd Grade' },
    ];
    return [];
  };

  const currentGrades = getGradesForStage(educationalStage);

  const fetchMySessions = async () => {
    try {
      const res = await api.get('/sessions/my-sessions');
      setSessions(res.data || []);
    } catch (err) {
      console.error("Error fetching sessions", err);
    }
  };

  const fetchCenters = async () => {
    try {
      const res = await api.get('/centers');
      setCenters(res.data || []);
    } catch (err) {
      console.error("Error fetching centers", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchMySessions();
      await fetchCenters();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileId === '0' || !profileId) {
      alert(dir === 'rtl' ? 'حسابك يحتاج إلى إعادة تسجيل الدخول لتحديث البيانات.' : 'Your account needs to re-login to sync data.');
      logout();
      navigate('/login');
      return;
    }

    if (!title || !educationalStage || !price || !startDate || !startTime || !endDate || !endTime || !centerId) return;

    // Validate grade if stage has grades
    if (currentGrades.length > 0 && !grade) {
      alert(dir === 'rtl' ? 'يرجى اختيار الصف الدراسي' : 'Please select a grade');
      return;
    }

    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${startDate}T${startTime}:00`).toISOString();
      const endDateTime = new Date(`${endDate}T${endTime}:00`).toISOString();

      // Combine Stage and Grade for Backend
      const stageLabel = stages.find(s => s.value === educationalStage)?.label || educationalStage;
      const gradeLabel = currentGrades.find(g => g.value === grade)?.label || '';
      const combinedStage = gradeLabel ? `${stageLabel} - ${gradeLabel}` : stageLabel;

      await api.post('/sessions', {
        title,
        educationalStage: combinedStage,
        price: parseFloat(price),
        startTime: startDateTime,
        endTime: endDateTime,
        centerId: parseInt(centerId)
      });
      
      setIsModalOpen(false);
      resetForm();
      fetchMySessions();
    } catch (err: any) {
      console.error("Failed to create session", err);
      const backendError = err.response?.data;
      if (typeof backendError === 'string') {
        alert(backendError);
      } else {
        alert("حدث خطأ أثناء الإنشاء، تأكد من أن الوقت صحيح ولا يتعارض مع حصة أخرى.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setEducationalStage('');
    setGrade('');
    setPrice('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setCenterId('');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(dir === 'rtl' ? 'هل أنت متأكد من إلغاء هذه الحصة؟ سيتم استرداد الأموال للطلاب.' : 'Are you sure you want to cancel this class? Students will be refunded.')) {
      try {
        await api.delete(`/sessions/${id}`);
        fetchMySessions();
      } catch (err) {
        console.error("Error deleting session", err);
      }
    }
  };

  // If the profile ID is broken, show a big warning instead of the normal UI
  if (profileId === '0') {
    return (
      <DashboardLayout role="teacher">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <h2 className="text-xl font-bold text-red-700">{dir === 'rtl' ? 'نظام الحسابات معلق!' : 'Account System Suspended!'}</h2>
          <p className="text-red-600 max-w-md">
            {dir === 'rtl' 
              ? 'حسابك القديم يحتوي على بيانات غير متزامنة مع السيرفر. برجاء تسجيل الخروج تماماً وإنشاء حساب معلم جديد بإيميل مختلف لحل المشكلة نهائياً.' 
              : 'Your old account is out of sync. Please log out completely and create a new teacher account with a different email.'}
          </p>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="mt-4 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
          >
            {dir === 'rtl' ? 'تسجيل الخروج الآن' : 'Logout Now'}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{t('my_courses')}</h1>
              <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'إدارة حصصك وكورساتك الحالية' : 'Manage your current classes and courses'}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {dir === 'rtl' ? 'حصة جديدة' : 'New Class'}
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : (
          /* Grid of Sessions */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-md text-xs font-bold ${
                    session.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {session.status === 'Available' ? (dir === 'rtl' ? 'متاح للحجز' : 'Available') : (dir === 'rtl' ? 'ملغي' : 'Cancelled')}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(session.id)} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight">{session.title}</h3>
                
                <div className="space-y-3 mt-4 flex-1">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className={`w-4 h-4 text-violet-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                    <span>{new Date(session.startTime).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US')}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className={`w-4 h-4 text-violet-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                    <span dir="ltr">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className={`w-4 h-4 text-emerald-400 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                    <span>{session.centerName}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{session.educationalStage}</span>
                  <span className="text-lg font-black text-violet-600">{session.price} {t('currency')}</span>
                </div>
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'لا توجد كورسات أو حصص بعد' : 'No courses or classes yet'}</h3>
                <p className="text-slate-500 max-w-sm">{dir === 'rtl' ? 'اضغط على زر "حصة جديدة" للبدء في جدولة أول حصة لك واستقبال الطلاب.' : 'Click "New Class" to schedule your first session and welcome students.'}</p>
              </div>
            )}
          </div>
        )}

        {/* Modern Modal for New Session */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'جدولة حصة جديدة' : 'Schedule New Class'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <form id="sessionForm" onSubmit={handleCreateSession} className="space-y-6">
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'عنوان الحصة' : 'Class Title'}</label>
                    <input 
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder={dir === 'rtl' ? 'مثال: مراجعة ليلة الامتحان فيزياء' : 'e.g. Physics Final Review'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>

                  {/* Stage & Center (Custom Selects) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'المرحلة الدراسية' : 'Educational Stage'}</label>
                      <button
                        type="button"
                        onClick={() => { setIsStageOpen(!isStageOpen); setIsCenterOpen(false); setIsGradeOpen(false); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                      >
                        <span className="font-medium text-slate-700">{stages.find(s => s.value === educationalStage)?.label || (dir === 'rtl' ? 'اختر المرحلة' : 'Select Stage')}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isStageOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isStageOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20 p-1">
                          {stages.map(stage => (
                            <button
                              key={stage.value}
                              type="button"
                              onClick={() => { 
                                setEducationalStage(stage.value); 
                                setGrade(''); // Reset grade when stage changes
                                setIsStageOpen(false); 
                              }}
                              className={`w-full text-right px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center ${educationalStage === stage.value ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              {stage.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'السنتر (المكان)' : 'Center (Location)'}</label>
                      <button
                        type="button"
                        onClick={() => { setIsCenterOpen(!isCenterOpen); setIsStageOpen(false); setIsGradeOpen(false); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                      >
                        <span className="font-medium text-slate-700">{centers.find(c => c.id.toString() === centerId)?.name || (dir === 'rtl' ? 'اختر السنتر' : 'Select Center')}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isCenterOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isCenterOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20 p-1 max-h-60 overflow-y-auto">
                          {centers.length > 0 ? centers.map(center => (
                            <button
                              key={center.id}
                              type="button"
                              onClick={() => { setCenterId(center.id.toString()); setIsCenterOpen(false); }}
                              className={`w-full text-right px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${centerId === center.id.toString() ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              <span>{center.name}</span>
                              <span className="text-xs text-slate-400">{center.governorate}</span>
                            </button>
                          )) : (
                            <div className="p-4 text-center text-sm text-slate-500">{dir === 'rtl' ? 'لا يوجد سناتر متاحة' : 'No centers available'}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grade Dropdown (Only shows if stage has grades) */}
                  {currentGrades.length > 0 && (
                    <div className="relative animate-in fade-in slide-in-from-top-4 duration-300">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'الصف الدراسي' : 'Grade / Year'}</label>
                      <button
                        type="button"
                        onClick={() => { setIsGradeOpen(!isGradeOpen); setIsStageOpen(false); setIsCenterOpen(false); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                      >
                        <span className="font-medium text-slate-700">{currentGrades.find(g => g.value === grade)?.label || (dir === 'rtl' ? 'اختر الصف' : 'Select Grade')}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isGradeOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isGradeOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20 p-1">
                          {currentGrades.map(g => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => { setGrade(g.value); setIsGradeOpen(false); }}
                              className={`w-full text-right px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center ${grade === g.value ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'سعر الحصة' : 'Class Price'}</label>
                    <div className="relative">
                      <input 
                        type="number"
                        required
                        min="0"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="150"
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium ${dir === 'rtl' ? 'pl-16' : 'pr-16'}`}
                      />
                      <div className={`absolute top-0 bottom-0 ${dir === 'rtl' ? 'left-0 border-r' : 'right-0 border-l'} border-slate-200 flex items-center justify-center px-4 bg-slate-100 text-slate-500 font-bold rounded-l-xl`}>
                        {t('currency')}
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
                      <Clock className={`w-4 h-4 text-violet-500 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                      {dir === 'rtl' ? 'موعد الحصة' : 'Class Timing'}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">{dir === 'rtl' ? 'يوم وتاريخ البدء' : 'Start Date'}</label>
                        <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">{dir === 'rtl' ? 'وقت البدء' : 'Start Time'}</label>
                        <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">{dir === 'rtl' ? 'يوم وتاريخ الانتهاء' : 'End Date'}</label>
                        <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">{dir === 'rtl' ? 'وقت الانتهاء' : 'End Time'}</label>
                        <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              <div className="p-6 md:p-8 border-t border-slate-100 bg-white">
                <button 
                  type="submit" 
                  form="sessionForm"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white rounded-xl py-4 font-black hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (dir === 'rtl' ? 'تأكيد الحصة' : 'Confirm Class')}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
