using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduRate.Data;
using EduRate.Models;
using EduRate.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EduRate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeachersController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. GET: عرض كل المدرسين
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeacherReadDto>>> GetTeachers()
        {
            var teachers = await _context.Teachers
                .Include(t => t.Subject) // 💡 عشان نقرأ من جدول المادة
                .OrderByDescending(t => t.AverageRating)
                .Select(t => new TeacherReadDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    SubjectName = t.Subject != null ? t.Subject.Name : "غير محدد", // 💡 التعديل
                    Bio = t.Bio,
                    YearsOfExperience = t.YearsOfExperience,
                    DemoVideoUrl = t.DemoVideoUrl,
                    TrustScore = t.TrustScore,
                    AverageRating = t.AverageRating,
                    TotalReviews = t.TotalReviews
                })
                .ToListAsync();

            return Ok(teachers);
        }

        // ==========================================
        // 2. GET: تفاصيل مدرس محدد
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<TeacherReadDto>> GetTeacher(int id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.Subject) // 💡 الإضافة
                .Where(t => t.Id == id)
                .Select(t => new TeacherReadDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    SubjectName = t.Subject != null ? t.Subject.Name : "غير محدد", // 💡 التعديل
                    Bio = t.Bio,
                    YearsOfExperience = t.YearsOfExperience,
                    DemoVideoUrl = t.DemoVideoUrl,
                    TrustScore = t.TrustScore,
                    AverageRating = t.AverageRating,
                    TotalReviews = t.TotalReviews
                })
                .FirstOrDefaultAsync();

            if (teacher == null) return NotFound(new { message = "المدرس غير موجود" });

            return Ok(teacher);
        }

        // ==========================================
        // 3. POST: إضافة مدرس جديد
        // ==========================================
        [HttpPost]
        public async Task<ActionResult<TeacherReadDto>> PostTeacher(TeacherCreateDto dto)
        {
            var newTeacher = new Teacher
            {
                Name = dto.Name,
                SubjectId = dto.SubjectId, // 💡 التعديل
                Bio = dto.Bio,
                YearsOfExperience = dto.YearsOfExperience,
                DemoVideoUrl = dto.DemoVideoUrl,
                TrustScore = 100,
                AverageRating = 0,
                TotalReviews = 0
            };

            _context.Teachers.Add(newTeacher);
            await _context.SaveChangesAsync();

            // 💡 هنجيب اسم المادة من الداتابيز عشان نرجعه في الرد للفرونت إند
            var subjectName = await _context.Subjects
                .Where(s => s.Id == dto.SubjectId)
                .Select(s => s.Name)
                .FirstOrDefaultAsync() ?? "غير محدد";

            var readDto = new TeacherReadDto
            {
                Id = newTeacher.Id,
                Name = newTeacher.Name,
                SubjectName = subjectName, // 💡 التعديل
                Bio = newTeacher.Bio,
                YearsOfExperience = newTeacher.YearsOfExperience,
                DemoVideoUrl = newTeacher.DemoVideoUrl,
                TrustScore = newTeacher.TrustScore,
                AverageRating = newTeacher.AverageRating,
                TotalReviews = newTeacher.TotalReviews
            };

            return CreatedAtAction(nameof(GetTeacher), new { id = newTeacher.Id }, readDto);
        }

        // ==========================================
        // 4. PUT: تعديل بيانات مدرس
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, TeacherUpdateDto dto)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound(new { message = "المدرس غير موجود" });

            teacher.Name = dto.Name;
            teacher.SubjectId = dto.SubjectId; // 💡 التعديل
            teacher.Bio = dto.Bio;
            teacher.YearsOfExperience = dto.YearsOfExperience;
            teacher.DemoVideoUrl = dto.DemoVideoUrl;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ==========================================
        // 5. DELETE: حذف مدرس
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound(new { message = "المدرس غير موجود" });

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ==========================================
        // 6. GET: البحث والفلترة
        // ==========================================
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<TeacherReadDto>>> SearchTeachers([FromQuery] string? name, [FromQuery] string? subject)
        {
            var query = _context.Teachers.Include(t => t.Subject).AsQueryable(); // 💡 ضفنا Include

            if (!string.IsNullOrEmpty(name))
                query = query.Where(t => t.Name.Contains(name));

            // 💡 التعديل: بنبحث جوه اسم المادة في الجدول المرتبط
            if (!string.IsNullOrEmpty(subject))
                query = query.Where(t => t.Subject != null && t.Subject.Name.Contains(subject));

            var result = await query
                .OrderByDescending(t => t.AverageRating)
                .Select(t => new TeacherReadDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    SubjectName = t.Subject != null ? t.Subject.Name : "غير محدد", // 💡 التعديل
                    Bio = t.Bio,
                    YearsOfExperience = t.YearsOfExperience,
                    DemoVideoUrl = t.DemoVideoUrl,
                    TrustScore = t.TrustScore,
                    AverageRating = t.AverageRating,
                    TotalReviews = t.TotalReviews
                })
                .ToListAsync();

            return Ok(result);
        }

        // ==========================================
        // 7. GET: جلب تقييمات المدرس (Reviews) - معلق
        // ==========================================
        //[HttpGet("{id}/reviews")]
        // ...

        // ==========================================
        // 8. GET: جلب حجوزات المدرس (Bookings)
        // ==========================================
        [HttpGet("{id}/bookings")]
        public async Task<ActionResult<IEnumerable<BookingReadDto>>> GetTeacherBookings(int id)
        {
            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == id);
            if (!teacherExists) return NotFound(new { message = "المدرس غير موجود" });

            var bookings = await _context.Bookings
                .Where(b => b.Session.TeacherId == id)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingReadDto
                {
                    Id = b.Id,
                    BookingDate = b.BookingDate,
                    StudentName = b.Student.Name
                })
                .ToListAsync();

            if (!bookings.Any()) return NotFound(new { message = "لا يوجد حجوزات لهذا المدرس حالياً" });

            return Ok(bookings);
        }

        // ==========================================
        // 9. GET: جلب السناتر وأسعار الحصص (Centers)
        // ==========================================
        [HttpGet("{id}/centers")]
        public async Task<ActionResult<IEnumerable<TeacherCenterReadDto>>> GetTeacherCenters(int id)
        {
            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == id);
            if (!teacherExists) return NotFound(new { message = "المدرس غير موجود" });

            var centers = await _context.TeacherCenters
                .Where(tc => tc.TeacherId == id)
                .Select(tc => new TeacherCenterReadDto
                {
                    CenterId = tc.CenterId,
                    CenterName = tc.Center.Name,
                    Address = tc.Center.Address,
                    Description = tc.Center.Description,
                    // 💡 عالجنا حالة لو الموديل كان Null في الإحداثيات
                    Latitude = tc.Center.Latitude ?? 0,
                    Longitude = tc.Center.Longitude ?? 0,
                    PricePerSession = tc.Price
                })
                .ToListAsync();

            if (!centers.Any()) return NotFound(new { message = "هذا المدرس غير مرتبط بأي سناتر حالياً" });

            return Ok(centers);
        }

        // ==========================================
        // 10. GET: إحصائيات لوحة التحكم (Dashboard Stats)
        // ==========================================
        [HttpGet("{id}/stats")]
        public async Task<ActionResult<TeacherStatsDto>> GetTeacherStats(int id)
        {
            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == id);
            if (!teacherExists) return NotFound(new { message = "المدرس غير موجود" });

            var totalBookings = await _context.Bookings.CountAsync(b => b.Session.TeacherId == id);

            var teacherStats = await _context.Teachers
                .Where(t => t.Id == id)
                .Select(t => new TeacherStatsDto
                {
                    TotalBookings = totalBookings,
                    TotalReviews = t.TotalReviews,
                    AverageRating = t.AverageRating,
                    TrustScore = t.TrustScore
                })
                .FirstOrDefaultAsync();

            return Ok(teacherStats);
        }

        // ==========================================
        // 11. GET: رسائل المدرس (Messages)
        // ==========================================
        [HttpGet("{id}/messages")]
        public async Task<ActionResult<IEnumerable<TeacherMessageDto>>> GetTeacherMessages(int id)
        {
            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == id);
            if (!teacherExists) return NotFound(new { message = "المدرس غير موجود" });

            var messages = await _context.Messages
                .Where(m => m.TeacherId == id)
                .OrderByDescending(m => m.SentAt)
                .Select(m => new TeacherMessageDto
                {
                    Id = m.Id,
                    SenderName = m.Student.Name,
                    Content = m.Content,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            if (!messages.Any()) return NotFound(new { message = "لا توجد رسائل جديدة" });

            return Ok(messages);
        }
    }
}