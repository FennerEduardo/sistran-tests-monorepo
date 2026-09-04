using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Data;
using BackendAPI.Models;
using System.Collections.Generic;

namespace BackendAPI.Controllers
{
    /// <summary>
    /// Controller responsible for managing products and the e-commerce store catalog.
    /// Provides CRUD endpoints and localized responses based on Accept-Language.
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
        /// Retrieves the list of products localized according to Accept-Language header.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            
            var language = Request.Headers["Accept-Language"].ToString();
            bool isEnglish = !string.IsNullOrEmpty(language) && language.StartsWith("en");

            if (isEnglish)
            {
                foreach (var product in products)
                {
                    product.Title = !string.IsNullOrEmpty(product.TitleEn) ? product.TitleEn : product.Title;
                    product.Description = !string.IsNullOrEmpty(product.DescriptionEn) ? product.DescriptionEn : product.Description;
                }
            }

            return Ok(ApiResponse<List<Product>>.SuccessResponse(products));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(ApiResponse<object>.ErrorResponse("Product not found"));

            var language = Request.Headers["Accept-Language"].ToString();
            if (!string.IsNullOrEmpty(language) && language.StartsWith("en"))
            {
                product.Title = !string.IsNullOrEmpty(product.TitleEn) ? product.TitleEn : product.Title;
                product.Description = !string.IsNullOrEmpty(product.DescriptionEn) ? product.DescriptionEn : product.Description;
            }

            return Ok(ApiResponse<Product>.SuccessResponse(product));
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<Product>.SuccessResponse(product, "Product created successfully"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id) return BadRequest(ApiResponse<object>.ErrorResponse("Product ID mismatch"));

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id))
                    return NotFound(ApiResponse<object>.ErrorResponse("Product not found"));
                else
                    throw;
            }

            return Ok(ApiResponse<Product>.SuccessResponse(product, "Product updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(ApiResponse<object>.ErrorResponse("Product not found"));

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.SuccessResponse(null, "Product deleted successfully"));
        }
    }
}
