import DashboardLayout from '../components/DashboardLayout';
import { MessageSquare, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StudentMessages() {
  const { dir } = useLanguage();

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
        
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 shrink-0">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shadow-sm">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'الرسائل والمحادثات' : 'Messages'}</h1>
            <p className="text-slate-500 text-sm mt-1">{dir === 'rtl' ? 'تواصل مع المعلمين وإدارة المنصة' : 'Communicate with teachers and platform admin'}</p>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar / Contacts */}
          <div className={`w-full md:w-80 ${dir === 'rtl' ? 'border-l' : 'border-r'} border-slate-100 flex flex-col bg-slate-50/50`}>
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  placeholder={dir === 'rtl' ? 'ابحث في الرسائل...' : 'Search messages...'}
                  className={`w-full bg-white border border-slate-200 rounded-xl py-2 ${dir === 'rtl' ? 'pr-9 pl-4' : 'pl-9 pr-4'} text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500`}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {/* Dummy chat item */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-slate-100 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex flex-shrink-0 items-center justify-center font-bold">
                  إ
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{dir === 'rtl' ? 'إدارة المنصة' : 'Platform Admin'}</h3>
                    <span className="text-[10px] text-sky-600 font-bold">12:30 PM</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{dir === 'rtl' ? 'أهلاً بك في EduRate...' : 'Welcome to EduRate...'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white flex flex-col items-center justify-center text-center p-8 hidden md:flex">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{dir === 'rtl' ? 'اختر محادثة للبدء' : 'Select a conversation to start'}</h3>
            <p className="text-slate-500 max-w-sm">{dir === 'rtl' ? 'يمكنك التواصل مع إدارة المنصة أو المعلمين الذين قمت بالحجز معهم هنا.' : 'You can communicate with platform administration or your booked teachers here.'}</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
