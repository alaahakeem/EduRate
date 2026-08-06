using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduRate.Data;
using EduRate.Models;
using EduRate.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EduRate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SessionsController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. GET: عرض كل الحصص
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SessionReadDto>>> GetSessions()
        {
            var sessions = await _context.Sessions
                .Include(s => s.Teacher)
                .Include(s => s.Center)
                .Select(s => new SessionReadDto
                {
                    Id = s.Id,
                    Title = s.Title,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Price = s.Price,
                    EducationalStage = s.EducationalStage,
                    Status = s.Status,
                    CenterName = s.Center.Name,
                    TeacherName = s.Teacher.Name
                })
                .ToListAsync();

            return Ok(sessions);
        }

        // ==========================================
        // 2. GET: عرض الحصص الخاصة بمرحلة دراسية معينة
        // ==========================================
        [HttpGet("stage/{stage}")]
        public async Task<ActionResult<IEnumerable<SessionReadDto>>> GetSessionsByStage(string stage)
        {
            var sessions = await _context.Sessions
                .Include(s => s.Teacher)
                .Include(s => s.Center)
                .Where(s => s.EducationalStage == stage && s.Status == "Available")
                .OrderBy(s => s.StartTime)
                .Select(s => new SessionReadDto
                {
                    Id = s.Id,
                    Title = s.Title,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Price = s.Price,
                    EducationalStage = s.EducationalStage,
                    Status = s.Status,
                    CenterName = s.Center.Name,
                    TeacherName = s.Teacher.Name
                })
                .ToListAsync();

            return Ok(sessions);
        }

        // ==========================================
        // 3. POST: إضافة حصة جديدة 
        // ==========================================
        [HttpPost]
        public async Task<ActionResult<SessionReadDto>> CreateSession(SessionCreateDto dto)
        {
            if (dto.StartTime < DateTime.Now)
                return BadRequest("لا يمكن إنشاء حصة في موعد قديم.");

            if (dto.EndTime <= dto.StartTime)
                return BadRequest("موعد انتهاء الحصة يجب أن يكون بعد موعد بدايتها.");

            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == dto.TeacherId);
            var centerExists = await _context.Centers.AnyAsync(c => c.Id == dto.CenterId);

            if (!teacherExists || !centerExists)
                return BadRequest("المدرس أو السنتر غير موجود في قاعدة البيانات.");

            // ضفت هنا شرط إن الحصة متبقاش ملغية عشان ميحسبهاش تعارض
            var hasConflict = await _context.Sessions
                .AnyAsync(s => s.TeacherId == dto.TeacherId &&
                               s.Status != "Cancelled" &&
                               s.StartTime < dto.EndTime &&
                               dto.StartTime < s.EndTime);

            if (hasConflict)
                return BadRequest("هذا المدرس لديه حصة أخرى في نفس هذا التوقيت.");

            var newSession = new Session
            {
                Title = dto.Title,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Price = dto.Price,
                EducationalStage = dto.EducationalStage,
                CenterId = dto.CenterId,
                TeacherId = dto.TeacherId,
                Status = "Available"
            };

            _context.Sessions.Add(newSession);
            await _context.SaveChangesAsync();

            var createdSession = await _context.Sessions
                .Include(s => s.Teacher)
                .Include(s => s.Center)
                .FirstOrDefaultAsync(s => s.Id == newSession.Id);

            var readDto = new SessionReadDto
            {
                Id = createdSession.Id,
                Title = createdSession.Title,
                StartTime = createdSession.StartTime,
                EndTime = createdSession.EndTime,
                Price = createdSession.Price,
                EducationalStage = createdSession.EducationalStage,
                Status = createdSession.Status,
                CenterName = createdSession.Center.Name,
                TeacherName = createdSession.Teacher.Name
            };

            return CreatedAtAction(nameof(GetSessions), new { id = newSession.Id }, readDto);
        }

        // ==========================================
        // 4. GET: عرض الطلبة اللي حجزوا الحصة (كشف الغياب)
        // ==========================================
        [HttpGet("{id}/bookings")]
        public async Task<ActionResult> GetSessionBookings(int id)
        {
            var sessionExists = await _context.Sessions.AnyAsync(s => s.Id == id);
            if (!sessionExists) return NotFound("الحصة غير موجودة");

            var bookings = await _context.Bookings
                .Include(b => b.Student)
                .Where(b => b.SessionId == id)
                .Select(b => new
                {
                    BookingId = b.Id,
                    StudentName = b.Student.Name,
                    
                    BookingDate = b.BookingDate,
                    Status = b.Status
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // ==========================================
        // 5. PUT: تعديل بيانات الحصة (الوقت، السعر، العنوان)
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSession(int id, SessionUpdateDto dto)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null) return NotFound("الحصة غير موجودة.");

            if (dto.StartTime < DateTime.Now)
                return BadRequest("لا يمكن تعديل الحصة لموعد قديم.");
            if (dto.EndTime <= dto.StartTime)
                return BadRequest("موعد انتهاء الحصة يجب أن يكون بعد موعد بدايتها.");

            var hasConflict = await _context.Sessions
                .AnyAsync(s => s.TeacherId == session.TeacherId &&
                               s.Id != id &&
                               s.Status != "Cancelled" &&
                               s.StartTime < dto.EndTime &&
                               dto.StartTime < s.EndTime);

            if (hasConflict)
                return BadRequest("هذا المدرس لديه حصة أخرى في التوقيت الجديد.");

            session.Title = dto.Title;
            session.StartTime = dto.StartTime;
            session.EndTime = dto.EndTime;
            session.Price = dto.Price;
            session.EducationalStage = dto.EducationalStage;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تعديل الحصة بنجاح." });
        }

        // ==========================================
        // 6. DELETE: إلغاء الحصة (Soft Delete)
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelSession(int id)
        {
            var session = await _context.Sessions
                .Include(s => s.Bookings)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound("الحصة غير موجودة.");

            if (session.Status == "Cancelled")
                return BadRequest("هذه الحصة ملغية بالفعل.");

            session.Status = "Cancelled";

            // إلغاء كل الحجوزات المرتبطة بالحصة دي
            if (session.Bookings != null)
            {
                foreach (var booking in session.Bookings)
                {
                    booking.Status = "Cancelled";
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم إلغاء الحصة وتغيير حالة جميع حجوزات الطلبة إلى 'ملغية'." });
        }
    }
}