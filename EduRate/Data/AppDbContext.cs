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

            // ضبط الـ Precision لنسبة الأرباح
            modelBuilder.Entity<TeacherCenter>()
                .Property(tc => tc.ProfitPercentage)
                .HasPrecision(5, 2);

            // ضبط نوع البيانات لعمود السعر
            modelBuilder.Entity<TeacherCenter>()
                .Property(tc => tc.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}