using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models
{
    public class Person
    {
        public int Id { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "El documento de identidad sólo acepta valores alfanuméricos.")]
        public string DocumentId { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Los nombres sólo aceptan caracteres del alfabeto latino y no pueden contener números.")]
        public string FirstName { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Los apellidos sólo aceptan caracteres del alfabeto latino y no pueden contener números.")]
        public string LastName { get; set; }

        [Required]
        public DateTime BirthDate { get; set; }

        public List<ContactInfo> Contacts { get; set; } = new List<ContactInfo>();
    }

    public class ContactInfo
    {
        public int Id { get; set; }
        public string Type { get; set; } // "Phone", "Email", "Address"
        public string Value { get; set; }
        
        public int PersonId { get; set; }
        public Person Person { get; set; }
    }
}
