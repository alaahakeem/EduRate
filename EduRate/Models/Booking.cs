namespace EduRate.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.Now;

        // دي الخاصية الأهم: هل السنتر أكد حضور الطالب؟
        public bool IsAttended { get; set; }

        // العلاقات (Foreign Keys)
        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; }
        public int CenterId { get; set; }
        public Center Center { get; set; } // Navigation Property
    }
}