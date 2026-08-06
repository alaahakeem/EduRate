using EduRate.Data;
using EduRate.Models;
using EduRate.DTOs;
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
    public class CentersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CentersController(AppDbContext context , IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        #region 1. CRUD (الأساسيات)

        // GET: api/centers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CenterDto>>> GetCenters([FromQuery] bool onlyVerified = false)
        {
            var query = _context.Centers.AsQueryable();
            if (onlyVerified) query = query.Where(c => c.IsVerified);

            var centers = await query.Select(c => new CenterDto
            {
                Id = c.Id,
                Name = c.Name,
                Location = c.Address,
                IsVerified = c.IsVerified
            }).ToListAsync();

            return Ok(centers);
        }

        // GET: api/centers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CenterDetailsDto>> GetCenter(int id)
        {
            var center = await _context.Centers
                .Select(c => new CenterDetailsDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Location = c.Address,
                    Latitude = c.Latitude,
                    Longitude = c.Longitude,
                    IsVerified = c.IsVerified
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (center == null) return NotFound("Center not found.");
            return Ok(center);
        }

        // POST: api/centers
        [HttpPost]
        public async Task<ActionResult<CenterDetailsDto>> CreateCenter(CenterCreateDto dto)
        {
            var center = new Center
            {
                Name = dto.Name,
                Address = dto.Location,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                IsVerified = false
            };

            _context.Centers.Add(center);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCenter), new { id = center.Id }, center);
        }

        // PUT: api/centers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCenter(int id, CenterUpdateDto dto)
        {
            var center = await _context.Centers.FindAsync(id);
            if (center == null) return NotFound("Center not found.");

            center.Name = dto.Name;
            center.Address = dto.Location;
            center.Latitude = dto.Latitude;
            center.Longitude = dto.Longitude;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/centers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCenter(int id)
        {
            var center = await _context.Centers.FindAsync(id);
            if (center == null) return NotFound("Center not found.");

            _context.Centers.Remove(center);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion

        #region 2. البحث والفلترة (تجربة الطالب)

        // GET: api/centers/search?name=X&location=Y
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<CenterDto>>> SearchCenters([FromQuery] string name, [FromQuery] string location)
        {
            var query = _context.Centers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(c => c.Name.Contains(name));

            if (!string.IsNullOrWhiteSpace(location))
                query = query.Where(c => c.Address.Contains(location));

            var centers = await query.Select(c => new CenterDto
            {
                Id = c.Id,
                Name = c.Name,
                Location = c.Address,
                IsVerified = c.IsVerified
            }).ToListAsync();

            return Ok(centers);
        }

        // GET: api/centers/nearby?lat=30.0&lng=31.2
        [HttpGet("nearby")]
        public async Task<ActionResult<IEnumerable<CenterDto>>> GetNearbyCenters([FromQuery] double lat, [FromQuery] double lng)
        {
            // تقريب بسيط باستخدام مسافة المربع (Bounding Box) لتجنب أخطاء EF Core مع العمليات الحسابية المعقدة
            double range = 0.05; // تقريباً 5 كيلو متر

            var centers = await _context.Centers
                .Where(c => c.Latitude != null && c.Longitude != null &&
                            c.Latitude >= (lat - range) && c.Latitude <= (lat + range) &&
                            c.Longitude >= (lng - range) && c.Longitude <= (lng + range))
                .Select(c => new CenterDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Location = c.Address,
                    IsVerified = c.IsVerified
                }).ToListAsync();

            return Ok(centers);
        }

        // GET: api/centers/top
        [HttpGet("top")]
        public async Task<ActionResult<IEnumerable<CenterDto>>> GetTopCenters()
        {
            // بنجيب السناتر بناءً على أعلى تقييم
            var topCenters = await _context.Centers
                .Where(c => c.IsVerified)
                .OrderByDescending(c => c.CenterReviews.Average(r => (double?)r.Rating) ?? 0)
                .Take(5)
                .Select(c => new CenterDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Location = c.Address,
                    IsVerified = c.IsVerified
                }).ToListAsync();

            return Ok(topCenters);
        }

        #endregion

        #region 3. الشغل التقيل والإدارة (ربط المدرسين)

        // GET: api/centers/5/teachers
        [HttpGet("{id}/teachers")]
        public async Task<ActionResult<IEnumerable<CenterTeacherDto>>> GetCenterTeachers(int id)
        {
            if (!await _context.Centers.AnyAsync(c => c.Id == id)) return NotFound("Center not found.");

            var teachers = await _context.TeacherCenters
                .Where(tc => tc.CenterId == id && tc.IsActive)
                .Select(tc => new CenterTeacherDto
                {
                    TeacherId = tc.Teacher.Id,
                    TeacherName = tc.Teacher.Name,
                    Subject = tc.Teacher.Subject,
                    Price = tc.Price,
                    ProfitPercentage = tc.ProfitPercentage,
                    IsActive = tc.IsActive
                }).ToListAsync();

            return Ok(teachers);
        }

        // POST: api/centers/5/teachers
        [HttpPost("{id}/teachers")]
        public async Task<IActionResult> AddTeacherToCenter(int id, AddTeacherToCenterDto dto)
        {
            if (!await _context.Centers.AnyAsync(c => c.Id == id)) return NotFound("Center not found.");

            // التأكد إن المدرس مش متضاف قبل كده في السنتر ده
            var exists = await _context.TeacherCenters.AnyAsync(tc => tc.CenterId == id && tc.TeacherId == dto.TeacherId);
            if (exists) return BadRequest("Teacher is already in this center.");

            var teacherCenter = new TeacherCenter
            {
                CenterId = id,
                TeacherId = dto.TeacherId,
                Price = dto.Price,
                ProfitPercentage = dto.ProfitPercentage,
                IsActive = true
            };

            _context.TeacherCenters.Add(teacherCenter);
            await _context.SaveChangesAsync();
            return Ok("Teacher added to center successfully.");
        }

        // PUT: api/centers/5/teachers/3/toggle-status
        [HttpPut("{id}/teachers/{teacherId}/toggle-status")]
        public async Task<IActionResult> ToggleTeacherStatus(int id, int teacherId)
        {
            var relation = await _context.TeacherCenters
                .FirstOrDefaultAsync(tc => tc.CenterId == id && tc.TeacherId == teacherId);

            if (relation == null) return NotFound("Teacher not found in this center.");

            relation.IsActive = !relation.IsActive; // بتعكس الحالة (شغال / موقوف)
            await _context.SaveChangesAsync();
            return Ok($"Teacher status changed to {(relation.IsActive ? "Active" : "Inactive")}.");
        }

        #endregion

        #region 4. التقييمات، المواعيد، الإحصائيات والتوثيق

        // GET: api/centers/5/reviews
        [HttpGet("{id}/reviews")]
        public async Task<ActionResult<IEnumerable<CenterReviewDto>>> GetCenterReviews(int id)
        {
            if (!await _context.Centers.AnyAsync(c => c.Id == id)) return NotFound();

            var reviews = await _context.Reviews
                .Where(r => r.CenterId == id)
                .Select(r => new CenterReviewDto
                {
                    Id = r.Id,
                    StudentName = r.Student.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    Date = r.CreatedAt
                }).ToListAsync();

            return Ok(reviews);
        }

        // POST: api/centers/5/reviews
        [HttpPost("{id}/reviews")]
        public async Task<IActionResult> AddCenterReview(int id, CenterReviewCreateDto dto)
        {
            if (!await _context.Centers.AnyAsync(c => c.Id == id)) return NotFound("Center not found.");

            var review = new Review
            {
                CenterId = id,
                StudentId = dto.StudentId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.Now
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return Ok("Review added successfully.");
        }

        // GET: api/centers/5/schedule
        [HttpGet("{id}/schedule")]
        public async Task<ActionResult<IEnumerable<CenterScheduleDto>>> GetCenterSchedule(int id)
        {
            if (!await _context.Centers.AnyAsync(c => c.Id == id)) return NotFound();

            var schedule = await _context.Sessions
                .Where(s => s.CenterId == id && s.StartTime >= DateTime.Now)
                .OrderBy(s => s.StartTime)
                .Select(s => new CenterScheduleDto
                {
                    SessionId = s.Id,
                    TeacherName = s.Teacher.Name,
                    Subject = s.Teacher.Subject,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime
                }).ToListAsync();

            return Ok(schedule);
        }

        // PATCH: api/centers/5/verify
        [HttpPatch("{id}/verify")]
        public async Task<IActionResult> VerifyCenter(int id)
        {
            var center = await _context.Centers.FindAsync(id);
            if (center == null) return NotFound();

            center.IsVerified = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/centers/5/stats
        [HttpGet("{id}/stats")]
        public async Task<ActionResult<CenterStatsDto>> GetCenterStats(int id)
        {
            if (!await _context.Centers.AnyAsync(c => c.Id == id)) return NotFound();

            var totalTeachers = await _context.TeacherCenters.CountAsync(tc => tc.CenterId == id && tc.IsActive);

            // بافتراض إن جدول الحجوزات اسمه Bookings ومربوط بالسنتر
            
            var totalBookings = await _context.Bookings.CountAsync(b => b.Session.CenterId == id);

            var ratings = await _context.Reviews.Where(r => r.CenterId == id).Select(r => r.Rating).ToListAsync();
            var avgRating = ratings.Any() ? ratings.Average() : 0;

            var stats = new CenterStatsDto
            {
                TotalTeachers = totalTeachers,
                TotalStudentsBooked = totalBookings,
                AverageRating = Math.Round(avgRating, 1)
            };

            return Ok(stats);
        }
        #region 5. صور السنتر (Gallery)

        // GET: api/centers/5/images
        [HttpGet("{id}/images")]
        public async Task<ActionResult<IEnumerable<CenterImageDto>>> GetCenterImages(int id)
        {
            // بنتأكد إن السنتر موجود أصلاً
            if (!await _context.Centers.AnyAsync(c => c.Id == id)) return NotFound("Center not found.");

            // بافتراض إن عندك جدول للصور اسمه CenterImages
            var images = await _context.CenterImages
                .Where(img => img.CenterId == id)
                .Select(img => new CenterImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl,
                    IsMain = img.IsMain
                }).ToListAsync();

            return Ok(images);
        }

        // POST: api/centers/5/images
        [HttpPost("{id}/images")]
        public async Task<IActionResult> AddCenterImage(int id, IFormFile file, [FromQuery] bool isMain = false)
        {
            if (!await _context.Centers.AnyAsync(c => c.Id == id)) return NotFound("Center not found.");
            if (file == null || file.Length == 0) return BadRequest("No image uploaded.");

            // 1. بنحدد المسار اللي هنحفظ فيه (مثلاً: wwwroot/uploads/centers/5)
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "centers", id.ToString());

            // لو الفولدر ده مش موجود أصلاً، نخليه يكريته
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // 2. بنعمل اسم فريد للصورة عشان لو حد رفع صورتين ليهم نفس الاسم الكود ميضربش
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // 3. هنا بقى بناخد الملف اللي جي من السواجر ونحفظه فعلياً في الهارد ديسك
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // 4. بنجهز اللينك اللي هيتخزن في الداتابيز واللي الفرونت إند هيستخدمه
            string actualUrl = $"/uploads/centers/{id}/{uniqueFileName}";

            // 5. بنسيف في الداتابيز
            var centerImage = new CenterImage
            {
                CenterId = id,
                ImageUrl = actualUrl,
                IsMain = isMain
            };

            _context.CenterImages.Add(centerImage);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Image uploaded successfully", Url = actualUrl });
        }

        #endregion
        #endregion
    }
}