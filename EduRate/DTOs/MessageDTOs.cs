using System;

namespace EduRate.DTOs
{
    // --- Message DTOs ---
    public class SendMessageDto
    {
        public int StudentId { get; set; }
        public int TeacherId { get; set; }
        public string SenderRole { get; set; } // "Student" or "Teacher"
        public string Content { get; set; }
    }

    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string SenderRole { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
    }
}