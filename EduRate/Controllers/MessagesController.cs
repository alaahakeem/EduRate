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
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            var message = new Message
            {
                StudentId = dto.StudentId,
                TeacherId = dto.TeacherId,
                SenderRole = dto.SenderRole,
                Content = dto.Content,
                SentAt = System.DateTime.Now,
                IsRead = false
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok("Message sent successfully.");
        }

        [HttpGet("conversation/{studentId}/{teacherId}")]
        public async Task<IActionResult> GetConversation(int studentId, int teacherId)
        {
            var messages = await _context.Messages
                .Where(m => m.StudentId == studentId && m.TeacherId == teacherId)
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    Content = m.Content,
                    SenderRole = m.SenderRole,
                    SentAt = m.SentAt,
                    IsRead = m.IsRead
                })
                .ToListAsync();

            return Ok(messages);
        }
    }
}