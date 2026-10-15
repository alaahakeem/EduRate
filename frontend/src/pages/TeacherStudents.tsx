import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Users, Loader2, Calendar, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function TeacherStudents() {
  const { t, dir } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/teachers/my-bookings');
        setBookings(res.data || []);
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Error fetching students", err);
        }
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'الطلاب والحجوزات' : 'Students & Bookings'}</h1>
              <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'متابعة الطلاب الذين حجزوا حصصك' : 'Track students who booked your classes'}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {bookings.length > 0 ? (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse" dir={dir}>
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className={`py-4 ${dir === 'rtl' ? 'pr-6' : 'pl-6'} font-bold text-sm text-slate-500`}>{dir === 'rtl' ? 'اسم الطالب' : 'Student Name'}</th>
                      <th className="py-4 px-4 font-bold text-sm text-slate-500">{dir === 'rtl' ? 'الحصة' : 'Class Title'}</th>
                      <th className="py-4 px-4 font-bold text-sm text-slate-500">{dir === 'rtl' ? 'المرحلة الدراسية' : 'Educational Stage'}</th>
                      <th className="py-4 px-4 font-bold text-sm text-slate-500">{dir === 'rtl' ? 'تاريخ الحجز' : 'Booking Date'}</th>
                      <th className="py-4 px-4 font-bold text-sm text-slate-500">{dir === 'rtl' ? 'حالة الحجز' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className={`py-4 ${dir === 'rtl' ? 'pr-6' : 'pl-6'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                              {booking.studentName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-800">{booking.studentName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <BookOpen className="w-4 h-4 text-violet-400" />
                            {booking.sessionTitle || '---'}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-sm">
                          {booking.educationalStage || '---'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.bookingDate).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US')}
                            <Clock className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`} />
                            <span dir="ltr">{new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {booking.isConfirmed ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                              <CheckCircle className="w-3.5 h-3.5" />
                              {dir === 'rtl' ? 'مؤكد' : 'Confirmed'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold">
                              <Clock className="w-3.5 h-3.5" />
                              {dir === 'rtl' ? 'قيد الانتظار' : 'Pending'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'لا يوجد طلاب بعد' : 'No students yet'}</h3>
                <p className="text-slate-500 max-w-sm">{dir === 'rtl' ? 'بمجرد أن يقوم الطلاب بحجز حصصك، سيظهرون في هذه القائمة.' : 'Once students book your classes, they will appear in this list.'}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
