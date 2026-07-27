using EduRate.Data;
using Microsoft.EntityFrameworkCore;

namespace EduRate
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            // === بذر الداتا الكبيرة والكاملة مباشرة ===
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<AppDbContext>();

                    // 1. إنشاء الداتابيز والجداول
                    context.Database.EnsureCreated();

                    // 2. لو جدول المدرسين فاضي، نزل الداتا كلها حالا
                    if (!context.Teachers.Any())
                    {
                        // 1. المدرسين (10 مدرسين)
                        context.Teachers.AddRange(
                            new EduRate.Models.Teacher { Name = "Mr. Mohammed Ahmed", Subject = "Physics", Bio = "Expert in simplifying Physics concepts.", YearsOfExperience = 10, TrustScore = 95, AverageRating = 4.9, TotalReviews = 25 },
                            new EduRate.Models.Teacher { Name = "Mr. Mahmoud Ali", Subject = "English", Bio = "Specialized in foundational English and grammar.", YearsOfExperience = 5, TrustScore = 88, AverageRating = 4.8, TotalReviews = 18 },
                            new EduRate.Models.Teacher { Name = "Dr. Ahmed Ibrahim", Subject = "Mathematics", Bio = "Ph.D. in pure mathematics with 12 years of experience.", YearsOfExperience = 12, TrustScore = 99, AverageRating = 5.0, TotalReviews = 40 },
                            new EduRate.Models.Teacher { Name = "Eng. Mohamed Al-Adawy", Subject = "Computer Science & C#", Bio = "Full-stack developer and software engineering mentor.", YearsOfExperience = 6, TrustScore = 100, AverageRating = 5.0, TotalReviews = 35 },
                            new EduRate.Models.Teacher { Name = "Dr. Fatma El-Zahraa", Subject = "Chemistry", Bio = "Organic chemistry specialist for high schools.", YearsOfExperience = 9, TrustScore = 96, AverageRating = 4.7, TotalReviews = 22 },
                            new EduRate.Models.Teacher { Name = "Mr. Tarek El-Ashry", Subject = "History", Bio = "Making history fun and easy to memorize.", YearsOfExperience = 11, TrustScore = 92, AverageRating = 4.5, TotalReviews = 15 },
                            new EduRate.Models.Teacher { Name = "Mrs. Heba Mahmoud", Subject = "Biology", Bio = "Detailed biological systems and genetics expert.", YearsOfExperience = 8, TrustScore = 94, AverageRating = 4.8, TotalReviews = 28 },
                            new EduRate.Models.Teacher { Name = "Mr. Karim Abdelaziz", Subject = "French", Bio = "Native speaker style teaching methods.", YearsOfExperience = 7, TrustScore = 91, AverageRating = 4.6, TotalReviews = 12 },
                            new EduRate.Models.Teacher { Name = "Eng. Ahmed Khaled", Subject = "Databases & SQL", Bio = "DBA with extensive enterprise project experience.", YearsOfExperience = 8, TrustScore = 97, AverageRating = 4.9, TotalReviews = 30 },
                            new EduRate.Models.Teacher { Name = "Mrs. Marwa El-Sherif", Subject = "Geography", Bio = "Environmental and general geography expert.", YearsOfExperience = 5, TrustScore = 90, AverageRating = 4.4, TotalReviews = 10 }
                        );
                        context.SaveChanges();

                        // 2. الطلاب (8 طلاب)
                        context.Students.AddRange(
                            new EduRate.Models.Student { Name = "Ahmed Khaled", Email = "ahmed@example.com", EducationalLevel = "Senior 2", Governorate = "القاهرة", Region = "المعادي" },
                            new EduRate.Models.Student { Name = "Mona Sayed", Email = "mona@example.com", EducationalLevel = "Senior 3", Governorate = "الجيزة", Region = "الدقي" },
                            new EduRate.Models.Student { Name = "Youssef Ahmed", Email = "youssef@example.com", EducationalLevel = "Senior 1", Governorate = "الإسكندرية", Region = "محطة الرمل" },
                            new EduRate.Models.Student { Name = "Alaa Hassan", Email = "alaa@example.com", EducationalLevel = "Senior 2", Governorate = "القاهرة", Region = "مدينة نصر" },
                            new EduRate.Models.Student { Name = "Mahmoud Adel", Email = "mahmoud@example.com", EducationalLevel = "Senior 3", Governorate = "الجيزة", Region = "المهندسين" },
                            new EduRate.Models.Student { Name = "Sara Abdullah", Email = "sara@example.com", EducationalLevel = "Senior 1", Governorate = "القاهرة", Region = "التجمع الخامس" },
                            new EduRate.Models.Student { Name = "Kareem Mamdouh", Email = "kareem@example.com", EducationalLevel = "Senior 2", Governorate = "الإسكندرية", Region = "سموحة" },
                            new EduRate.Models.Student { Name = "Mona Zaki", Email = "monaz@example.com", EducationalLevel = "Senior 3", Governorate = "القاهرة", Region = "Heliopolis" }
                        );
                        context.SaveChanges();

                        // 3. السناتر (6 سناتر)
                        context.Centers.AddRange(
                            new EduRate.Models.Center { Name = "سنتر الأوائل", Description = "قاعات مكيفة ومجهزة", Address = "شارع المحطة", Latitude = 30.0444, Longitude = 31.2357, IsVerified = true },
                            new EduRate.Models.Center { Name = "سنتر النخبة", Description = "مراجعات نهائية مكثفة", Address = "وسط البلد", Latitude = 30.0333, Longitude = 31.2333, IsVerified = false },
                            new EduRate.Models.Center { Name = "سنتر المستقبل", Description = "قاعات واسعة ومناسبة للمجموعات", Address = "شارع جامعة الدول", Latitude = 31.2001, Longitude = 29.9187, IsVerified = true },
                            new EduRate.Models.Center { Name = "سنتر الإبداع", Description = "أحدث الوسائل التكنولوجية في الشرح", Address = "منصورة - توريل", Latitude = 31.0409, Longitude = 31.3785, IsVerified = true },
                            new EduRate.Models.Center { Name = "سنتر الفراعنة", Description = "تجهيزات متكاملة للطلاب", Address = "طنطا - شارع الاستاد", Latitude = 30.7865, Longitude = 31.0004, IsVerified = true },
                            new EduRate.Models.Center { Name = "سنتر الإنجاز", Description = "السنتر الأول في خدمات الطلاب", Address = "أسيوط - شارع الجمهورية", Latitude = 27.1812, Longitude = 31.1837, IsVerified = false }
                        );
                        context.SaveChanges();

                        // 4. ربط المدرسين بالسناتر (TeacherCenters)
                        context.TeacherCenters.AddRange(
                            new EduRate.Models.TeacherCenter { TeacherId = 1, CenterId = 1, JoinDate = DateTime.Now.AddMonths(-6), ProfitPercentage = 70.5m, IsActive = true, Price = 120.0m },
                            new EduRate.Models.TeacherCenter { TeacherId = 1, CenterId = 2, JoinDate = DateTime.Now.AddMonths(-2), ProfitPercentage = 60.0m, IsActive = true, Price = 150.0m },
                            new EduRate.Models.TeacherCenter { TeacherId = 2, CenterId = 1, JoinDate = DateTime.Now.AddYears(-1), ProfitPercentage = 80.0m, IsActive = false, Price = 100.0m },
                            new EduRate.Models.TeacherCenter { TeacherId = 3, CenterId = 3, JoinDate = DateTime.Now.AddMonths(-4), ProfitPercentage = 75.0m, IsActive = true, Price = 130.0m },
                            new EduRate.Models.TeacherCenter { TeacherId = 4, CenterId = 4, JoinDate = DateTime.Now.AddMonths(-5), ProfitPercentage = 85.0m, IsActive = true, Price = 200.0m },
                            new EduRate.Models.TeacherCenter { TeacherId = 5, CenterId = 5, JoinDate = DateTime.Now.AddMonths(-3), ProfitPercentage = 70.0m, IsActive = true, Price = 140.0m }
                        );
                        context.SaveChanges();

                        // 5. التقييمات (Reviews)
                        context.Reviews.AddRange(
                            new EduRate.Models.Review { TeacherId = 1, StudentId = 1, Rating = 5, Comment = "Excellent explanation!", CreatedAt = DateTime.Now.AddDays(-2), IPAddress = "192.168.1.1", IsVerified = true },
                            new EduRate.Models.Review { TeacherId = 2, StudentId = 2, Rating = 4, Comment = "Very good.", CreatedAt = DateTime.Now.AddDays(-1), IPAddress = "192.168.1.5", IsVerified = true },
                            new EduRate.Models.Review { TeacherId = 3, StudentId = 3, Rating = 5, Comment = "دكتور متميز جداً وشرحه يجنن", CreatedAt = DateTime.Now.AddDays(-3), IPAddress = "192.168.1.10", IsVerified = true },
                            new EduRate.Models.Review { TeacherId = 4, StudentId = 4, Rating = 5, Comment = "أفضل بشمهندس شرح برمجة بجد", CreatedAt = DateTime.Now.AddDays(-4), IPAddress = "192.168.1.15", IsVerified = true }
                        );
                        context.SaveChanges();
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine("Seeding Error: " + ex.Message);
                }
            }

            app.Run();
        }
    }
}