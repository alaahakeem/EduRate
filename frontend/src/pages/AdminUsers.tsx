import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Filter, Shield, UserX, UserCheck, MoreVertical, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function AdminUsers() {
  const { t, dir } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAction = (id: number, role: string, action: string) => {
    // In a real app, you would call an API like `/admin/users/${role}/${id}/${action}`
    // For now, we just update the UI state to simulate banning/unbanning
    if (action === 'ban') {
      setUsers(users.map(u => (u.id === id && u.role === role) ? { ...u, status: 'Banned' } : u));
    } else if (action === 'unban') {
      setUsers(users.map(u => (u.id === id && u.role === role) ? { ...u, status: 'Active' } : u));
    }
  };

  const filteredUsers = users.filter(u => {
    const safeName = u.name || '';
    const safeEmail = u.email || '';
    const matchesSearch = safeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          safeEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">{dir === 'rtl' ? 'إدارة المستخدمين' : 'User Management'}</h1>
            <p className="text-sm text-slate-500 mt-1">{dir === 'rtl' ? 'تحكم في حسابات الطلاب، المعلمين، والسناتر' : 'Manage student, teacher, and center accounts'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
            
            <div className="relative w-full sm:w-96">
              <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
              <input 
                type="text"
                placeholder={dir === 'rtl' ? 'ابحث بالاسم أو البريد...' : 'Search by name or email...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
              >
                <option value="All">{dir === 'rtl' ? 'جميع الأدوار' : 'All Roles'}</option>
                <option value="Student">{dir === 'rtl' ? 'طالب' : 'Student'}</option>
                <option value="Teacher">{dir === 'rtl' ? 'معلم' : 'Teacher'}</option>
                <option value="Center">{dir === 'rtl' ? 'سنتر' : 'Center'}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">{dir === 'rtl' ? 'المستخدم' : 'User'}</th>
                  <th className="px-6 py-4">{dir === 'rtl' ? 'الدور' : 'Role'}</th>
                  <th className="px-6 py-4">{dir === 'rtl' ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-4 text-center">{dir === 'rtl' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <tr key={`${user.role}-${user.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {(user.name || '?').charAt(0)}
                          </div>
                          <div className={`ml-4 ${dir === 'rtl' ? 'mr-4 ml-0' : ''}`}>
                            <div className="text-sm font-bold text-slate-900">{user.name || 'بدون اسم'}</div>
                            <div className="text-sm text-slate-500">{user.email || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                          ${user.role === 'Student' ? 'bg-blue-100 text-blue-800' : 
                            user.role === 'Teacher' ? 'bg-purple-100 text-purple-800' : 
                            'bg-amber-100 text-amber-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                          ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                            user.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'}`}>
                          {user.status === 'Active' ? (dir === 'rtl' ? 'نشط' : 'Active') :
                           user.status === 'Pending' ? (dir === 'rtl' ? 'قيد المراجعة' : 'Pending') :
                           (dir === 'rtl' ? 'محظور' : 'Banned')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.status === 'Banned' ? (
                            <button 
                              onClick={() => handleAction(user.id, user.role, 'unban')}
                              className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
                              title={dir === 'rtl' ? 'إلغاء الحظر' : 'Unban'}
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleAction(user.id, user.role, 'ban')}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                              title={dir === 'rtl' ? 'حظر' : 'Ban'}
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                      {dir === 'rtl' ? 'لا يوجد مستخدمين يطابقون بحثك' : 'No users match your search'}
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
