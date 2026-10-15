import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Calendar, Clock, BookOpen, Loader2, MapPin, Search, Star, CheckCircle, AlertCircle, X, Send, GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function StudentSchedule() {
  const { dir } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review modal state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Toasts
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/student/my-bookings');
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching student schedule", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openReviewModal = (booking: any) => {
    setSelectedBookingForReview(booking);
    setRating(5);
    setHoverRating(0);
    setComment('');
    setIsAnonymous(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    if (!comment.trim()) {
      setToastMsg({
        text: dir === 'rtl' ? 'يرجى كتابة تعليقك على الحصة' : 'Please provide your feedback comment',
        type: 'error'
      });
      setTimeout(() => setToastMsg(null), 4000);
      return;
    }

    setIsSubmittingReview(true);

    try {
      await api.post('/Reviews', {
        sessionId: selectedBookingForReview.sessionId || selectedBookingForReview.bookingId,
        rating,
        comment: comment.trim(),
        isAnonymous
      });

      setSelectedBookingForReview(null);
      setToastMsg({
        text: dir === 'rtl' ? 'تم إرسال تقييمك بنجاح! شكراً لمشاركتك 🌟' : 'Your review was submitted successfully! 🌟',
        type: 'success'
      });
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      console.error("Failed to submit review", err);
      const errMsg = err.response?.data?.message || err.response?.data || (dir === 'rtl' ? 'حدث خطأ أثناء حفظ التقييم' : 'Failed to submit review');
      setToastMsg({
        text: errMsg,
        type: 'error'
      });
      setTimeout(() => setToastMsg(null), 5000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getRatingLabel = (stars: number) => {
    if (dir === 'rtl') {
      switch (stars) {
        case 5: return 'ممتاز جداً 🌟';
        case 4: return 'جيد جداً 👍';
        case 3: return 'جيد 👌';
        case 2: return 'مقبول 😐';
        default: return 'بحاجة لتحسين 👎';
      }
    } else {
      switch (stars) {
        case 5: return 'Excellent 🌟';
        case 4: return 'Very Good 👍';
        case 3: return 'Good 👌';
        case 2: return 'Fair 😐';
        default: return 'Needs Improvement 👎';
      }
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'جدولي الدراسي' : 'My Schedule'}</h1>
              <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'متابعة مواعيد حصصك وتقييم الحصص التي حضرتها' : 'Track your classes and review sessions you attended'}</p>
            </div>
          </div>
          <Link 
            to="/dashboard/student/explore"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center shadow-md hover:shadow-lg active:scale-95"
          >
            <Search className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {dir === 'rtl' ? 'ابحث عن حصص' : 'Find Classes'}
          </Link>
        </div>

        {/* Global Toast */}
        {toastMsg && (
          <div className={`p-4 rounded-xl font-bold flex items-center justify-center shadow-sm animate-in fade-in slide-in-from-top-3 ${
            toastMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {toastMsg.type === 'success' ? (
              <CheckCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            )}
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.length > 0 ? (
              bookings.sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((booking) => {
                const isPast = new Date(booking.startTime) < new Date();
                return (
                  <div key={booking.bookingId} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                          isPast ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {isPast ? (dir === 'rtl' ? 'منتهية' : 'Completed') : (dir === 'rtl' ? 'قادمة' : 'Upcoming')}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {booking.status === 'Confirmed' ? (dir === 'rtl' ? 'مؤكد' : 'Confirmed') : booking.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight">{booking.sessionTitle}</h3>
                      
                      <div className="space-y-2.5 mt-4 text-xs text-slate-600">
                        {booking.teacherName && (
                          <div className="flex items-center">
                            <GraduationCap className={`w-4 h-4 text-indigo-500 ${dir === 'rtl' ? 'ml-2.5' : 'mr-2.5'}`} />
                            <span className="font-bold text-slate-700">{booking.teacherName}</span>
                          </div>
                        )}
                        {booking.centerName && (
                          <div className="flex items-center">
                            <MapPin className={`w-4 h-4 text-rose-500 ${dir === 'rtl' ? 'ml-2.5' : 'mr-2.5'}`} />
                            <span>{booking.centerName}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className={`w-4 h-4 text-emerald-500 ${dir === 'rtl' ? 'ml-2.5' : 'mr-2.5'}`} />
                          <span>{new Date(booking.startTime).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className={`w-4 h-4 text-amber-500 ${dir === 'rtl' ? 'ml-2.5' : 'mr-2.5'}`} />
                          <span dir="ltr">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rate Class Button */}
                    <div className="pt-5 border-t border-slate-100 mt-5">
                      <button 
                        onClick={() => openReviewModal(booking)}
                        className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-200/70 shadow-sm cursor-pointer"
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>{dir === 'rtl' ? '⭐ تقييم الحصة والمعلم' : '⭐ Rate Class & Teacher'}</span>
                      </button>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'لم تقم بحجز أي حصص بعد' : 'No booked classes yet'}</h3>
                <p className="text-slate-500 max-w-sm mb-6">{dir === 'rtl' ? 'استكشف المعلمين والسناتر للحجز في حصصهم القادمة.' : 'Explore teachers and centers to book your upcoming classes.'}</p>
                <Link to="/dashboard/student/explore" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                  {dir === 'rtl' ? 'استكشاف الآن' : 'Explore Now'}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Review Modal */}
        {selectedBookingForReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1.5">
                    {dir === 'rtl' ? 'تقييم الحضور' : 'Attendance Review'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{selectedBookingForReview.sessionTitle}</h3>
                  {selectedBookingForReview.teacherName && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {dir === 'rtl' ? `المعلم: ${selectedBookingForReview.teacherName}` : `Teacher: ${selectedBookingForReview.teacherName}`}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedBookingForReview(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Interactive Stars */}
                <div className="text-center space-y-2 bg-amber-50/40 p-4 rounded-2xl border border-amber-100/60">
                  <span className="text-xs font-bold text-slate-600 block">
                    {dir === 'rtl' ? 'اختر تقييمك للحصة:' : 'Choose your rating:'}
                  </span>
                  
                  <div className="flex justify-center items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star 
                          className={`w-8 h-8 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-black text-amber-800 block">
                    {getRatingLabel(hoverRating || rating)}
                  </span>
                </div>

                {/* Feedback Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">
                    {dir === 'rtl' ? 'رأيك وتجربتك في الحصة:' : 'Your Feedback & Comments:'}
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={dir === 'rtl' ? 'اكتب رأيك بصراحة عن شرح الأستاذ، التنظيم في السنتر، وجودة المادة العلمية...' : 'Share your honest experience about the teacher, hall, and explanations...'}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
                    required
                  />
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <input
                    type="checkbox"
                    id="anonymousCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="anonymousCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    {dir === 'rtl' ? 'نشر التقييم باسم مجهول (حماية الخصوصية)' : 'Post review anonymously'}
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForReview(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingReview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{dir === 'rtl' ? 'إرسال التقييم' : 'Submit Review'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
