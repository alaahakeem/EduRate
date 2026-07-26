namespace EduRate.Models
{
    public class Teacher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Subject { get; set; }
        public string Bio { get; set; }
        public int YearsOfExperience { get; set; }
        public double TrustScore { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public ICollection<Review> Reviews { get; set; }  //parent
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Message> Messages { get; set; }

        // العلاقة مع جدول الوسيط (TeacherCenter)
        public ICollection<TeacherCenter> TeacherCenters { get; set; }

    }
}
