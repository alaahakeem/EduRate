import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { Download, Filter, Users, BookOpen, Loader2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const growthData = [
  { name: 'Jan', users: 4000 },
  { name: 'Feb', users: 5500 },
  { name: 'Mar', users: 4500 },
  { name: 'Apr', users: 7000 },
  { name: 'May', users: 6500 },
  { name: 'Jun', users: 8500 },
];

const salesData = [
  { name: 'Jan', sales: 30000 },
  { name: 'Feb', sales: 45000 },
  { name: 'Mar', sales: 60000 },
  { name: 'Apr', sales: 50000 },
  { name: 'May', sales: 75000 },
  { name: 'Jun', sales: 90000 },
];

export default function AdminReports() {
  const { t, dir } = useLanguage();
  const [loadingExport, setLoadingExport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const handleExport = () => {
    setLoadingExport(true);
    setTimeout(() => {
      const headers = dir === 'rtl' ? ['الشهر', 'المستخدمين', 'المبيعات'] : ['Month', 'Users', 'Sales'];
      const csvContent = [
        headers.join(','),
        ...growthData.map((g, i) => `${g.name},${g.users},${salesData[i].sales}`)
      ].join('\n');
      
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `edurate_analytical_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoadingExport(false);
    }, 800);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-5 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'التقارير التحليلية' : 'Analytical Reports'}</h1>
            <p className="text-sm text-slate-500 mt-1">{dir === 'rtl' ? 'إحصائيات الأداء ونمو المنصة' : 'Performance statistics and platform growth'}</p>
          </div>
          
          <div className="flex gap-2 z-50 w-full sm:w-auto relative">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <Filter className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {dir === 'rtl' ? 'تصفية' : 'Filter'}
            </button>
            
            {showFilter && (
              <div className={`absolute top-full mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-50 ${dir === 'rtl' ? 'right-0' : 'left-0'}`}>
                <p className="text-xs font-bold text-slate-400 mb-2">{dir === 'rtl' ? 'اختر السنة' : 'Select Year'}</p>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500">
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>
            )}

            <button 
              onClick={handleExport}
              disabled={loadingExport}
              className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              {loadingExport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />}
              <span className={loadingExport ? (dir === 'rtl' ? 'mr-2' : 'ml-2') : ''}>
                {loadingExport ? (dir === 'rtl' ? 'جاري...' : 'Exporting...') : (dir === 'rtl' ? 'تصدير' : 'Export')}
              </span>
            </button>
          </div>
        </div>

        {/* Charts UI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">{dir === 'rtl' ? 'نمو المستخدمين (آخر 6 أشهر)' : 'User Growth (Last 6 Months)'}</h3>
            </div>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">{dir === 'rtl' ? 'حجم المبيعات' : 'Sales Volume'}</h3>
            </div>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                  <RechartsTooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800">{dir === 'rtl' ? 'أفضل المعلمين أداءً' : 'Top Performing Teachers'}</h3>
            </div>
            <div className="p-4">
              {[
                { name: 'أ. محمود حمدي', students: 120, rating: 4.9 },
                { name: 'د. سارة خالد', students: 95, rating: 4.8 },
                { name: 'م. يوسف النجار', students: 80, rating: 4.7 }
              ].map((teacher, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{i+1}</div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{teacher.name}</p>
                      <p className="text-xs text-slate-500">{teacher.students} {dir === 'rtl' ? 'طالب' : 'Students'}</p>
                    </div>
                  </div>
                  <div className="font-black text-sm text-amber-500 flex items-center gap-1">
                    ★ {teacher.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800">{dir === 'rtl' ? 'المواد الأكثر طلباً' : 'Most Popular Subjects'}</h3>
            </div>
            <div className="p-4">
              {[
                { name: 'الفيزياء', bookings: 350 },
                { name: 'الرياضيات', bookings: 280 },
                { name: 'اللغة الإنجليزية', bookings: 210 }
              ].map((subject, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <p className="font-bold text-sm text-slate-800">{subject.name}</p>
                  </div>
                  <div className="font-black text-sm text-slate-600">
                    {subject.bookings} {dir === 'rtl' ? 'حجز' : 'Bookings'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
