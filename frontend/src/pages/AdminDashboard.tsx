import DashboardLayout from '../components/DashboardLayout';
import { Users, DollarSign, BookOpen, AlertCircle, ArrowUpRight, CheckCircle2, User as UserIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function AdminDashboard() {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [loadingExport, setLoadingExport] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCenters: 0,
    totalRevenue: 0,
    activeCourses: 0,
    pendingRequests: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [pendingCenters, setPendingCenters] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);
        
        const trxRes = await api.get('/admin/recent-transactions');
        setTransactions(trxRes.data);

        const centersRes = await api.get('/admin/pending-approvals');
        setPendingCenters(centersRes.data);
      } catch (err) {
        console.error('Error fetching admin data', err);
      }
    };
    fetchAdminData();
  }, []);

  const handleExport = () => {
    setLoadingExport(true);
    setTimeout(() => {
      const headers = dir === 'rtl' ? ['رقم العملية', 'الطالب', 'التاريخ', 'المبلغ', 'الحالة'] : ['TRX ID', 'Student', 'Date', 'Amount', 'Status'];
      const csvContent = [
        headers.join(','),
        ...transactions.map((t: any) => `${t.id},${t.studentName},${t.date},${t.amount},${t.status}`)
      ].join('\n');
      
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `edurate_overview_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoadingExport(false);
    }, 800);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        
        {/* Hero Section for Admin */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-slate-900/10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500 opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
                <CheckCircle2 className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'ml-1.5' : 'mr-1.5'}`} />
                {t('system_operational')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('admin_welcome')}</h2>
              <p className="text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">{t('admin_desc')}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={handleExport} disabled={loadingExport} className="bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center text-sm shadow-sm backdrop-blur-md border border-white/10 disabled:opacity-70">
                {loadingExport ? <Loader2 className={"w-4 h-4 animate-spin "} /> : null}{t('export_report')}
              </button>
              <button onClick={() => navigate('/dashboard/admin/users')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center text-sm shadow-sm shadow-blue-900/20">
                {t('review_requests')}
              </button>
            </div>
          </div>
        </div>

        {/* Grid Layout for Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <ArrowUpRight className={`w-3 h-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                12%
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{t('total_users')}</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.totalStudents + stats.totalTeachers + stats.totalCenters}</h3>
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
              <h3 className="text-3xl font-black text-slate-800">{stats.totalRevenue}<span className={`text-sm text-slate-400 font-medium ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`}>{t('currency')}</span></h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{t('active_courses')}</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.activeCourses}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{t('pending_requests')}</p>
              <h3 className="text-3xl font-black text-slate-800">{stats.pendingRequests}</h3>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tables/Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">{t('recent_transactions')}</h3>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">{t('view_all')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="text-slate-500 text-sm border-b border-slate-100">
                    <th className="pb-3 font-medium px-2">{t('trx_id')}</th>
                    <th className="pb-3 font-medium px-2">{t('user')}</th>
                    <th className="pb-3 font-medium px-2">{t('date')}</th>
                    <th className="pb-3 font-medium px-2">{t('amount')}</th>
                    <th className="pb-3 font-medium px-2">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {transactions.map((trx: any, i: number) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-900">{trx.id}</td>
                      <td className="py-3 px-2 text-slate-600">{trx.studentName}</td>
                      <td className="py-3 px-2 text-slate-500">{trx.date}</td>
                      <td className="py-3 px-2 font-bold text-slate-900">{trx.amount} {t('currency')}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold inline-block ${trx.status === 'Success' ? 'text-emerald-700 bg-emerald-50' : trx.status === 'Pending' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'}`}>
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-500">{dir === 'rtl' ? 'لا توجد معاملات بعد' : 'No transactions yet'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">{dir === 'rtl' ? 'طلبات السناتر المعلقة' : 'Pending Centers'}</h3>
            </div>
            <div className="space-y-4">
               {pendingCenters.map((center: any, idx) => (
                <div key={idx} className="flex flex-col p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{center.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{center.location}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-amber-100/50 text-amber-700`}>
                      {center.docStatus}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={async () => {
                        try {
                          await api.post(`/admin/verify-center/${center.id}`);
                          setPendingCenters(prev => prev.filter((c: any) => c.id !== center.id));
                        } catch(err) {}
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-colors">{t('approve')}
                    </button>
                  </div>
                </div>
              ))}
              {pendingCenters.length === 0 && (
                <div className="text-center text-slate-500 py-4 text-sm font-medium">{dir === 'rtl' ? 'لا توجد طلبات معلقة' : 'No pending requests'}</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
