import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCourses from './pages/TeacherCourses';
import TeacherStudents from './pages/TeacherStudents';
import TeacherSales from './pages/TeacherSales';
import TeacherSettings from './pages/TeacherSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminFinance from './pages/AdminFinance';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import AdminSubjects from './pages/AdminSubjects';
import CenterDashboard from './pages/CenterDashboard';
import CenterSchedule from './pages/CenterSchedule';
import CenterTeachers from './pages/CenterTeachers';
import CenterFinance from './pages/CenterFinance';
import CenterSettings from './pages/CenterSettings';
import StudentSchedule from './pages/StudentSchedule';
import StudentSettings from './pages/StudentSettings';
import StudentMessages from './pages/StudentMessages';
import ExploreClasses from './pages/ExploreClasses';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/student/explore" element={<ExploreClasses />} />
            <Route path="/dashboard/student/schedule" element={<StudentSchedule />} />
            <Route path="/dashboard/student/settings" element={<StudentSettings />} />
            <Route path="/dashboard/student/messages" element={<StudentMessages />} />
            <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
            <Route path="/dashboard/teacher/courses" element={<TeacherCourses />} />
            <Route path="/dashboard/teacher/students" element={<TeacherStudents />} />
            <Route path="/dashboard/teacher/sales" element={<TeacherSales />} />
            <Route path="/dashboard/teacher/settings" element={<TeacherSettings />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/users" element={<AdminUsers />} />
            <Route path="/dashboard/admin/finance" element={<AdminFinance />} />
            <Route path="/dashboard/admin/reports" element={<AdminReports />} />
            <Route path="/dashboard/admin/settings" element={<AdminSettings />} />
            <Route path="/dashboard/admin/subjects" element={<AdminSubjects />} />
            <Route path="/dashboard/center" element={<CenterDashboard />} />
            <Route path="/dashboard/center/schedule" element={<CenterSchedule />} />
            <Route path="/dashboard/center/teachers" element={<CenterTeachers />} />
            <Route path="/dashboard/center/finance" element={<CenterFinance />} />
            <Route path="/dashboard/center/settings" element={<CenterSettings />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
