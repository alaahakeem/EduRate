using EduRate.Models;
using Microsoft.EntityFrameworkCore;

namespace EduRate.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Seeding Data for Teachers
            modelBuilder.Entity<Teacher>().HasData(
                new Teacher { Id = 1, Name = "Mr. Mohammed Ahmed", Subject = "Physics", Bio = "Expert in simplifying Physics concepts.", YearsOfExperience = 10, TrustScore = 95, AverageRating = 4.5, TotalReviews = 2 },
                new Teacher { Id = 2, Name = "Mr. Mahmoud Ali", Subject = "English", Bio = "Specialized in foundational English and grammar.", YearsOfExperience = 5, TrustScore = 88, AverageRating = 5.0, TotalReviews = 1 },
                new Teacher { Id = 3, Name = "Eng. Tarek Hassan", Subject = "Mathematics", Bio = "Makes math fun and easy to understand.", YearsOfExperience = 8, TrustScore = 92, AverageRating = 3.0, TotalReviews = 1 },
                new Teacher { Id = 4, Name = "Dr. Sarah Ibrahim", Subject = "Chemistry", Bio = "Focuses on practical experiments and problem-solving.", YearsOfExperience = 12, TrustScore = 98, AverageRating = 5.0, TotalReviews = 1 }
            );
            modelBuilder.Entity<Review>().HasData(
                new Review { Id = 1, TeacherId = 1, StudentName = "طالب مجهول", Rating = 5, Comment = "شرح ممتاز جداً", CreatedAt = DateTime.Now.AddDays(-2), IPAddress = "192.168.1.1", IsVerified = true },
                new Review { Id = 2, TeacherId = 1, StudentName = "أحمد خالد", Rating = 4, Comment = "كويس بس الحصة طويلة", CreatedAt = DateTime.Now.AddDays(-1), IPAddress = "192.168.1.5", IsVerified = true }
            );
        }
    }
    }
