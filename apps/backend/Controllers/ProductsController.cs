using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Data;
using BackendAPI.Models;

namespace BackendAPI.Controllers
{
    /// <summary>
    /// Controller responsible for managing products and the e-commerce store catalog.
    /// Provides endpoints to list available products for the store.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves the complete list of products available in the store.
        /// </summary>
        /// <returns>A list of product objects.</returns>
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(ApiResponse<System.Collections.Generic.List<Product>>.SuccessResponse(products));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(ApiResponse<object>.ErrorResponse("Product not found"));
            return Ok(ApiResponse<Product>.SuccessResponse(product));
        }
    }
}
