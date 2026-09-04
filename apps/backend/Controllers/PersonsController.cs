using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Data;
using BackendAPI.Models;

namespace BackendAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PersonsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterPerson([FromBody] Person person)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar existencia de documento
            var exists = await _context.Persons.AnyAsync(p => p.DocumentId == person.DocumentId);
            if (exists)
            {
                return BadRequest(new { message = "Ya existe una persona con ese documento de identidad." });
            }

            // Validar límites de contactos
            var phoneCount = person.Contacts.Count(c => c.Type == "Phone");
            var emailCount = person.Contacts.Count(c => c.Type == "Email");
            var addressCount = person.Contacts.Count(c => c.Type == "Address");

            if (phoneCount > 2) return BadRequest(new { message = "Máximo 2 números telefónicos permitidos." });
            if (emailCount > 2) return BadRequest(new { message = "Máximo 2 correos electrónicos permitidos." });
            if (addressCount > 2) return BadRequest(new { message = "Máximo 2 direcciones físicas permitidas." });

            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            return Ok(person);
        }

        [HttpGet]
        public async Task<IActionResult> GetPersons()
        {
            var persons = await _context.Persons.Include(p => p.Contacts).ToListAsync();
            return Ok(persons);
        }
    }
}
