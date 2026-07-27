namespace EduRate.DTOs
{
    public class ReviewReadDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty; // اسم الطالب اللي كتب الكومنت
        public DateTime CreatedAt { get; set; }
    }
}