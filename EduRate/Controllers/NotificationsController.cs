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
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationsController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 💡 دالة مساعدة عشان نحدد إحنا بنجيب إشعارات مين بالظبط (بدون تكرار كود)
        // ==========================================
        private IQueryable<Notification> GetUserNotificationsQuery(string userType, int userId)
        {
            var query = _context.Notifications.AsQueryable();

            return userType.ToLower() switch
            {
                "student" => query.Where(n => n.StudentId == userId),
                "teacher" => query.Where(n => n.TeacherId == userId),
                "center" => query.Where(n => n.CenterId == userId),
                _ => null       
                // لو كتب نوع غلط
            };
        }

        // ==========================================
        // 1. GET: جلب أحدث 50 إشعار للمستخدم
        // ==========================================
        [HttpGet("{userType}/{userId}")]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications(string userType, int userId)
        {
            var query = GetUserNotificationsQuery(userType, userId);
            if (query == null) return BadRequest(new { message = "نوع المستخدم غير صحيح. يجب أن يكون student, teacher, أو center." });

            var notifications = await query
                .OrderByDescending(n => n.CreatedAt)
                .Take(50) // بنجيب أحدث 50 بس عشان الأداء
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // ==========================================
        // 2. GET: جلب عدد الإشعارات غير المقروءة (عشان أيقونة الجرس)
        // ==========================================
        [HttpGet("{userType}/{userId}/unread-count")]
        public async Task<ActionResult> GetUnreadCount(string userType, int userId)
        {
            var query = GetUserNotificationsQuery(userType, userId);
            if (query == null) return BadRequest(new { message = "نوع المستخدم غير صحيح" });

            var count = await query.CountAsync(n => !n.IsRead);
            return Ok(new { unreadCount = count });
        }

        // ==========================================
        // 3. PUT: تحديد إشعار معين كمقروء
        // ==========================================
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound(new { message = "الإشعار غير موجود" });

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تحديد الإشعار كمقروء" });
        }

        // ==========================================
        // 4. PUT: تحديد كل إشعارات المستخدم كمقروءة
        // ==========================================
        [HttpPut("{userType}/{userId}/read-all")]
        public async Task<IActionResult> MarkAllAsRead(string userType, int userId)
        {
            var query = GetUserNotificationsQuery(userType, userId);
            if (query == null) return BadRequest(new { message = "نوع المستخدم غير صحيح" });

            var unreadNotifications = await query.Where(n => !n.IsRead).ToListAsync();

            if (!unreadNotifications.Any()) return Ok(new { message = "لا يوجد إشعارات جديدة" });

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تحديد جميع الإشعارات كمقروءة" });
        }
    }
}