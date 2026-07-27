namespace EduRate.DTOs
{
    public class BookingReadDto
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; }
        public string StudentName { get; set; } = string.Empty; // عشان المدرس يعرف مين اللي حاجز
        public bool IsConfirmed { get; set; } // لو عندك حقل لتأكيد الحجز
    }
}