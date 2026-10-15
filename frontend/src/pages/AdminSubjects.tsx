import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen, Plus, Search, Edit2, Trash2, Loader2, CheckCircle, AlertCircle, X, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function AdminSubjects() {
  const { dir } = useLanguage();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [educationalStage, setEducationalStage] = useState('Sec3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const stageOptions = [
    { value: 'Primary1', labelAr: 'الصف الأول الابتدائي', labelEn: 'Grade 1 Primary' },
    { value: 'Primary2', labelAr: 'الصف الثاني الابتدائي', labelEn: 'Grade 2 Primary' },
    { value: 'Primary3', labelAr: 'الصف الثالث الابتدائي', labelEn: 'Grade 3 Primary' },
    { value: 'Primary4', labelAr: 'الصف الرابع الابتدائي', labelEn: 'Grade 4 Primary' },
    { value: 'Primary5', labelAr: 'الصف الخامس الابتدائي', labelEn: 'Grade 5 Primary' },
    { value: 'Primary6', labelAr: 'الصف السادس الابتدائي', labelEn: 'Grade 6 Primary' },
    { value: 'Prep1', labelAr: 'الصف الأول الإعدادي', labelEn: 'Grade 1 Preparatory' },
    { value: 'Prep2', labelAr: 'الصف الثاني الإعدادي', labelEn: 'Grade 2 Preparatory' },
    { value: 'Prep3', labelAr: 'الصف الثالث الإعدادي', labelEn: 'Grade 3 Preparatory' },
    { value: 'Sec1', labelAr: 'الصف الأول الثانوي', labelEn: 'Grade 1 Secondary' },
    { value: 'Sec2', labelAr: 'الصف الثاني الثانوي', labelEn: 'Grade 2 Secondary' },
    { value: 'Sec3', labelAr: 'الصف الثالث الثانوي', labelEn: 'Grade 3 Secondary' },
  ];

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/Subjects');
      setSubjects(res.data || []);
    } catch (err) {
      console.error("Failed to load subjects", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openAddModal = () => {
    setEditingSubject(null);
    setName('');
    setEducationalStage('Sec3');
    setIsModalOpen(true);
  };

  const openEditModal = (subject: any) => {
    setEditingSubject(subject);
    setName(subject.name);
    setEducationalStage(subject.educationalStage);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      if (editingSubject) {
        await api.put(`/Subjects/${editingSubject.id}`, {
          name: name.trim(),
          educationalStage
        });
        setToast({
          text: dir === 'rtl' ? 'تم تعديل المادة بنجاح!' : 'Subject updated successfully!',
          type: 'success'
        });
      } else {
        await api.post('/Subjects', {
          name: name.trim(),
          educationalStage
        });
        setToast({
          text: dir === 'rtl' ? 'تمت إضافة المادة بنجاح!' : 'Subject added successfully!',
          type: 'success'
        });
      }

      setIsModalOpen(false);
      fetchSubjects();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data || (dir === 'rtl' ? 'حدث خطأ أثناء الحفظ' : 'Failed to save subject');
      setToast({
        text: errMsg,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(dir === 'rtl' ? 'هل أنت متأكد من حذف هذه المادة؟' : 'Are you sure you want to delete this subject?')) {
      return;
    }

    setDeletingId(id);

    try {
      await api.delete(`/Subjects/${id}`);
      setToast({
        text: dir === 'rtl' ? 'تم حذف المادة بنجاح' : 'Subject deleted successfully',
        type: 'success'
      });
      fetchSubjects();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data || (dir === 'rtl' ? 'لا يمكن حذف المادة لوجود معلمين مرتبطين بها' : 'Cannot delete subject linked to active teachers');
      setToast({
        text: errMsg,
        type: 'error'
      });
    } finally {
      setDeletingId(null);
      setTimeout(() => setToast(null), 5000);
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.educationalStage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStageLabel = (stageCode: string) => {
    const found = stageOptions.find(o => o.value.toLowerCase() === stageCode?.toLowerCase());
    if (!found) return stageCode;
    return dir === 'rtl' ? found.labelAr : found.labelEn;
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-5 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'إدارة المواد الدراسية' : 'Subjects Management'}</h1>
              <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'إدارة المناهج والمراحل الدراسية المتاحة للمعلمين والسناتر' : 'Manage academic subjects and curriculum stages'}</p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer relative z-10"
          >
            <Plus className="w-4 h-4" />
            <span>{dir === 'rtl' ? 'إضافة مادة جديدة' : 'Add New Subject'}</span>
          </button>
        </div>

        {/* Global Toast */}
        {toast && (
          <div className={`p-4 rounded-xl font-bold flex items-center justify-center shadow-sm animate-in fade-in slide-in-from-top-3 ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            )}
            <span>{toast.text}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-4' : 'left-4'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dir === 'rtl' ? 'البحث عن مادة أو مرحلة دراسية...' : 'Search by subject or stage...'}
            className={`w-full bg-white border border-slate-200 rounded-2xl py-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm ${
              dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'
            }`}
          />
        </div>

        {/* Subjects Grid */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <div key={subject.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black text-indigo-700 bg-indigo-50/80 border border-indigo-100/60 px-3 py-1 rounded-full">
                        {getStageLabel(subject.educationalStage)}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dir === 'rtl' ? 'رمز المرحلة' : 'Stage Code'}: {subject.educationalStage}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 mt-6 flex gap-2">
                    <button
                      onClick={() => openEditModal(subject)}
                      className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{dir === 'rtl' ? 'تعديل' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      disabled={deletingId === subject.id}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {deletingId === subject.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>{dir === 'rtl' ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-black text-slate-700 mb-1">{dir === 'rtl' ? 'لا توجد مواد دراسية' : 'No subjects found'}</h3>
                <p className="text-xs text-slate-400 max-w-sm mb-6">{dir === 'rtl' ? 'ابدأ بإضافة أول مادة دراسية لتظهر للمعلمين والسناتر.' : 'Start by creating academic subjects for teachers and centers.'}</p>
                <button
                  onClick={openAddModal}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  {dir === 'rtl' ? 'إضافة مادة الآن' : 'Add Subject Now'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingSubject 
                      ? (dir === 'rtl' ? 'تعديل المادة الدراسية' : 'Edit Subject')
                      : (dir === 'rtl' ? 'إضافة مادة دراسية جديدة' : 'Add New Subject')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {dir === 'rtl' ? 'يرجى تحديد اسم المادة والمرحلة التابعة لها' : 'Specify subject name and educational stage'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">
                    {dir === 'rtl' ? 'اسم المادة الدراسية' : 'Subject Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={dir === 'rtl' ? 'مثال: فيزياء، لغة عربية، رياضيات...' : 'e.g. Physics, Mathematics...'}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">
                    {dir === 'rtl' ? 'المرحلة الدراسية' : 'Educational Stage'}
                  </label>
                  <select
                    value={educationalStage}
                    onChange={(e) => setEducationalStage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {stageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {dir === 'rtl' ? opt.labelAr : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{editingSubject ? (dir === 'rtl' ? 'حفظ التعديلات' : 'Save Changes') : (dir === 'rtl' ? 'إضافة المادة' : 'Add Subject')}</span>
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
