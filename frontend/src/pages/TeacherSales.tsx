import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { DollarSign, Loader2, TrendingUp, CreditCard, ArrowUpRight, BarChart3, Wallet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function TeacherSales() {
  const { t, dir } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/teachers/my-stats'),
          api.get('/teachers/my-bookings').catch(() => ({ data: [] }))
        ]);
        setStats(statsRes.data);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error("Error fetching sales data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'المبيعات والأرباح' : 'Sales & Revenue'}</h1>
              <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'متابعة أرباحك ومدفوعات الطلاب' : 'Track your earnings and student payments'}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Wallet className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <p className="text-emerald-100 font-bold mb-1">{dir === 'rtl' ? 'إجمالي الأرباح' : 'Total Revenue'}</p>
                  <h3 className="text-4xl font-black mb-4">{stats?.totalRevenue || 0} {t('currency')}</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-md">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {dir === 'rtl' ? 'مدفوعات مؤكدة' : 'Confirmed Payments'}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <p className="text-slate-500 font-bold text-sm mb-1">{dir === 'rtl' ? 'عدد الحجوزات' : 'Total Bookings'}</p>
                <h3 className="text-2xl font-black text-slate-800">{stats?.totalBookings || 0}</h3>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-slate-500 font-bold text-sm mb-1">{dir === 'rtl' ? 'متوسط سعر الحصة' : 'Average Class Price'}</p>
                <h3 className="text-2xl font-black text-slate-800">
                  {stats?.totalBookings > 0 
                    ? (stats.totalRevenue / stats.totalBookings).toFixed(0) 
                    : 0} {t('currency')}
                </h3>
              </div>

            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-black text-slate-800 mb-6">{dir === 'rtl' ? 'أحدث العمليات' : 'Recent Transactions'}</h3>
              
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{booking.sessionTitle || (dir === 'rtl' ? 'حصة مباعة' : 'Class Sold')}</p>
                          <p className="text-sm text-slate-500">{booking.studentName} • {new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-emerald-600 font-black text-lg bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-center">
                        +{booking.price} {t('currency')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <h3 className="text-slate-700 font-bold">{dir === 'rtl' ? 'لا توجد أرباح بعد' : 'No revenue yet'}</h3>
                  <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'ستظهر هنا أرباحك عندما يحجز الطلاب حصصك' : 'Your earnings will appear here when students book classes'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
