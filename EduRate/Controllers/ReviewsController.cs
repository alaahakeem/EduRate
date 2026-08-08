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
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public ReviewsController(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        // ==========================================
        // 1. POST: إضافة أو تحديث تقييم (مدرس، سنتر، أو حصة)
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> AddOrUpdateReview(ReviewCreateDto dto)
        {
            // 1. Target Validation: التأكد إن التقييم رايح لجهة واحدة بس
            int targetCount = (dto.TeacherId.HasValue ? 1 : 0) +
                              (dto.CenterId.HasValue ? 1 : 0) +
                              (dto.SessionId.HasValue ? 1 : 0);

            if (targetCount != 1)
            {
                return BadRequest(new { message = "يجب تحديد جهة تقييم واحدة فقط (مدرس، سنتر، أو حصة)." });
            }

            // 2. Attendance Validation: التأكد من حضور الطالب الفعلي
            bool hasAttended = false;

            if (dto.SessionId != null)
            {
                hasAttended = await _context.Bookings
                    .AnyAsync(b => b.StudentId == dto.StudentId && b.SessionId == dto.SessionId && b.IsAttended == true);
            }
            else if (dto.TeacherId != null)
            {
                hasAttended = await _context.Bookings
                    .Include(b => b.Session)
                    .AnyAsync(b => b.StudentId == dto.StudentId && b.Session.TeacherId == dto.TeacherId && b.IsAttended == true);
            }
            else if (dto.CenterId != null)
            {
                hasAttended = await _context.Bookings
                    .Include(b => b.Session)
                    .AnyAsync(b => b.StudentId == dto.StudentId && b.Session.CenterId == dto.CenterId && b.IsAttended == true);
            }

            if (!hasAttended)
            {
                return BadRequest(new { message = "عذراً، لا يمكنك التقييم إلا بعد حضور حصة فعلية." });
            }

            // 3. Anti-Spam & 15-Min Rule: البحث عن تقييم سابق لنفس الهدف
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.StudentId == dto.StudentId &&
                                     ((dto.TeacherId != null && r.TeacherId == dto.TeacherId) ||
                                      (dto.CenterId != null && r.CenterId == dto.CenterId) ||
                                      (dto.SessionId != null && r.SessionId == dto.SessionId)));

            if (existingReview != null)
            {
                // حساب الوقت اللي عدى على التقييم الأول
                var timePassed = DateTime.Now - existingReview.CreatedAt;

                if (timePassed.TotalMinutes > 15)
                {
                    return BadRequest(new { message = "عذراً، لا يمكنك تعديل التقييم بعد مرور 15 دقيقة من نشره الأصلي." });
                }

                // تحديث التقييم القديم (مش بنغير وقت الإنشاء عشان الـ 15 دقيقة تفضل تتحسب صح)
                existingReview.Rating = dto.Rating;
                existingReview.Comment = dto.Comment;
                existingReview.IsAnonymous = dto.IsAnonymous;
            }
            else
            {
                // إضافة تقييم جديد
                var newReview = new Review
                {
                    StudentId = dto.StudentId,
                    TeacherId = dto.TeacherId,
                    CenterId = dto.CenterId,
                    SessionId = dto.SessionId,
                    Rating = dto.Rating,
                    Comment = dto.Comment,
                    IsAnonymous = dto.IsAnonymous,
                    IsVerified = true,
                    CreatedAt = DateTime.Now
                };
                _context.Reviews.Add(newReview);
            }

           
            await _context.SaveChangesAsync();

            // 4. Auto-Calculate Average: تحديث المتوسط العام
            if (dto.TeacherId != null)
                await UpdateTeacherAverageRating(dto.TeacherId.Value);

            // لو عندك AverageRating للسنتر تقدري تفكي الكومنت هنا
            // if (dto.CenterId != null)
            //     await UpdateCenterAverageRating(dto.CenterId.Value);

            // ==========================================
            // 💡 إرسال إشعار للمدرس أو السنتر بعد نجاح التقييم
            // ==========================================
            if (dto.TeacherId.HasValue)
            {
                await _notificationService.SendToTeacherAsync(
                    dto.TeacherId.Value,
                    "تقييم جديد! 🌟",
                    $"قام أحد الطلاب بإضافة تقييم جديد لك بـ {dto.Rating} نجوم."
                );
            }
            else if (dto.CenterId.HasValue)
            {
                await _notificationService.SendToCenterAsync(
                    dto.CenterId.Value,
                    "تقييم جديد للسنتر! 🏢",
                    $"حصل السنتر على تقييم جديد بـ {dto.Rating} نجوم من أحد الطلاب."
                );
            }

            return Ok(new { message = "تم حفظ التقييم بنجاح." });
        }

        // ==========================================
        // 2. GET: عرض تقييمات المدرس (باستخدام ReviewReaddDto)
        // ==========================================
        [HttpGet("teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<ReviewReaddDto>>> GetTeacherReviews(int teacherId)
        {
            var editDeadline = DateTime.Now.AddMinutes(-15);

            var reviews = await _context.Reviews
                .Include(r => r.Student)
                .Where(r => r.TeacherId == teacherId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewReaddDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    IsAnonymous = r.IsAnonymous,
                    StudentName = r.IsAnonymous ? "طالب مجهول" : r.Student.Name,

                    // إرسال حالة السماح بالتعديل للفرونت إند عشان يظهر/يخفي الزرار
                    CanEdit = r.CreatedAt >= editDeadline
                }).ToListAsync();

            return Ok(reviews);
        }

        // ==========================================
        // 3. GET: عرض تقييمات الحصة (باستخدام ReviewReaddDto)
        // ==========================================
        [HttpGet("session/{sessionId}")]
        public async Task<ActionResult<IEnumerable<ReviewReaddDto>>> GetSessionReviews(int sessionId)
        {
            var editDeadline = DateTime.Now.AddMinutes(-15);

            var reviews = await _context.Reviews
                .Include(r => r.Student)
                .Where(r => r.SessionId == sessionId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewReaddDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    IsAnonymous = r.IsAnonymous,
                    StudentName = r.IsAnonymous ? "طالب مجهول" : r.Student.Name,

                    CanEdit = r.CreatedAt >= editDeadline
                }).ToListAsync();

            return Ok(reviews);
        }

        // ==========================================
        // 4. GET: عرض تقييمات السنتر (باستخدام ReviewReaddDto)
        // ==========================================
        [HttpGet("center/{centerId}")]
        public async Task<ActionResult<IEnumerable<ReviewReaddDto>>> GetCenterReviews(int centerId)
        {
            var centerExists = await _context.Centers.AnyAsync(c => c.Id == centerId);
            if (!centerExists) return NotFound(new { message = "السنتر غير موجود" });

            var editDeadline = DateTime.Now.AddMinutes(-15);

            var reviews = await _context.Reviews
                .Include(r => r.Student)
                .Where(r => r.CenterId == centerId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewReaddDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    IsAnonymous = r.IsAnonymous,
                    // إخفاء الاسم لو التقييم مجهول
                    StudentName = r.IsAnonymous ? "طالب مجهول" : r.Student.Name,
                    // حالة السماح بالتعديل
                    CanEdit = r.CreatedAt >= editDeadline
                })
                .ToListAsync();

            if (!reviews.Any()) return NotFound(new { message = "لا يوجد تقييمات لهذا السنتر حتى الآن" });

            return Ok(reviews);
        }

        // ==========================================
        // دوال مساعدة لحساب وتحديث التقييم العام (Private Helpers)
        // ==========================================
        private async Task UpdateTeacherAverageRating(int teacherId)
        {
            var teacher = await _context.Teachers.FindAsync(teacherId);
            if (teacher == null) return;

            var reviews = await _context.Reviews.Where(r => r.TeacherId == teacherId).ToListAsync();

            if (reviews.Any())
            {
                teacher.AverageRating = reviews.Average(r => r.Rating);
                teacher.TotalReviews = reviews.Count;
            }
            else
            {
                teacher.AverageRating = 0;
                teacher.TotalReviews = 0;
            }
            await _context.SaveChangesAsync();
        }
    }
}