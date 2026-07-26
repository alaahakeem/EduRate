using EduRate.Models;
using Microsoft.EntityFrameworkCore;

namespace EduRate.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // تسجيل كل الجداول في الداتابيز
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Center> Centers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<TeacherCenter> TeacherCenters { get; set; } // الجدول الوسيط

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. تعريف المفتاح الأساسي المركب لجدول TeacherCenter
            modelBuilder.Entity<TeacherCenter>()
                .HasKey(tc => new { tc.TeacherId, tc.CenterId });
            // إضافة السطر ده لحل مشكلة الـ Decimal
            modelBuilder.Entity<TeacherCenter>()
                .Property(tc => tc.ProfitPercentage)
                .HasPrecision(5, 2); // 5 أرقام التوتال، منهم 2 بعد العلامة

            // 2. إدخال بيانات السناتر (مع إضافة الإحداثيات الجغرافية للخريطة)
            modelBuilder.Entity<Center>().HasData(
                new Center { Id = 1, Name = "سنتر الأوائل", Description = "قاعات مكيفة ومجهزة", Address = "شارع المحطة", Latitude = 30.0444, Longitude = 31.2357, IsVerified = true },
                new Center { Id = 2, Name = "سنتر النخبة", Description = "مراجعات نهائية مكثفة", Address = "وسط البلد", Latitude = 30.0333, Longitude = 31.2333, IsVerified = false }
            );

            // 3. إدخال بيانات المدرسين
            modelBuilder.Entity<Teacher>().HasData(
                new Teacher { Id = 1, Name = "Mr. Mohammed Ahmed", Subject = "Physics", Bio = "Expert in simplifying Physics concepts.", YearsOfExperience = 10, TrustScore = 95, AverageRating = 4.5, TotalReviews = 2 },
                new Teacher { Id = 2, Name = "Mr. Mahmoud Ali", Subject = "English", Bio = "Specialized in foundational English and grammar.", YearsOfExperience = 5, TrustScore = 88, AverageRating = 5.0, TotalReviews = 1 }
            );

            // 4. إدخال بيانات جدول الوسيط (ربط المدرسين بالسناتر)
            modelBuilder.Entity<TeacherCenter>().HasData(
                new TeacherCenter { TeacherId = 1, CenterId = 1, JoinDate = DateTime.Now.AddMonths(-6), ProfitPercentage = 70.5m, IsActive = true },
                new TeacherCenter { TeacherId = 1, CenterId = 2, JoinDate = DateTime.Now.AddMonths(-2), ProfitPercentage = 60.0m, IsActive = true },
                new TeacherCenter { TeacherId = 2, CenterId = 1, JoinDate = DateTime.Now.AddYears(-1), ProfitPercentage = 80.0m, IsActive = false }
            );

            // 5. إدخال بيانات الطلاب (مع إضافة المحافظة والمنطقة للترشيحات)
            modelBuilder.Entity<Student>().HasData(
                new Student { Id = 1, Name = "Ahmed Khaled", Email = "ahmed@example.com", EducationalLevel = "Senior 2", Governorate = "القاهرة", Region = "المعادي" },
                new Student { Id = 2, Name = "Mona Sayed", Email = "mona@example.com", EducationalLevel = "Senior 3", Governorate = "الجيزة", Region = "الدقي" }
            );

            // 6. إدخال بيانات الحجوزات
            modelBuilder.Entity<Booking>().HasData(
                new Booking { Id = 1, StudentId = 1, TeacherId = 1, BookingDate = DateTime.Now.AddDays(-3), IsAttended = true },
                new Booking { Id = 2, StudentId = 2, TeacherId = 2, BookingDate = DateTime.Now.AddDays(-1), IsAttended = false }
            );

            // 7. إدخال بيانات التقييمات
            modelBuilder.Entity<Review>().HasData(
                new Review { Id = 1, TeacherId = 1, StudentId = 1, Rating = 5, Comment = "Excellent explanation!", CreatedAt = DateTime.Now.AddDays(-2), IPAddress = "192.168.1.1", IsVerified = true },
                new Review { Id = 2, TeacherId = 2, StudentId = 2, Rating = 4, Comment = "Very good.", CreatedAt = DateTime.Now.AddDays(-1), IPAddress = "192.168.1.5", IsVerified = true }
            );

            // 8. إدخال بيانات المحادثات
            modelBuilder.Entity<Message>().HasData(
                new Message { Id = 1, StudentId = 1, TeacherId = 1, Content = "يا مستر ممكن تشرح الجزء الأخير تاني؟", SentAt = DateTime.Now.AddHours(-5), IsRead = true, SenderRole = "Student" },
                new Message { Id = 2, StudentId = 1, TeacherId = 1, Content = "أكيد، راجع الفيديو اللي نزلته وهتفهمه.", SentAt = DateTime.Now.AddHours(-4), IsRead = false, SenderRole = "Teacher" }
            );
        }
    }
}