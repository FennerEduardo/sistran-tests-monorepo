using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models
{
    /// <summary>
    /// Represents a person registered in the system with their personal details and contact methods.
    /// </summary>
    public class Person
    {
        /// <summary>
        /// Unique internal identifier for the person.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The alphanumeric national identification document of the person.
        /// </summary>
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "El documento de identidad sólo acepta valores alfanuméricos.")]
        public string DocumentId { get; set; }

        /// <summary>
        /// The person's first name(s). Must contain only alphabetical characters.
        /// </summary>
        [Required]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Los nombres sólo aceptan caracteres del alfabeto latino y no pueden contener números.")]
        public string FirstName { get; set; }

        /// <summary>
        /// The person's last name(s). Must contain only alphabetical characters.
        /// </summary>
        [Required]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Los apellidos sólo aceptan caracteres del alfabeto latino y no pueden contener números.")]
        public string LastName { get; set; }

        /// <summary>
        /// The person's date of birth.
        /// </summary>
        [Required]
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
    public class ContactInfo : IValidatableObject
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
        [System.Text.Json.Serialization.JsonIgnore]
        public Person? Person { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Type == "Email")
            {
                var emailRegex = new System.Text.RegularExpressions.Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$");
                if (string.IsNullOrWhiteSpace(Value) || !emailRegex.IsMatch(Value))
                {
                    yield return new ValidationResult("Por favor ingresa un correo electrónico válido.", new[] { nameof(Value) });
                }
            }
            else if (Type == "Phone")
            {
                var phoneRegex = new System.Text.RegularExpressions.Regex(@"^[\d\s\-\+\(\)]+$");
                if (string.IsNullOrWhiteSpace(Value) || Value.Length < 5 || !phoneRegex.IsMatch(Value))
                {
                    yield return new ValidationResult("Por favor ingresa un teléfono válido (sólo números y símbolos, mínimo 5 caracteres).", new[] { nameof(Value) });
                }
            }
            else if (Type == "Address")
            {
                if (string.IsNullOrWhiteSpace(Value) || Value.Length < 5)
                {
                    yield return new ValidationResult("Por favor ingresa una dirección física válida (mínimo 5 caracteres).", new[] { nameof(Value) });
                }
            }
            else
            {
                yield return new ValidationResult($"Tipo de contacto no soportado: {Type}", new[] { nameof(Type) });
            }
        }
    }
}
