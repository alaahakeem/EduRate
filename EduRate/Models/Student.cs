namespace EduRate.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string EducationalLevel { get; set; } // المرحلة الدراسية (مثال: ثانوي عام)

        // الخصائص الجديدة الخاصة بالموقع
        public string Governorate { get; set; } // المحافظة (مثال: القاهرة)
        public string Region { get; set; }      // المنطقة (مثال: المعادي)

        // العلاقات: الطالب ليه حجوزات كتير، وتقييمات كتير
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }
}