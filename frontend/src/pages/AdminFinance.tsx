import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { DollarSign, TrendingUp, CreditCard, Download, ArrowUpRight, ArrowDownRight, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function AdminFinance() {
  const { t, dir } = useLanguage();
  const [stats, setStats] = useState({ totalRevenue: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trxRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/recent-transactions')
        ]);
        setStats(statsRes.data);
        setTransactions(trxRes.data);
      } catch (err) {
        console.error("Error fetching finance", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = dir === 'rtl' ? ['رقم العملية', 'الطالب', 'التاريخ', 'المبلغ', 'الحالة'] : ['TRX ID', 'Student', 'Date', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...transactions.map((t: any) => `${t.id},${t.studentName},${t.date},${t.amount},${t.status}`)
    ].join('\n');
    
    // Add BOM for Excel UTF-8 support
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `edurate_finance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-5 rounded-full blur-2xl"></div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'التقارير المالية' : 'Financial Reports'}</h1>
            <p className="text-sm text-slate-500 mt-1">{dir === 'rtl' ? 'نظرة شاملة على الأرباح والمدفوعات' : 'Overview of revenue and payouts'}</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center shadow-sm hover:bg-slate-50 transition-colors z-10"
          >
            <Download className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {dir === 'rtl' ? 'تصدير التقرير' : 'Export Report'}
          </button>
        </div>

        {/* Finance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-400 font-medium mb-1">{dir === 'rtl' ? 'إجمالي الأرباح' : 'Total Revenue'}</p>
              <h3 className="text-4xl font-black">{stats.totalRevenue.toLocaleString()} <span className="text-lg text-slate-500 font-medium">{t('currency')}</span></h3>
              <div className="mt-4 flex items-center text-sm font-bold text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-400/20">
                <TrendingUp className={`w-4 h-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                +14.5% {dir === 'rtl' ? 'عن الشهر الماضي' : 'vs last month'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 font-medium mb-1">{dir === 'rtl' ? 'المدفوعات المتوقعة' : 'Expected Payouts'}</p>
            <h3 className="text-3xl font-black text-slate-800">{(stats.totalRevenue * 0.8).toLocaleString()} <span className="text-sm text-slate-400">{t('currency')}</span></h3>
            <p className="text-xs font-bold text-slate-400 mt-4">{dir === 'rtl' ? 'أرباح المعلمين (80%)' : 'Teachers cut (80%)'}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 font-medium mb-1">{dir === 'rtl' ? 'صافي ربح المنصة' : 'Platform Net Profit'}</p>
            <h3 className="text-3xl font-black text-slate-800">{(stats.totalRevenue * 0.2).toLocaleString()} <span className="text-sm text-slate-400">{t('currency')}</span></h3>
            <p className="text-xs font-bold text-slate-400 mt-4">{dir === 'rtl' ? 'عمولة المنصة (20%)' : 'Platform cut (20%)'}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-800">{dir === 'rtl' ? 'سجل المعاملات الأخير' : 'Recent Transaction Log'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">{dir === 'rtl' ? 'رقم العملية' : 'TRX ID'}</th>
                  <th className="px-6 py-4">{dir === 'rtl' ? 'الطالب' : 'Student'}</th>
                  <th className="px-6 py-4">{dir === 'rtl' ? 'التاريخ' : 'Date'}</th>
                  <th className="px-6 py-4">{dir === 'rtl' ? 'المبلغ' : 'Amount'}</th>
                  <th className="px-6 py-4">{dir === 'rtl' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((trx: any, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{trx.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{trx.studentName}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{trx.date}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900">{trx.amount} {t('currency')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold inline-block ${trx.status === 'Success' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : trx.status === 'Pending' ? 'text-amber-700 bg-amber-50 border border-amber-100' : 'text-red-700 bg-red-50 border border-red-100'}`}>
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                      {dir === 'rtl' ? 'لا توجد معاملات بعد' : 'No transactions yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
