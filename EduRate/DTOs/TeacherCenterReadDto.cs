namespace EduRate.DTOs
{
    public class TeacherCenterReadDto
    {
        public int CenterId { get; set; }
        public string CenterName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public decimal PricePerSession { get; set; }
    }
}