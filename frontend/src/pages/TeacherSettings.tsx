import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Settings, Loader2, Save, User, BookOpen, Video, Briefcase, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function TeacherSettings() {
  const { dir } = useLanguage();
  const { profileId } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [subjectId, setSubjectId] = useState(1); // Default for now
  
  // Custom alerts state
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId || profileId === '0') return;
      try {
        const res = await api.get(`/teachers/${profileId}`);
        const data = res.data;
        setName(data.name || '');
        setBio(data.bio || '');
        setYearsOfExperience(data.yearsOfExperience || 0);
        setDemoVideoUrl(data.demoVideoUrl || '');
        setSubjectId(data.subject?.id || 1);
      } catch (err) {
        console.error("Error fetching teacher profile", err);
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
      await api.put('/teachers/my-profile', {
        name,
        bio,
        yearsOfExperience,
        demoVideoUrl,
        subjectId
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
    <DashboardLayout role="teacher">
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'إعدادات الحساب' : 'Account Settings'}</h1>
            <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'تعديل بياناتك الشخصية والمهنية التي يراها الطلاب' : 'Edit your personal and professional profile visible to students'}</p>
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
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')" }}
            >
              <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] rounded-t-3xl"></div>
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
                      <User className="w-4 h-4 text-violet-500" />
                      {dir === 'rtl' ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Briefcase className="w-4 h-4 text-emerald-500" />
                      {dir === 'rtl' ? 'سنوات الخبرة' : 'Years of Experience'}
                    </label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={yearsOfExperience}
                      onChange={e => setYearsOfExperience(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    {dir === 'rtl' ? 'نبذة عنك (Bio)' : 'Bio / Description'}
                  </label>
                  <textarea 
                    required
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={4}
                    placeholder={dir === 'rtl' ? 'اكتب نبذة جذابة عن طريقة تدريسك ومؤهلاتك...' : 'Write an engaging bio about your teaching style...'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium resize-none"
                  />
                </div>

                {/* Demo Video URL */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Video className="w-4 h-4 text-rose-500" />
                    {dir === 'rtl' ? 'رابط فيديو تعريفي (YouTube)' : 'Demo Video URL (YouTube)'}
                  </label>
                  <input 
                    type="url"
                    value={demoVideoUrl}
                    onChange={e => setDemoVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                  />
                  <p className="text-xs text-slate-400 mt-2">{dir === 'rtl' ? 'ضع رابط فيديو قصير ليتعرف الطلاب على أسلوب شرحك (اختياري).' : 'Add a short video link for students to see your teaching style (optional).'}</p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 flex items-center justify-center min-w-[160px]"
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
