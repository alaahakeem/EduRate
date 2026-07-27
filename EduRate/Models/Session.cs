using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRate.Models
{
    public class Session
    {
        [Key]
        public int Id { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        // ربط الحصة بالسنتر
        public int CenterId { get; set; }
        [ForeignKey("CenterId")]
        public Center Center { get; set; }

        // ربط الحصة بالمدرس
        public int TeacherId { get; set; }
        [ForeignKey("TeacherId")]
        public Teacher Teacher { get; set; }
    }
}