import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { 
  DollarSign, Download, ArrowUpRight, 
  Calendar, CheckCircle2, Clock, Sparkles, Wallet
} from 'lucide-react';

interface FinanceTransaction {
  id: string;
  teacherName: string;
  hallName: string;
  date: string;
  period: 'today' | 'week' | 'month';
  attendanceCount: number;
  totalSessionValue: number;
  centerCut: number;
  status: 'settled' | 'pending';
}

export default function CenterFinance() {
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month'>('month');
  const [withdrawMsg, setWithdrawMsg] = useState('');

  const stats = [
    {
      title: isRtl ? 'إيرادات السنتر (هذا الشهر)' : 'Center Revenue (This Month)',
      value: isRtl ? '42,800 ج.م' : '42,800 EGP',
      change: isRtl ? '+14% عن الشهر السابق' : '+14% vs last month',
      isPositive: true,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: isRtl ? 'الرصيد القابل للسحب' : 'Withdrawable Balance',
      value: isRtl ? '18,500 ج.م' : '18,500 EGP',
      change: isRtl ? 'جاهز للتحويل الفوري' : 'Available for instant payout',
      isPositive: true,
      icon: Wallet,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: isRtl ? 'حجوزات القاعات المؤكدة' : 'Confirmed Hall Bookings',
      value: isRtl ? '68 حصة' : '68 Sessions',
      change: isRtl ? 'معدل إشغال 85%' : '85% occupancy rate',
      isPositive: true,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const transactions: FinanceTransaction[] = [
    {
      id: 'TRX-901',
      teacherName: isRtl ? 'أ. أحمد محمود' : 'Mr. Ahmed Mahmoud',
      hallName: isRtl ? 'قاعة 1 (الرئيسية)' : 'Hall 1 (Main)',
      date: isRtl ? 'اليوم - 12 أكتوبر 2026' : 'Today - Oct 12, 2026',
      period: 'today',
      attendanceCount: 85,
      totalSessionValue: 12750,
      centerCut: 2550,
      status: 'settled',
    },
    {
      id: 'TRX-902',
      teacherName: isRtl ? 'د. سارة خالد' : 'Dr. Sara Khaled',
      hallName: isRtl ? 'قاعة 2 (المتوسطة)' : 'Hall 2 (Medium)',
      date: isRtl ? 'اليوم - 12 أكتوبر 2026' : 'Today - Oct 12, 2026',
      period: 'today',
      attendanceCount: 42,
      totalSessionValue: 8400,
      centerCut: 1680,
      status: 'settled',
    },
    {
      id: 'TRX-903',
      teacherName: isRtl ? 'م. ياسر علي' : 'Eng. Yasser Ali',
      hallName: isRtl ? 'قاعة 1 (الرئيسية)' : 'Hall 1 (Main)',
      date: isRtl ? 'أمس - 11 أكتوبر 2026' : 'Yesterday - Oct 11, 2026',
      period: 'week',
      attendanceCount: 94,
      totalSessionValue: 9400,
      centerCut: 1880,
      status: 'settled',
    },
    {
      id: 'TRX-904',
      teacherName: isRtl ? 'أ. حسام الدين' : 'Mr. Hossam El-Din',
      hallName: isRtl ? 'قاعة 2 (المتوسطة)' : 'Hall 2 (Medium)',
      date: isRtl ? '10 أكتوبر 2026' : 'Oct 10, 2026',
      period: 'week',
      attendanceCount: 48,
      totalSessionValue: 5760,
      centerCut: 1150,
      status: 'settled',
    },
    {
      id: 'TRX-905',
      teacherName: isRtl ? 'أ. طارق عبد الله' : 'Mr. Tarek Abdullah',
      hallName: isRtl ? 'قاعة 3 (VIP)' : 'Hall 3 (VIP)',
      date: isRtl ? '04 أكتوبر 2026' : 'Oct 04, 2026',
      period: 'month',
      attendanceCount: 22,
      totalSessionValue: 3300,
      centerCut: 660,
      status: 'pending',
    },
  ];

  // Filtering transactions based on period
  const filteredTransactions = transactions.filter(trx => {
    if (filterPeriod === 'today') {
      return trx.period === 'today';
    } else if (filterPeriod === 'week') {
      return trx.period === 'today' || trx.period === 'week';
    }
    return true; // month shows all
  });

  const totalFilteredCut = filteredTransactions.reduce((acc, curr) => acc + curr.centerCut, 0);

  const handleExportCSV = () => {
    const headers = isRtl 
      ? ['رقم المعاملة', 'اسم المعلم', 'القاعة', 'التاريخ', 'عدد الحضور', 'إجمالي قيمة الحصة', 'نصيب السنتر', 'الحالة']
      : ['Tx ID', 'Teacher', 'Hall', 'Date', 'Attendance', 'Total Session Value', 'Center Revenue', 'Status'];

    const rows = filteredTransactions.map(t => [
      t.id,
      t.teacherName,
      t.hallName,
      t.date,
      t.attendanceCount,
      `${t.totalSessionValue} EGP`,
      `${t.centerCut} EGP`,
      t.status === 'settled' ? (isRtl ? 'تمت التسوية' : 'Settled') : (isRtl ? 'قيد المعالجة' : 'Pending')
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EduRate_Center_Finance_${filterPeriod}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWithdraw = () => {
    setWithdrawMsg(isRtl ? 'تم إرسال طلب سحب مبلغ 18,500 ج.م إلى حسابك المعتمد بنجاح!' : 'Payout request for 18,500 EGP submitted successfully!');
    setTimeout(() => setWithdrawMsg(''), 4000);
  };

  return (
    <DashboardLayout role="center">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'التقارير المالية والتسويات' : 'Financial Reports & Settlements'}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">
              {isRtl ? 'المالية والأرباح 💰' : 'Finance & Revenue 💰'}
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              {isRtl 
                ? 'متابعة عوائد تأجير القاعات، نسب الحضور، وسحب مستحقات السنتر.'
                : 'Track room booking earnings, attendance revenue share, and payout requests.'}
            </p>
          </div>

          <div className="flex gap-3 relative z-10 w-full md:w-auto">
            <button 
              onClick={handleExportCSV}
              className="flex-1 md:flex-none px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              {isRtl ? 'تصدير إكسيل (CSV)' : 'Export CSV'}
            </button>
            <button 
              onClick={handleWithdraw}
              className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Wallet className="w-4 h-4" />
              {isRtl ? 'طلب سحب الأرباح' : 'Request Payout'}
            </button>
          </div>
        </div>

        {withdrawMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-bold text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{withdrawMsg}</span>
          </div>
        )}

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-slate-400 font-bold text-sm mb-1">{stat.title}</h3>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Settlement Breakdown Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-900">
                  {isRtl ? 'سجل عوائد الحصص والقاعات' : 'Class Revenue & Hall Settlements'}
                </h2>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                  {isRtl ? `إجمالي الفترة: +${totalFilteredCut.toLocaleString()} ج.م` : `Total: +${totalFilteredCut.toLocaleString()} EGP`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isRtl ? 'تفصيل الإيراد المحصل من كل حصة مقامة داخل المركز' : 'Detailed breakdown of center revenue per class hosted'}
              </p>
            </div>
            
            {/* Sleek Modern Segmented Control Filter (Replaced Clunky Native Select) */}
            <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
              <button
                onClick={() => setFilterPeriod('today')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterPeriod === 'today'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-100 scale-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {isRtl ? 'اليوم' : 'Today'}
              </button>
              <button
                onClick={() => setFilterPeriod('week')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterPeriod === 'week'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-100 scale-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {isRtl ? 'هذا الأسبوع' : 'This Week'}
              </button>
              <button
                onClick={() => setFilterPeriod('month')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterPeriod === 'month'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-100 scale-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {isRtl ? 'هذا الشهر' : 'This Month'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-slate-100">
                  <th className="p-4">{isRtl ? 'رقم المعاملة' : 'Transaction ID'}</th>
                  <th className="p-4">{isRtl ? 'المعلم' : 'Teacher'}</th>
                  <th className="p-4">{isRtl ? 'القاعة' : 'Hall'}</th>
                  <th className="p-4">{isRtl ? 'التاريخ' : 'Date'}</th>
                  <th className="p-4">{isRtl ? 'الحضور' : 'Attendance'}</th>
                  <th className="p-4">{isRtl ? 'إجمالي التذاكر' : 'Total Tickets'}</th>
                  <th className="p-4">{isRtl ? 'نصيب السنتر' : 'Center Share'}</th>
                  <th className="p-4">{isRtl ? 'حالة التسوية' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTransactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors animate-in fade-in duration-200">
                    <td className="p-4 font-mono text-xs font-bold text-slate-500">{trx.id}</td>
                    <td className="p-4 font-bold text-slate-900">{trx.teacherName}</td>
                    <td className="p-4 text-xs font-semibold text-slate-600">{trx.hallName}</td>
                    <td className="p-4 text-xs text-slate-500">{trx.date}</td>
                    <td className="p-4 font-bold text-slate-700">
                      {isRtl ? `${trx.attendanceCount} طالب` : `${trx.attendanceCount} students`}
                    </td>
                    <td className="p-4 font-bold text-slate-500">{trx.totalSessionValue.toLocaleString()} {isRtl ? 'ج.م' : 'EGP'}</td>
                    <td className="p-4 font-black text-emerald-600">+{trx.centerCut.toLocaleString()} {isRtl ? 'ج.م' : 'EGP'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                        trx.status === 'settled' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {trx.status === 'settled' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {trx.status === 'settled' ? (isRtl ? 'تمت التسوية' : 'Settled') : (isRtl ? 'قيد المعالجة' : 'Pending')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">
                {isRtl ? 'لا توجد معاملات مالية في هذه الفترة' : 'No financial records found for this period'}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
