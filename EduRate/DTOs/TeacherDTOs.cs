using System;

namespace EduRate.DTOs
{
    public class TeacherCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public string DemoVideoUrl { get; set; } = string.Empty; // لينك الفيديو التجريبي
    }

    public class TeacherUpdateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public string DemoVideoUrl { get; set; } = string.Empty; // لينك الفيديو التجريبي
    }

    public class TeacherReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public double TrustScore { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public string DemoVideoUrl { get; set; } = string.Empty; // لينك الفيديو التجريبي
    }

    public class TeacherStatsDto
    {
        public int TotalBookings { get; set; }
        public int TotalReviews { get; set; }
        public double AverageRating { get; set; }
        public double TrustScore { get; set; }
    }

    public class TeacherMessageDto
    {
        public int Id { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }

    public class TeacherCenterReadDto
    {
        public int CenterId { get; set; }
        public string CenterName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public decimal PricePerSession { get; set; }
    }

    public class ReviewReadDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty; // اسم الطالب اللي كتب الكومنت
        public DateTime CreatedAt { get; set; }
    }

    public class BookingReadDto
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; }
        public string StudentName { get; set; } = string.Empty; // عشان المدرس يعرف مين اللي حاجز
        public bool IsConfirmed { get; set; } // لو عندك حقل لتأكيد الحجز
    }
}