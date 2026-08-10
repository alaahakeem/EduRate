using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduRate.Data;
using EduRate.DTOs;
using EduRate.Models;
using System.Linq;
using System.Threading.Tasks;

namespace EduRate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. Profile Management
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound("Student not found.");

            var dto = new StudentProfileDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                EducationalStage = student.EducationalStage.ToString(),
                Governorate = student.Governorate,
                Region = student.Region,
                ParentPhoneNumber = student.ParentPhoneNumber,
                WalletBalance = student.WalletBalance,
                RewardPoints = student.RewardPoints
            };
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateStudentProfileDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound("Student not found.");

            student.Name = dto.Name;
            student.ParentPhoneNumber = dto.ParentPhoneNumber;
            student.EducationalStage = dto.EducationalStage;

            await _context.SaveChangesAsync();
            return Ok("Profile updated successfully.");
        }

        // ==========================================
        // 2. Location Management
        // ==========================================
        [HttpPut("{id}/location")]
        public async Task<IActionResult> UpdateLocation(int id, [FromBody] UpdateLocationDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound("Student not found.");

            student.Governorate = dto.Governorate;
            student.Region = dto.Region;
            student.Latitude = dto.Latitude;
            student.Longitude = dto.Longitude;

            await _context.SaveChangesAsync();
            return Ok("Location updated successfully.");
        }

        // ==========================================
        // 3. Wallet & Rewards
        // ==========================================
        [HttpGet("{id}/wallet")]
        public async Task<IActionResult> GetWalletInfo(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound("Student not found.");

            return Ok(new WalletInfoDto
            {
                WalletBalance = student.WalletBalance,
                RewardPoints = student.RewardPoints
            });
        }

        [HttpPut("{id}/wallet/charge")]
        public async Task<IActionResult> ChargeWallet(int id, [FromBody] ChargeWalletDto dto)
        {
            if (dto.Amount <= 0) return BadRequest("Amount must be greater than zero.");

            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound("Student not found.");

            student.WalletBalance += dto.Amount;
            await _context.SaveChangesAsync();
            return Ok($"Wallet charged successfully. New balance: {student.WalletBalance}");
        }

        [HttpPut("{id}/rewards/redeem")]
        public async Task<IActionResult> RedeemPoints(int id, [FromBody] RedeemPointsDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound("Student not found.");

            if (student.RewardPoints < dto.Points)
                return BadRequest("Not enough reward points.");

            // كل 100 نقطة بـ 10 جنيه كمثال للـ Business Logic
            decimal cashValue = (dto.Points / 100) * 10;

            student.RewardPoints -= dto.Points;
            student.WalletBalance += cashValue;

            await _context.SaveChangesAsync();
            return Ok($"Points redeemed for {cashValue} EGP. New balance: {student.WalletBalance}");
        }

        // ==========================================
        // 4. Bookings
        // ==========================================
        [HttpGet("{id}/bookings")]
        public async Task<IActionResult> GetBookings(int id)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Session)
                .Where(b => b.StudentId == id)
                .Select(b => new StudentBookingDto
                {
                    BookingId = b.Id,
                    SessionTitle = b.Session.Title,
                    StartTime = b.Session.StartTime,
                    EndTime = b.Session.EndTime,
                    Status = b.Status,
                    IsAttended = b.IsAttended
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // ==========================================
        // 5. Reviews
        // ==========================================
        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetReviews(int id)
        {
            var reviews = await _context.Reviews
                .Include(r => r.Teacher)
                .Include(r => r.Center)
                .Where(r => r.StudentId == id)
                .Select(r => new StudentReviewDto
                {
                    ReviewId = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    TargetName = r.TeacherId != null ? r.Teacher.Name : r.Center.Name
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // ==========================================
        // 6. Notifications
        // ==========================================
        [HttpGet("{id}/notifications")]
        public async Task<IActionResult> GetNotifications(int id)
        {
            var notifications = await _context.Notifications
                .Where(n => n.StudentId == id)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new StudentNotificationDto
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

        [HttpPut("{id}/notifications/mark-all-read")]
        public async Task<IActionResult> MarkAllNotificationsAsRead(int id)
        {
            var unreadNotifications = await _context.Notifications
                .Where(n => n.StudentId == id && !n.IsRead)
                .ToListAsync();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return Ok("All notifications marked as read.");
        }

        // ==========================================
        // 7. Favorites
        // ==========================================
        [HttpGet("{id}/favorites")]
        public async Task<IActionResult> GetFavorites(int id)
        {
            var favorites = await _context.StudentFavorites
                .Include(f => f.Teacher)
                .Include(f => f.Center)
                .Where(f => f.StudentId == id)
                .Select(f => new StudentFavoriteDto
                {
                    FavoriteId = f.Id,
                    TeacherId = f.TeacherId,
                    TeacherName = f.Teacher != null ? f.Teacher.Name : null,
                    CenterId = f.CenterId,
                    CenterName = f.Center != null ? f.Center.Name : null
                })
                .ToListAsync();

            return Ok(favorites);
        }

        [HttpPost("{id}/favorites")]
        public async Task<IActionResult> AddFavorite(int id, [FromBody] AddFavoriteDto dto)
        {
            if (dto.TeacherId == null && dto.CenterId == null)
                return BadRequest("You must provide either a TeacherId or a CenterId.");

            // نمنع إضافة المدرس أو السنتر مرتين
            var exists = await _context.StudentFavorites.AnyAsync(f =>
                f.StudentId == id &&
                ((dto.TeacherId != null && f.TeacherId == dto.TeacherId) ||
                 (dto.CenterId != null && f.CenterId == dto.CenterId)));

            if (exists) return BadRequest("This item is already in favorites.");

            var favorite = new StudentFavorite
            {
                StudentId = id,
                TeacherId = dto.TeacherId,
                CenterId = dto.CenterId,
                CreatedAt = System.DateTime.Now
            };

            _context.StudentFavorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok("Added to favorites successfully.");
        }

        [HttpDelete("{id}/favorites/{favoriteId}")]
        public async Task<IActionResult> RemoveFavorite(int id, int favoriteId)
        {
            var favorite = await _context.StudentFavorites
                .FirstOrDefaultAsync(f => f.Id == favoriteId && f.StudentId == id);

            if (favorite == null) return NotFound("Favorite not found.");

            _context.StudentFavorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok("Removed from favorites successfully.");
        }
    }
}