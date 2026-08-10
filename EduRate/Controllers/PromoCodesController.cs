using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduRate.Data;
using EduRate.DTOs;
using System.Threading.Tasks;

namespace EduRate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromoCodesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PromoCodesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidatePromoCode([FromBody] ValidatePromoCodeDto dto)
        {
            var promo = await _context.PromoCodes
                .FirstOrDefaultAsync(p => p.Code == dto.Code && p.IsActive);

            if (promo == null)
                return BadRequest("Invalid or inactive promo code.");

            if (promo.ExpiryDate < System.DateTime.Now)
                return BadRequest("Promo code has expired.");

            if (promo.CurrentUsageCount >= promo.MaxUsageCount)
                return BadRequest("Promo code usage limit reached.");

            return Ok(new
            {
                Message = "Promo code is valid!",
                DiscountPercentage = promo.DiscountPercentage
            });
        }
    }
}