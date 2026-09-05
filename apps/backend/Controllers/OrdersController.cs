using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Data;
using BackendAPI.Models;
using System.Collections.Generic;

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

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Person)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .ToListAsync();
                
            return Ok(ApiResponse<List<Order>>.SuccessResponse(orders));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Person)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
                
            if (order == null) return NotFound(ApiResponse<object>.ErrorResponse("Order not found"));
            return Ok(ApiResponse<Order>.SuccessResponse(order));
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            order.OrderDate = DateTime.UtcNow;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<Order>.SuccessResponse(order, "Order created successfully"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (id != order.Id) return BadRequest(ApiResponse<object>.ErrorResponse("Order ID mismatch"));

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Orders.Any(e => e.Id == id))
                    return NotFound(ApiResponse<object>.ErrorResponse("Order not found"));
                else
                    throw;
            }

            return Ok(ApiResponse<Order>.SuccessResponse(order, "Order updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(ApiResponse<object>.ErrorResponse("Order not found"));

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.SuccessResponse(null, "Order deleted successfully"));
        }
    }
}
