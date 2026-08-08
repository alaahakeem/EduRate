using System.Threading.Tasks;
using EduRate.Data;
using EduRate.Models;

namespace EduRate.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SendToStudentAsync(int studentId, string title, string message)
        {
            var notification = new Notification { StudentId = studentId, Title = title, Message = message };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task SendToTeacherAsync(int teacherId, string title, string message)
        {
            var notification = new Notification { TeacherId = teacherId, Title = title, Message = message };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task SendToCenterAsync(int centerId, string title, string message)
        {
            var notification = new Notification { CenterId = centerId, Title = title, Message = message };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }
}