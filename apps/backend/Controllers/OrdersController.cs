using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BackendAPI.Data;
using BackendAPI.Models;

namespace BackendAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            order.OrderDate = DateTime.UtcNow;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(order);
        }
    }
}
