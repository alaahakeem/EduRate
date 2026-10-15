import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { Save, Settings, Shield, Globe, Bell, CreditCard, Lock, Users } from 'lucide-react';

export default function AdminSettings() {
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 max-w-4xl">
        
        {/* Header */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500 opacity-5 rounded-full blur-2xl"></div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'إعدادات المنصة' : 'Platform Settings'}</h1>
            <p className="text-sm text-slate-500 mt-1">{dir === 'rtl' ? 'التحكم في القواعد الأساسية للمنصة' : 'Control core platform rules'}</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-70 z-10"
          >
            <Save className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {loading ? (dir === 'rtl' ? 'جاري الحفظ...' : 'Saving...') : (dir === 'rtl' ? 'حفظ التعديلات' : 'Save Changes')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Settings Menu */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm border transition-colors ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'}`}
            >
              <Settings className="w-5 h-5" />
              {dir === 'rtl' ? 'الإعدادات العامة' : 'General'}
            </button>
            <button 
              onClick={() => setActiveTab('commissions')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm border transition-colors ${activeTab === 'commissions' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'}`}
            >
              <CreditCard className="w-5 h-5" />
              {dir === 'rtl' ? 'العمولات والدفع' : 'Commissions & Pay'}
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm border transition-colors ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'}`}
            >
              <Shield className="w-5 h-5" />
              {dir === 'rtl' ? 'الأمان والصلاحيات' : 'Security & Roles'}
            </button>
          </div>

          {/* Settings Form */}
          <div className="md:col-span-2 space-y-6">
            
            {activeTab === 'general' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">{dir === 'rtl' ? 'إعدادات المنصة الأساسية' : 'Core Platform Settings'}</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'اسم المنصة' : 'Platform Name'}</label>
                    <input type="text" defaultValue="EduRate" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'البريد الإلكتروني للدعم' : 'Support Email'}</label>
                    <input type="email" defaultValue="support@edurate.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{dir === 'rtl' ? 'وضع الصيانة' : 'Maintenance Mode'}</p>
                        <p className="text-xs text-slate-500 mt-1">{dir === 'rtl' ? 'إيقاف المنصة مؤقتاً للتحديثات' : 'Temporarily disable the platform for updates'}</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 transition-colors">
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dir === 'rtl' ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{dir === 'rtl' ? 'تفعيل التسجيل الجديد' : 'Enable New Registrations'}</p>
                        <p className="text-xs text-slate-500 mt-1">{dir === 'rtl' ? 'السماح للطلاب والمعلمين الجدد بالتسجيل' : 'Allow new students and teachers to sign up'}</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-indigo-500 transition-colors">
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dir === 'rtl' ? 'translate-x-[-24px] right-1' : 'translate-x-[24px] left-1'}`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commissions' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">{dir === 'rtl' ? 'إعدادات العمولات' : 'Commission Settings'}</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'نسبة عمولة المنصة (%)' : 'Platform Commission Rate (%)'}</label>
                    <input type="number" defaultValue="20" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                    <p className="text-xs text-slate-500 mt-2">{dir === 'rtl' ? 'هذه النسبة يتم خصمها تلقائياً من أرباح المعلمين.' : 'This rate is automatically deducted from teacher earnings.'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'الحد الأدنى للسحب' : 'Minimum Payout Threshold'}</label>
                    <input type="number" defaultValue="500" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">{dir === 'rtl' ? 'الأمان والصلاحيات' : 'Security & Roles'}</h3>
                <div className="space-y-5">
                  <div className="pt-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800 text-sm flex items-center gap-2"><Lock className="w-4 h-4 text-slate-500"/> {dir === 'rtl' ? 'تفعيل التوثيق الثنائي (2FA) للأدمن' : 'Enable 2FA for Admins'}</p>
                        <p className="text-xs text-slate-500 mt-1">{dir === 'rtl' ? 'إلزام جميع المديرين بالتوثيق الثنائي' : 'Force two-factor authentication for admins'}</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-indigo-500 transition-colors">
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dir === 'rtl' ? 'translate-x-[-24px] right-1' : 'translate-x-[24px] left-1'}`}></div>
                      </div>
                    </label>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800 text-sm flex items-center gap-2"><Users className="w-4 h-4 text-slate-500"/> {dir === 'rtl' ? 'التسجيل اليدوي للسناتر' : 'Manual Center Verification'}</p>
                        <p className="text-xs text-slate-500 mt-1">{dir === 'rtl' ? 'مراجعة السناتر يدوياً قبل نشرها على المنصة' : 'Manually review centers before publishing'}</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-indigo-500 transition-colors">
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dir === 'rtl' ? 'translate-x-[-24px] right-1' : 'translate-x-[24px] left-1'}`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
