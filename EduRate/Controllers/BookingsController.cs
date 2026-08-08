using EduRate.Data;
using EduRate.DTOs;
using EduRate.Models;
using EduRate.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EduRate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public BookingsController(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;

        }
        [HttpPost]
        public async Task<ActionResult<BookingReaddDto>> CreateBooking(BookingCreateDto dto)
        {
            var studentExists = await _context.Students.AnyAsync(s => s.Id == dto.StudentId);
            if (!studentExists) return BadRequest("الطالب غير موجود.");

            var session = await _context.Sessions.FindAsync(dto.SessionId);
            if (session == null) return BadRequest("الحصة غير موجودة.");

            if (session.Status == "Cancelled")
                return BadRequest("لا يمكن الحجز في حصة ملغية.");

            if (session.StartTime < DateTime.Now)
                return BadRequest("لا يمكن الحجز في حصة انتهى موعدها أو بدأت بالفعل.");

            // منع الحجز المزدوج لنفس الحصة
            var alreadyBooked = await _context.Bookings
                .AnyAsync(b => b.StudentId == dto.StudentId && b.SessionId == dto.SessionId && b.Status != "Cancelled");

            if (alreadyBooked)
                return BadRequest("لقد قمت بحجز هذه الحصة مسبقاً.");

            // منع تعارض مواعيد الطالب
            var hasTimeConflict = await _context.Bookings
                .Include(b => b.Session)
                .AnyAsync(b => b.StudentId == dto.StudentId &&
                               b.Status != "Cancelled" &&
                               b.Session.StartTime < session.EndTime &&
                               session.StartTime < b.Session.EndTime);

            if (hasTimeConflict)
                return BadRequest("لديك حجز آخر يتعارض مع توقيت هذه الحصة.");

            var booking = new Booking
            {
                StudentId = dto.StudentId,
                SessionId = dto.SessionId,
                BookingDate = DateTime.Now,
                Status = "Pending",
                IsAttended = false
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // 💡 إحنا هنسيب السطر بتاعك اللي بيجيب الداتا كاملة زي ما هو، وهنستغله للإشعارات
            var createdBooking = await _context.Bookings
                .Include(b => b.Student)
                .Include(b => b.Session).ThenInclude(s => s.Teacher)
                .Include(b => b.Session).ThenInclude(s => s.Center)
                .FirstOrDefaultAsync(b => b.Id == booking.Id);

            // ==========================================
            // 💡 إضافة كود الإشعارات هنا (استخدمنا الأسماء من createdBooking)
            // ==========================================
            if (createdBooking != null)
            {
                // 1. إشعار للطالب
                await _notificationService.SendToStudentAsync(
                    dto.StudentId,
                    "تم تأكيد حجزك! 🎉",
                    $"تم تأكيد حجزك بنجاح في الحصة '{createdBooking.Session.Title}'. استعد للمذاكرة!"
                );

                // 2. إشعار للمدرس
                await _notificationService.SendToTeacherAsync(
                    createdBooking.Session.Teacher.Id,
                    "حجز جديد! 📅",
                    $"قام الطالب {createdBooking.Student.Name} بحجز مقعد في حصتك '{createdBooking.Session.Title}'."
                );

                // 3. إشعار للسنتر
                await _notificationService.SendToCenterAsync(
                    createdBooking.Session.Center.Id,
                    "تأكيد حجز جديد 🏢",
                    $"تم حجز مقعد جديد للطالب {createdBooking.Student.Name} في الحصة الخاصة بالمدرس {createdBooking.Session.Teacher.Name}."
                );
            }
            // ==========================================

            var readDto = new BookingReaddDto
            {
                Id = createdBooking.Id,
                BookingDate = createdBooking.BookingDate,
                IsAttended = createdBooking.IsAttended,
                Status = createdBooking.Status,
                SessionId = createdBooking.Session.Id,
                SessionTitle = createdBooking.Session.Title,
                SessionStartTime = createdBooking.Session.StartTime,
                SessionEndTime = createdBooking.Session.EndTime,
                SessionPrice = createdBooking.Session.Price,
                TeacherName = createdBooking.Session.Teacher.Name,
                CenterName = createdBooking.Session.Center.Name,
                StudentId = createdBooking.Student.Id,
                StudentName = createdBooking.Student.Name
            };

            return CreatedAtAction(nameof(GetStudentBookings), new { studentId = dto.StudentId }, readDto);
        }

        // ==========================================
        // 2. GET: عرض حجوزات طالب معين (للطالب)
        // ==========================================
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<BookingReaddDto>>> GetStudentBookings(int studentId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Student)
                .Include(b => b.Session).ThenInclude(s => s.Teacher)
                .Include(b => b.Session).ThenInclude(s => s.Center)
                .Where(b => b.StudentId == studentId)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingReaddDto
                {
                    Id = b.Id,
                    BookingDate = b.BookingDate,
                    IsAttended = b.IsAttended,
                    Status = b.Status,
                    SessionId = b.Session.Id,
                    SessionTitle = b.Session.Title,
                    SessionStartTime = b.Session.StartTime,
                    SessionEndTime = b.Session.EndTime,
                    SessionPrice = b.Session.Price,
                    TeacherName = b.Session.Teacher.Name,
                    CenterName = b.Session.Center.Name,
                    StudentId = b.Student.Id,
                    StudentName = b.Student.Name
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // ==========================================
        // 3. PATCH: تسجيل حضور الطالب (للسنتر)
        // ==========================================
        [HttpPatch("{id}/attendance")]
        public async Task<IActionResult> MarkAttendance(int id, [FromBody] bool isAttended)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound("الحجز غير موجود.");

            if (booking.Status == "Cancelled")
                return BadRequest("لا يمكن تسجيل حضور لحجز ملغي.");

            booking.IsAttended = isAttended;
            await _context.SaveChangesAsync();

            return Ok(new { message = isAttended ? "تم تسجيل الحضور بنجاح." : "تم إلغاء الحضور." });
        }

        // ==========================================
        // 4. DELETE: إلغاء الحجز (للطالب)
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound("الحجز غير موجود.");

            if (booking.Status == "Cancelled")
                return BadRequest("الحجز ملغي بالفعل.");

            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم إلغاء الحجز بنجاح." });
        }

        // ==========================================
        // 5. GET: عرض حجوزات المدرس (لداشبورد المدرس)
        // ==========================================
        [HttpGet("teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<BookingReaddDto>>> GetTeacherBookings(int teacherId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Student)
                .Include(b => b.Session).ThenInclude(s => s.Teacher)
                .Include(b => b.Session).ThenInclude(s => s.Center)
                .Where(b => b.Session.TeacherId == teacherId)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingReaddDto
                {
                    Id = b.Id,
                    BookingDate = b.BookingDate,
                    IsAttended = b.IsAttended,
                    Status = b.Status,
                    SessionId = b.Session.Id,
                    SessionTitle = b.Session.Title,
                    SessionStartTime = b.Session.StartTime,
                    SessionEndTime = b.Session.EndTime,
                    SessionPrice = b.Session.Price,
                    TeacherName = b.Session.Teacher.Name,
                    CenterName = b.Session.Center.Name,
                    StudentId = b.Student.Id,
                    StudentName = b.Student.Name
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // ==========================================
        // 6. GET: عرض حجوزات السنتر (لداشبورد السنتر)
        // ==========================================
        [HttpGet("center/{centerId}")]
        public async Task<ActionResult<IEnumerable<BookingReaddDto>>> GetCenterBookings(int centerId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Student)
                .Include(b => b.Session).ThenInclude(s => s.Teacher)
                .Include(b => b.Session).ThenInclude(s => s.Center)
                .Where(b => b.Session.CenterId == centerId)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingReaddDto
                {
                    Id = b.Id,
                    BookingDate = b.BookingDate,
                    IsAttended = b.IsAttended,
                    Status = b.Status,
                    SessionId = b.Session.Id,
                    SessionTitle = b.Session.Title,
                    SessionStartTime = b.Session.StartTime,
                    SessionEndTime = b.Session.EndTime,
                    SessionPrice = b.Session.Price,
                    TeacherName = b.Session.Teacher.Name,
                    CenterName = b.Session.Center.Name,
                    StudentId = b.Student.Id,
                    StudentName = b.Student.Name
                })
                .ToListAsync();

            return Ok(bookings);
        }
    }
}