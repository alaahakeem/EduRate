# 🎓 EduRate - منصة إيدوريت التعليمية المتكاملة
### Full-Stack Educational Platform (.NET 8 Web API & React + TypeScript + Vite)

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SignalR](https://img.shields.io/badge/SignalR-RealTime-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 نبذة عن المشروع / Overview

**EduRate (إيدوريت)** هي منصة تعليمية شاملة لإدارة وحجز الحصص والدروس التعليمية وربط الطلاب بالمعلمين والمراكز التعليمية (السناتر)، مع لوحة تحكم مركزية للإدارة، ونظام تقييمات موثوق، ومحادثة فورية مباشرة عبر **SignalR**.

تم بناء المنصة بأحدث التقنيات مع دعم كامل للغتين **العربية (RTL)** و **الإنجليزية (LTR)**، وتوفر تجربة مستخدم سلسة واستجابة كاملة لجميع الشاشات.

---

## 🚀 المميزات الرئيسية / Key Features

### 🌐 الصفحة الرئيسية العامة (Landing Page)
- تصميم عصري وجذاب ثنائي اللغة بالكامل (العربية / English).
- استعراض المعلمين الأكثر تميزاً وتقييماً والمراكز التعليمية المعتمدة.
- قسم "كيف تعمل المنصة" للمستخدمين الجدد.
- تنقل سلس وتجاوب كامل مع الهواتف الذكية والأجهزة اللوحية.

### 👨‍🎓 1. لوحة تحكم الطالب (Student Dashboard)
- **استكشاف الحصص (Explore Classes):** تصفح الحصص المتاحة وتصفيتها حسب المادة، المعلم، السنتر، والصف الدراسي.
- **حجز الحصص مع كود الخصم (Promo Codes):** إمكانية إدخال كود الخصم وحساب السعر التلقائي والخصم من المحفظة مباشرة.
- **جدول الحصص (Schedule):** عرض جميع الحصص المحجوزة والقادمة والمنتهية.
- **نظام التقييمات (Reviews & Ratings):** إمكانية تقييم الحصة والمعلم بنظام الـ 5 نجوم وكتابة تعليق.
- **المحادثات المباشرة (Live Chat):** شات فوري حي مع المعلمين باستخدام **SignalR**.
- **المحفظة والملف الشخصي:** رصيد المحفظة، نقاط المكافآت، وإعدادات الحساب.

### 👨‍🏫 2. لوحة تحكم المعلم (Teacher Dashboard)
- **إدارة الحصص والكورسات:** إنشاء حصص جديدة، تحديد السنتر، القاعة، السعر، والمواعيد.
- **قوائم الطلاب:** متابعة الطلاب المشتركين في كل حصة.
- **المبيعات والأرباح:** إحصائيات مالية دقيقة ورسوم بيانية لإجمالي الدخل والتحصيلات.
- **الملف التعريفي:** تعديل السيرة الذاتية، سنوات الخبرة، وفيديو المعاينة (Demo Video).

### 🏢 3. لوحة تحكم السنتر / المركز التعليمي (Center Dashboard)
- **جدول اليوم والجدول الزمني:** عرض دقيق لجميع الحصص المنعقدة بالسنتر مقسمة بالساعات والقاعات مع تصفية (اليوم / الأسبوع / الشهر).
- **إدارة الحضور والغياب:** نافذة تفاعلية لتسجيل حضور الطلاب داخل السنتر.
- **المعلمون المعتمدون:** عرض وإدارة المعلمين الذين يقدمون حصصاً داخل المركز.
- **إدارة القاعات (Halls):** إضافة قاعات جديدة وتحديد سعتها ومواصفاتها.
- **التقارير المالية:** متابعة نسب السنتر من الحجوزات والدخل اليومي والشهري.

### 🛡️ 4. لوحة تحكم الأدمن / مدير النظام (Admin Dashboard)
- **لوحة مؤشرات الأداء (KPIs):** إجمالي الإيرادات، عدد المستخدمين، الحجوزات النشطة، والتقييمات.
- **إدارة المستخدمين:** تفعيل، تجميد أو حظر الحسابات (طلاب، معلمين، سناتر).
- **إدارة المواد الدراسية (Subjects Management):** لوحة تحكم متكاملة (CRUD) لإضافة وتعديل وحذف المواد الدراسية وربطها بالمراحل التعليمية.
- **التقارير المالية والنظام:** تقارير التدقيق، المعاملات، وتخصيص إعدادات المنصة.

### 🔔 نظام الإشعارات الموحد (Notifications System)
- قائمة إشعارات منبثقة تفاعلية في الهيدر لجميع المستخدمين حسب أدوارهم وصلاحياتهم.
- تحديث فوري للحالة وعداد الإشعارات غير المقروءة.

---

## 🛠️ البنية التقنية / Tech Stack

### 💻 Backend:
- **ASP.NET Core 8 Web API**
- **Entity Framework Core 8** (Code-First)
- **Microsoft SQL Server**
- **ASP.NET Core Identity & JWT Authentication**
- **SignalR Hubs** (Real-Time Live Chat & Notifications)
- **AutoMapper & FluentValidation**

### 🎨 Frontend:
- **React 19** with **TypeScript**
- **Vite** (Next Generation Frontend Tooling)
- **Tailwind CSS 4**
- **Lucide Icons**
- **Axios** (Configured with JWT Interceptors & Bearer Token handling)
- Custom bilingual (AR/EN) Context & RTL engine

---

## 📂 هيكل المشروع / Project Structure

```bash
EduRate/
├── EduRate/                      # Backend (.NET 8 Web API)
│   ├── Controllers/             # API Endpoints (Admin, Auth, Bookings, Sessions, Students, Teachers, Centers, Subjects...)
│   ├── Data/                    # AppDbContext & Configurations
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Hubs/                    # SignalR Chat & Notification Hubs
│   ├── Models/                  # Entity Models (User, Student, Teacher, Center, Session, Booking, Review...)
│   ├── Services/                # Business Logic Services
│   ├── appsettings.json         # Database & JWT Configuration
│   └── Program.cs               # Middleware, Dependency Injection & Seed Data
│
├── frontend/                    # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── assets/              # Images, illustrations & SVGs
│   │   ├── components/          # Reusable UI Components (Navbar, Footer, DashboardLayout, CustomSelect...)
│   │   ├── context/             # AuthContext & LanguageContext (AR/EN)
│   │   ├── pages/               # Dashboard pages (Admin, Teacher, Center, Student) & Public Landing
│   │   └── utils/               # Axios API client & translations dictionary
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

---

## ⚙️ طريقة التشغيل محلياً / Local Development Setup

### المتطلبات المسبقة / Prerequisites:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18+) & npm
- [SQL Server](https://www.microsoft.com/en-us/sql-server/) (LocalDB or SQL Server Express)

### 1. تشغيل الباك إند (Backend Setup)
```bash
# الانتقال لمجلد الباك إند
cd EduRate/EduRate

# استعادة الحزم
dotnet restore

# تطبيق الميجريشن وتحديث قاعدة البيانات (اختياري، يتم تجهيز البيانات تلقائياً عند التشغيل)
dotnet ef database update

# تشغيل السيرفر
dotnet run --launch-profile http
```
> يعمل السيرفر افتراضياً على: `http://localhost:5232`  
> مستندات الـ API عبر Swagger: `http://localhost:5232/swagger`

---

### 2. تشغيل الفرونت إند (Frontend Setup)
```bash
# الانتقال لمجلد الفرونت إند
cd frontend

# تثبيت الحزم
npm install

# تشغيل وضع التطوير
npm run dev
```
> يعمل تطبيق الفرونت إند على: `http://localhost:5173`

---

## 🔑 بيانات الدخول التجريبية / Demo Test Accounts

| الدور (Role) | البريد الإلكتروني (Email) | كلمة المرور (Password) |
|---|---|---|
| **الأدمن (Admin)** | `admin@edurate.com` | `Admin@123` |
| **الطالب (Student)** | `student@edurate.com` | `Student@123` |
| **المعلم (Teacher)** | `teacher1@edurate.com` | `Teacher@123` |
| **المركز التعليمي (Center)** | `center@edurate.com` | `Center@123` |

---

## 📄 الترخيص / License
هذا المشروع مرخص تحت رخصة **MIT** - انظر ملف [LICENSE](LICENSE) لمزيد من التفاصيل.
