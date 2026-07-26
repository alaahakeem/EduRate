namespace EduRate.Models
{
    public class Center
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public bool IsVerified { get; set; }

        // الخصائص الجديدة الخاصة بالخريطة
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // العلاقة مع جدول الوسيط (TeacherCenter)
        public ICollection<TeacherCenter> TeacherCenters { get; set; }
    }
}