using System;
using System.ComponentModel.DataAnnotations;

namespace EduRate.DTOs
{
    // 1. الداتا اللي بنستقبلها وقت التقييم
    public class ReviewCreateDto
    {
        [Required]
        public int StudentId { get; set; }

        // جهات التقييم (بنسمح بواحدة بس منهم)
        public int? TeacherId { get; set; }
        public int? CenterId { get; set; }
        public int? SessionId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "التقييم يجب أن يكون من 1 إلى 5")]
        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        // هل الطالب عايز التقييم يكون مجهول؟
        public bool IsAnonymous { get; set; }
    }

    // 2. الداتا اللي بنرجعها (للمدرس أو السنتر عشان يشوفوها)
    public class ReviewReaddDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        // هنا هنعرض الاسم الحقيقي أو كلمة "طالب مجهول" بناءً على اختيار الطالب
        public string StudentName { get; set; } = string.Empty;
        public bool IsAnonymous { get; set; }
        public bool CanEdit { get; set; }
    }
}