using System.ComponentModel.DataAnnotations.Schema;

namespace EduRate.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.Now;

        // دي الخاصية الأهم: هل السنتر أكد حضور الطالب؟
        public bool IsAttended { get; set; }

        // حالة الحجز (Pending, Confirmed, Cancelled)
        public string Status { get; set; } = "Pending";

        // العلاقات (Foreign Keys)
        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int SessionId { get; set; }
        [ForeignKey("SessionId")]
        public Session Session { get; set; }

        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; }
        public int CenterId { get; set; }
        public Center Center { get; set; } // Navigation Property
    }
}