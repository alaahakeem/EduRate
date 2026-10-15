using EduRate.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace EduRate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // متاح فقط للأدمن
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Get Dashboard Stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalStudents = await _context.Students.CountAsync();
            var totalTeachers = await _context.Teachers.CountAsync();
            var totalCenters = await _context.Centers.CountAsync();
            
            // Assuming platform takes a cut, but for now Total Revenue is sum of all confirmed bookings
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == "Confirmed" || b.Status == "Success")
                .Join(_context.Sessions, b => b.SessionId, s => s.Id, (b, s) => s.Price)
                .SumAsync();

            var activeCourses = await _context.Sessions.CountAsync(s => s.Status == "Available" && s.StartTime > System.DateTime.Now);
            var pendingCenters = await _context.Centers.CountAsync(c => !c.IsVerified);

            return Ok(new
            {
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                TotalCenters = totalCenters,
                TotalRevenue = totalRevenue,
                ActiveCourses = activeCourses,
                PendingRequests = pendingCenters
            });
        }

        // 2. Get Recent Transactions (Bookings)
        [HttpGet("recent-transactions")]
        public async Task<IActionResult> GetRecentTransactions()
        {
            var transactions = await _context.Bookings
                .Include(b => b.Student)
                .Include(b => b.Session)
                .OrderByDescending(b => b.BookingDate)
                .Take(10)
                .Select(b => new
                {
                    Id = $"#TRX-{b.Id:D4}",
                    StudentName = b.Student.Name,
                    Date = b.BookingDate.ToString("yyyy-MM-dd"),
                    Amount = b.Session.Price,
                    Status = b.Status == "Confirmed" ? "Success" : b.Status
                })
                .ToListAsync();

            return Ok(transactions);
        }

        // 3. Get Pending Approvals (Centers)
        [HttpGet("pending-approvals")]
        public async Task<IActionResult> GetPendingApprovals()
        {
            var pending = await _context.Centers
                .Where(c => !c.IsVerified)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    Location = c.Address,
                    DocStatus = "Pending"
                })
                .ToListAsync();

            return Ok(pending);
        }

        public class AdminUserDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public string Status { get; set; }
        }

        // 4. Get All Users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try 
            {
                var students = await _context.Students.Select(s => new AdminUserDto { Id = s.Id, Name = s.Name, Email = s.Email ?? "", Role = "Student", Status = "Active" }).ToListAsync();
                var teachers = await _context.Teachers.Select(t => new AdminUserDto { Id = t.Id, Name = t.Name, Email = "", Role = "Teacher", Status = "Active" }).ToListAsync();
                var centers = await _context.Centers.Select(c => new AdminUserDto { Id = c.Id, Name = c.Name, Email = "", Role = "Center", Status = c.IsVerified ? "Active" : "Pending" }).ToListAsync();

                var allUsers = students.Concat(teachers).Concat(centers).ToList();
                return Ok(allUsers);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // توثيق السناتر (Approve Center)
        [HttpPost("verify-center/{id}")]
        public async Task<IActionResult> VerifyCenter(int id)
        {
            var center = await _context.Centers.FirstOrDefaultAsync(c => c.Id == id);
            if (center == null)
                return NotFound(new { message = "Center not found" });

            center.IsVerified = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Center verified successfully!" });
        }
    }
}
