using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Data;
using BackendAPI.Models;

namespace BackendAPI.Controllers
{
    /// <summary>
    /// Controller responsible for managing person registration and retrieval.
    /// Fulfills the constraints specified in requirement 14 of the SISTRAN technical test.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PersonsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PersonsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Registers a new person in the system, validating their data and the number of contacts.
        /// </summary>
        /// <param name="person">The object containing the person's information to be registered.</param>
        /// <returns>The created person if validation is successful, or an error if business rules are not met.</returns>
        [HttpPost]
        public async Task<IActionResult> RegisterPerson([FromBody] Person person)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<object>.ErrorResponse("Validación fallida", errors));
            }

            var exists = await _context.Persons.AnyAsync(p => p.DocumentId == person.DocumentId);
            if (exists)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Ya existe una persona con ese documento de identidad."));
            }

            var phoneCount = person.Contacts.Count(c => c.Type == "Phone");
            var emailCount = person.Contacts.Count(c => c.Type == "Email");
            var addressCount = person.Contacts.Count(c => c.Type == "Address");

            if (phoneCount > 2) return BadRequest(ApiResponse<object>.ErrorResponse("Máximo 2 números telefónicos permitidos."));
            if (emailCount > 2) return BadRequest(ApiResponse<object>.ErrorResponse("Máximo 2 correos electrónicos permitidos."));
            if (addressCount > 2) return BadRequest(ApiResponse<object>.ErrorResponse("Máximo 2 direcciones físicas permitidas."));

            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<Person>.SuccessResponse(person, "Persona registrada exitosamente."));
        }

        [HttpGet]
        public async Task<IActionResult> GetPersons()
        {
            var persons = await _context.Persons.Include(p => p.Contacts).ToListAsync();
            return Ok(ApiResponse<System.Collections.Generic.List<Person>>.SuccessResponse(persons));
        }
    }
}
