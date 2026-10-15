import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Settings, Loader2, Save, User, MapPin, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function StudentSettings() {
  const { dir } = useLanguage();
  const { profileId } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [educationalStage, setEducationalStage] = useState('Secondary');
  const [governorate, setGovernorate] = useState('');
  const [region, setRegion] = useState('');
  
  // Custom alerts state
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/student/my-profile`);
        const data = res.data;
        setName(data.name || '');
        setEmail(data.email || '');
        setEducationalStage(data.educationalStage || 'Secondary');
        setGovernorate(data.governorate || '');
        setRegion(data.region || '');
      } catch (err) {
        console.error("Error fetching student profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSaving(true);
    
    try {
      await api.put('/student/my-profile', {
        name,
        educationalStage,
        governorate,
        region
      });
      setSuccessMsg(dir === 'rtl' ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error("Failed to update profile", err);
      setErrorMsg(err.response?.data?.title || err.response?.data || (dir === 'rtl' ? 'حدث خطأ أثناء التحديث' : 'Error updating profile'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'إعدادات الحساب' : 'Account Settings'}</h1>
            <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'تعديل بياناتك الشخصية والدراسية' : 'Edit your personal and educational profile'}</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            
            {/* Banner/Avatar Section */}
            <div 
              className="h-40 relative bg-cover bg-center bg-no-repeat rounded-t-3xl"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')" }}
            >
              <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[1px] rounded-t-3xl"></div>
              <div 
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-white p-1 rounded-full shadow-xl cursor-pointer z-10"
                onClick={() => document.getElementById('avatarUpload')?.click()}
              >
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden relative group">
                  <User className="w-10 h-10 text-slate-400" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <input 
                type="file" 
                id="avatarUpload" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    alert(dir === 'rtl' ? 'ميزة رفع الصورة الشخصية قيد التطوير وسيتم تفعيلها قريباً مع السيرفر!' : 'Profile picture upload is under development and will be activated soon!');
                  }
                }}
              />
            </div>

            <div className="pt-20 px-6 pb-6 md:pt-24 md:px-8 md:pb-8">
              
              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-bold flex items-center justify-center animate-in fade-in slide-in-from-top-4">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl font-bold flex items-center justify-center animate-in fade-in slide-in-from-top-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <User className="w-4 h-4 text-indigo-500" />
                      {dir === 'rtl' ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {dir === 'rtl' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input 
                      type="email"
                      disabled
                      value={email}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Governorate */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {dir === 'rtl' ? 'المحافظة' : 'Governorate'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={governorate}
                      onChange={e => setGovernorate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      {dir === 'rtl' ? 'المنطقة' : 'Region'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-black hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 flex items-center justify-center min-w-[160px]"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <Save className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                        {dir === 'rtl' ? 'حفظ التعديلات' : 'Save Changes'}
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
