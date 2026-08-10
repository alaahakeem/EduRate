namespace EduRate.DTOs
{
    public class ValidatePromoCodeDto
    {
        public string Code { get; set; }
        public int TeacherId { get; set; }
        public int CenterId { get; set; }
    }

    // --- Subject DTOs ---
    public class SubjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string EducationalStage { get; set; }
    }
}
