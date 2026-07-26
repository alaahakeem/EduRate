namespace EduRate.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string IPAddress { get; set; }
        public bool IsVerified { get; set; }

        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; } //child

        // ربط التقييم بالطالب
        public int StudentId { get; set; }
        public Student Student { get; set; }
    }
}