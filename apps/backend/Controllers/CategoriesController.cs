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
    /// Controller responsible for managing product categories.
    /// Provides CRUD endpoints with duplicate validation and bilingual support.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all categories, localized by Accept-Language header.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            var language = Request.Headers["Accept-Language"].ToString();
            bool isEnglish = !string.IsNullOrEmpty(language) && language.StartsWith("en");

            if (isEnglish)
            {
                foreach (var cat in categories)
                {
                    cat.Name = !string.IsNullOrEmpty(cat.NameEn) ? cat.NameEn : cat.Name;
                }
            }

            return Ok(ApiResponse<List<Category>>.SuccessResponse(categories));
        }

        /// <summary>
        /// Retrieves a single category by ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(ApiResponse<object>.ErrorResponse("Category not found"));

            var language = Request.Headers["Accept-Language"].ToString();
            if (!string.IsNullOrEmpty(language) && language.StartsWith("en"))
            {
                category.Name = !string.IsNullOrEmpty(category.NameEn) ? category.NameEn : category.Name;
            }

            return Ok(ApiResponse<Category>.SuccessResponse(category));
        }

        /// <summary>
        /// Creates a new category. Validates that the Name is not duplicated.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            if (string.IsNullOrWhiteSpace(category.Name))
                return BadRequest(ApiResponse<object>.ErrorResponse("Category name is required."));

            var exists = await _context.Categories.AnyAsync(c => c.Name.ToLower() == category.Name.ToLower());
            if (exists) return Conflict(ApiResponse<object>.ErrorResponse($"A category with name '{category.Name}' already exists."));

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<Category>.SuccessResponse(category, "Category created successfully"));
        }

        /// <summary>
        /// Updates an existing category. Validates no duplicate names.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            if (id != category.Id) return BadRequest(ApiResponse<object>.ErrorResponse("Category ID mismatch"));

            if (string.IsNullOrWhiteSpace(category.Name))
                return BadRequest(ApiResponse<object>.ErrorResponse("Category name is required."));

            var duplicate = await _context.Categories.AnyAsync(c => c.Name.ToLower() == category.Name.ToLower() && c.Id != id);
            if (duplicate) return Conflict(ApiResponse<object>.ErrorResponse($"A category with name '{category.Name}' already exists."));

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Categories.Any(e => e.Id == id))
                    return NotFound(ApiResponse<object>.ErrorResponse("Category not found"));
                else
                    throw;
            }

            return Ok(ApiResponse<Category>.SuccessResponse(category, "Category updated successfully"));
        }

        /// <summary>
        /// Deletes a category by ID. Prevents deletion if products reference it.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(ApiResponse<object>.ErrorResponse("Category not found"));

            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts) return Conflict(ApiResponse<object>.ErrorResponse("Cannot delete category: products are assigned to it."));

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.SuccessResponse(null, "Category deleted successfully"));
        }
    }
}
