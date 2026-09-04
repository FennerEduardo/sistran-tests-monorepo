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
        /// <summary>
        /// The person's first name.
        /// </summary>
        public string FirstName { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Los apellidos sólo aceptan caracteres del alfabeto latino y no pueden contener números.")]
        /// <summary>
        /// The person's last name.
        /// </summary>
        public string LastName { get; set; }

        [Required]
        /// <summary>
        /// The person's date of birth.
        /// </summary>
        public DateTime BirthDate { get; set; }

        /// <summary>
        /// The collection of contact methods associated with this person.
        /// A person must have at least one contact to be registered.
        /// </summary>
        public List<ContactInfo> Contacts { get; set; } = new List<ContactInfo>();
    }

    /// <summary>
    /// Represents a contact method (e.g., Phone, Email) for a person.
    /// </summary>
    public class ContactInfo
    {
        /// <summary>
        /// Unique identifier for the contact info record.
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// The type of contact (e.g., Phone, Email, Address).
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// The actual contact value (e.g., phone number or email address).
        /// </summary>
        public string Value { get; set; }
        
        /// <summary>
        /// Foreign key linking the contact to a person.
        /// </summary>
        public int PersonId { get; set; }
        public Person Person { get; set; }
    }
}
