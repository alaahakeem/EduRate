import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, MapPin, Plus, 
  Trash2, Edit2, Save, Sparkles, CheckCircle2, Wallet, X
} from 'lucide-react';

interface Hall {
  id: number;
  name: string;
  capacity: number;
  hourlyRate: number;
  hasSmartScreen: boolean;
  isAirConditioned: boolean;
}

export default function CenterSettings() {
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const [activeTab, setActiveTab] = useState<'general' | 'halls' | 'payouts'>('halls');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Center Info State with initial fallback or localStorage
  const [centerName, setCenterName] = useState(isRtl ? 'سنتر الأوائل التعليمي' : 'Al-Awa2el Educational Center');
  const [address, setAddress] = useState(isRtl ? 'شارع التحرير، الدقي، الجيزة' : 'Tahrir St, Dokki, Giza');
  const [phone, setPhone] = useState('01099887766');
  const [email, setEmail] = useState('contact@alawa2el-center.com');
  const [description, setDescription] = useState(
    isRtl 
      ? 'مركز تعليمي مجهز بأحدث وسائل الشاشات التفاعلية والتكييف المركزي لخدمة طلاب المرحلتين الإعدادية والثانوية.'
      : 'Modern educational facility equipped with smart interactive screens and central AC.'
  );

  // Halls State
  const defaultHalls: Hall[] = [
    { id: 1, name: isRtl ? 'قاعة 1 (الرئيسية الكبرى)' : 'Hall 1 (Grand Hall)', capacity: 100, hourlyRate: 350, hasSmartScreen: true, isAirConditioned: true },
    { id: 2, name: isRtl ? 'قاعة 2 (المتوسطة)' : 'Hall 2 (Medium Hall)', capacity: 50, hourlyRate: 200, hasSmartScreen: true, isAirConditioned: true },
    { id: 3, name: isRtl ? 'قاعة 3 (VIP للمجموعات الخاصة)' : 'Hall 3 (VIP Private Groups)', capacity: 25, hourlyRate: 150, hasSmartScreen: false, isAirConditioned: true },
  ];

  const [halls, setHalls] = useState<Hall[]>(() => {
    const saved = localStorage.getItem('edurate_center_halls');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultHalls;
      }
    }
    return defaultHalls;
  });

  // Payouts State
  const [walletType, setWalletType] = useState('vodafone');
  const [walletNumber, setWalletNumber] = useState('01099887766');
  const [bankIban, setBankIban] = useState('EG380002000100000012345678901');

  // Modal State for Adding/Editing Hall
  const [isHallModalOpen, setIsHallModalOpen] = useState(false);
  const [editingHallId, setEditingHallId] = useState<number | null>(null);
  const [hallFormName, setHallFormName] = useState('');
  const [hallFormCapacity, setHallFormCapacity] = useState(50);
  const [hallFormHourlyRate, setHallFormHourlyRate] = useState(200);
  const [hallFormAirConditioned, setHallFormAirConditioned] = useState(true);
  const [hallFormSmartScreen, setHallFormSmartScreen] = useState(true);

  // Load General profile from localStorage if exists
  useEffect(() => {
    const savedProfile = localStorage.getItem('edurate_center_profile');
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        if (p.centerName) setCenterName(p.centerName);
        if (p.phone) setPhone(p.phone);
        if (p.email) setEmail(p.email);
        if (p.address) setAddress(p.address);
        if (p.description) setDescription(p.description);
        if (p.walletType) setWalletType(p.walletType);
        if (p.walletNumber) setWalletNumber(p.walletNumber);
        if (p.bankIban) setBankIban(p.bankIban);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save changes to localStorage permanently
  const handleSaveAll = () => {
    // Save Halls
    localStorage.setItem('edurate_center_halls', JSON.stringify(halls));

    // Save Profile
    const profile = {
      centerName,
      phone,
      email,
      address,
      description,
      walletType,
      walletNumber,
      bankIban,
    };
    localStorage.setItem('edurate_center_profile', JSON.stringify(profile));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Open Modal to Add
  const handleOpenAddModal = () => {
    setEditingHallId(null);
    setHallFormName(isRtl ? `قاعة جديدة ${halls.length + 1}` : `New Hall ${halls.length + 1}`);
    setHallFormCapacity(40);
    setHallFormHourlyRate(200);
    setHallFormAirConditioned(true);
    setHallFormSmartScreen(true);
    setIsHallModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEditModal = (hall: Hall) => {
    setEditingHallId(hall.id);
    setHallFormName(hall.name);
    setHallFormCapacity(hall.capacity);
    setHallFormHourlyRate(hall.hourlyRate);
    setHallFormAirConditioned(hall.isAirConditioned);
    setHallFormSmartScreen(hall.hasSmartScreen);
    setIsHallModalOpen(true);
  };

  // Submit Hall Form (Add or Edit)
  const handleSaveHallForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallFormName.trim()) {
      alert(isRtl ? 'يرجى إدخال اسم القاعة' : 'Please enter hall name');
      return;
    }

    let updatedHalls: Hall[];
    if (editingHallId !== null) {
      // Editing
      updatedHalls = halls.map(h => {
        if (h.id === editingHallId) {
          return {
            ...h,
            name: hallFormName,
            capacity: Number(hallFormCapacity),
            hourlyRate: Number(hallFormHourlyRate),
            isAirConditioned: hallFormAirConditioned,
            hasSmartScreen: hallFormSmartScreen,
          };
        }
        return h;
      });
    } else {
      // Adding new
      const newHall: Hall = {
        id: Date.now(),
        name: hallFormName,
        capacity: Number(hallFormCapacity),
        hourlyRate: Number(hallFormHourlyRate),
        isAirConditioned: hallFormAirConditioned,
        hasSmartScreen: hallFormSmartScreen,
      };
      updatedHalls = [...halls, newHall];
    }

    setHalls(updatedHalls);
    localStorage.setItem('edurate_center_halls', JSON.stringify(updatedHalls));
    setIsHallModalOpen(false);

    // Trigger quick toast
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Delete Hall
  const handleDeleteHall = (id: number) => {
    if (confirm(isRtl ? 'هل أنت متأكد من حذف هذه القاعة؟' : 'Are you sure you want to delete this hall?')) {
      const updatedHalls = halls.filter(h => h.id !== id);
      setHalls(updatedHalls);
      localStorage.setItem('edurate_center_halls', JSON.stringify(updatedHalls));
    }
  };

  return (
    <DashboardLayout role="center">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'إدارة ملف السنتر والقاعات' : 'Center Profile & Halls Settings'}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">
              {isRtl ? 'إعدادات السنتر 🏢' : 'Center Settings 🏢'}
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              {isRtl 
                ? 'تعديل بيانات المركز، إضافة وتعديل القاعات وأسعارها، وتحديث الحساب المالي.'
                : 'Manage center information, add and edit halls with rates, and payout accounts.'}
            </p>
          </div>

          <button 
            onClick={handleSaveAll}
            className="relative z-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            {isRtl ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-bold text-sm animate-in fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{isRtl ? 'تم حفظ كافة التعديلات والقاعات بنجاح وستظل محفوظة!' : 'All changes and halls saved successfully!'}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 min-w-[130px] py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'general' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isRtl ? 'البيانات الأساسية' : 'General Info'}</span>
          </button>
          <button
            onClick={() => setActiveTab('halls')}
            className={`flex-1 min-w-[130px] py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'halls' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{isRtl ? `إدارة القاعات (${halls.length})` : `Halls (${halls.length})`}</span>
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex-1 min-w-[130px] py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'payouts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{isRtl ? 'الحساب المالي والسحب' : 'Payout Accounts'}</span>
          </button>
        </div>

        {/* Tab 1: General Info */}
        {activeTab === 'general' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              {isRtl ? 'بيانات المركز والظهور للطلاب والمعلمين' : 'Public Profile & Visibility'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  {isRtl ? 'اسم السنتر' : 'Center Name'}
                </label>
                <input 
                  type="text" 
                  value={centerName} 
                  onChange={e => setCenterName(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  {isRtl ? 'رقم هاتف التواصل والواتساب' : 'Phone & WhatsApp'}
                </label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  {isRtl ? 'البريد الإلكتروني للإدارة' : 'Admin Email'}
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  {isRtl ? 'العنوان التفصيلي' : 'Address'}
                </label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  {isRtl ? 'نبذة عن المركز وتجهيزاته' : 'About Facilities & Description'}
                </label>
                <textarea 
                  rows={4}
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Halls Management */}
        {activeTab === 'halls' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{isRtl ? 'قاعات المركز' : 'Center Halls'}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRtl ? 'القاعات المتاحة للمعلمين لحجزها داخل السنتر مع الأسعار والتجهيزات' : 'Available halls for teachers to book with capacities and rates'}
                </p>
              </div>
              <button 
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {isRtl ? 'إضافة قاعة جديدة' : 'Add New Hall'}
              </button>
            </div>

            <div className="space-y-4">
              {halls.map(hall => (
                <div key={hall.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{hall.name}</h3>
                    <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                      <span>{isRtl ? `سعة: ${hall.capacity} طالب` : `Capacity: ${hall.capacity}`}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {isRtl ? `سعر الساعة: ${hall.hourlyRate} ج.م` : `Rate: ${hall.hourlyRate} EGP/hr`}
                      </span>
                      <span>•</span>
                      <span className={hall.isAirConditioned ? 'text-indigo-600 font-bold' : ''}>
                        {hall.isAirConditioned ? (isRtl ? '✓ تكييف مركزي' : '✓ Central AC') : (isRtl ? 'بدون تكييف' : 'No AC')}
                      </span>
                      <span>•</span>
                      <span className={hall.hasSmartScreen ? 'text-emerald-600 font-bold' : ''}>
                        {hall.hasSmartScreen ? (isRtl ? '✓ شاشة ذكية' : '✓ Smart Screen') : (isRtl ? 'سبورة عادية' : 'Whiteboard')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenEditModal(hall)}
                      title={isRtl ? 'تعديل القاعة' : 'Edit Hall'}
                      className="p-2.5 text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteHall(hall.id)}
                      title={isRtl ? 'حذف القاعة' : 'Delete Hall'}
                      className="p-2.5 text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Payouts */}
        {activeTab === 'payouts' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              {isRtl ? 'طرق استلام المستحقات المالية' : 'Payout Accounts & Withdrawal'}
            </h2>

            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  {isRtl ? 'طريقة التحويل المفضلة' : 'Preferred Method'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setWalletType('vodafone')}
                    className={`p-4 rounded-2xl border text-sm font-bold transition-all text-center ${
                      walletType === 'vodafone' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {isRtl ? 'محفظة إلكترونية (فودافون كاش / إنستاباي)' : 'E-Wallet (Vodafone / InstaPay)'}
                  </button>
                  <button
                    onClick={() => setWalletType('bank')}
                    className={`p-4 rounded-2xl border text-sm font-bold transition-all text-center ${
                      walletType === 'bank' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {isRtl ? 'تحويل بنكي مباشر (IBAN)' : 'Bank Transfer (IBAN)'}
                  </button>
                </div>
              </div>

              {walletType === 'vodafone' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">
                    {isRtl ? 'رقم المحفظة / InstaPay Address' : 'Wallet Number / InstaPay IPA'}
                  </label>
                  <input 
                    type="text" 
                    value={walletNumber} 
                    onChange={e => setWalletNumber(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">
                    {isRtl ? 'رقم الآيبان البنكي (IBAN)' : 'Bank IBAN'}
                  </label>
                  <input 
                    type="text" 
                    value={bankIban} 
                    onChange={e => setBankIban(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Adding / Editing Hall */}
        {isHallModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl p-7 shadow-2xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-900">
                  {editingHallId !== null 
                    ? (isRtl ? 'تعديل بيانات القاعة ✏️' : 'Edit Hall Details ✏️')
                    : (isRtl ? 'إضافة قاعة جديدة ➕' : 'Add New Hall ➕')}
                </h3>
                <button 
                  onClick={() => setIsHallModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveHallForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    {isRtl ? 'اسم القاعة' : 'Hall Name'}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder={isRtl ? "مثال: قاعة 4 (المكيفة)" : "e.g. Hall 4 (Air conditioned)"}
                    value={hallFormName}
                    onChange={e => setHallFormName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      {isRtl ? 'سعة القاعة (طالب)' : 'Capacity (Students)'}
                    </label>
                    <input 
                      type="number" 
                      min="5"
                      max="500"
                      required
                      value={hallFormCapacity}
                      onChange={e => setHallFormCapacity(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      {isRtl ? 'سعر الساعة (ج.م)' : 'Hourly Rate (EGP)'}
                    </label>
                    <input 
                      type="number" 
                      min="50"
                      max="5000"
                      required
                      value={hallFormHourlyRate}
                      onChange={e => setHallFormHourlyRate(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Features Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="block text-xs font-bold text-slate-500 mb-1">
                    {isRtl ? 'تجهيزات القاعة:' : 'Equipment & Features:'}
                  </span>
                  
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={hallFormAirConditioned} 
                      onChange={e => setHallFormAirConditioned(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      {isRtl ? 'يوجد تكييف مركزي' : 'Central Air Conditioning'}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={hallFormSmartScreen} 
                      onChange={e => setHallFormSmartScreen(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      {isRtl ? 'يوجد شاشة عرض ذكية / تفاعلية' : 'Interactive Smart Screen / Projector'}
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsHallModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200"
                  >
                    {editingHallId !== null 
                      ? (isRtl ? 'حفظ تعديلات القاعة' : 'Save Changes')
                      : (isRtl ? 'إضافة القاعة الآن' : 'Add Hall Now')}
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
