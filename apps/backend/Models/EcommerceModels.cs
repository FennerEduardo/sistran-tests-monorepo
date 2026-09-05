using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace BackendAPI.Models
{
    /// <summary>
    /// Represents a product category with bilingual support.
    /// </summary>
    public class Category
    {
        /// <summary>Unique identifier for the category.</summary>
        public int Id { get; set; }
        /// <summary>Name in the default language (Spanish).</summary>
        public string Name { get; set; } = string.Empty;
        /// <summary>Name in English.</summary>
        public string NameEn { get; set; } = string.Empty;
    }

    /// <summary>
    /// Represents a product in the e-commerce catalog.
    /// </summary>
    public class Product
    {
        /// <summary>Unique identifier for the product.</summary>
        public int Id { get; set; }
        /// <summary>Product title in the default language (Spanish).</summary>
        public string Title { get; set; } = string.Empty;
        /// <summary>Product title in English.</summary>
        public string TitleEn { get; set; } = string.Empty;
        /// <summary>Detailed description in the default language (Spanish).</summary>
        public string Description { get; set; } = string.Empty;
        /// <summary>Detailed description in English.</summary>
        public string DescriptionEn { get; set; } = string.Empty;
        /// <summary>The retail price of the product.</summary>
        public decimal Price { get; set; }
        /// <summary>URL pointing to the product's image (e.g., from Pexels API).</summary>
        public string ImageUrl { get; set; } = string.Empty;

        /// <summary>Foreign key to Category.</summary>
        public int CategoryId { get; set; }

        /// <summary>Navigation property to Category.</summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Category? Category { get; set; }
    }

    /// <summary>
    /// Represents a customer order.
    /// Implements validation logic for guest buyer details.
    /// </summary>
    public class Order : IValidatableObject
    {
        /// <summary>Unique identifier for the order.</summary>
        public int Id { get; set; }
        /// <summary>The date and time when the order was placed.</summary>
        public DateTime OrderDate { get; set; }
        /// <summary>The total calculated amount for all items in the order.</summary>
        public decimal Total { get; set; }

        // Buyer Information
        public string? BuyerName { get; set; }
        public string? BuyerDocument { get; set; }
        public string? BuyerEmail { get; set; }
        public string? BuyerPhone { get; set; }

        // Optional relationship to registered person
        public int? PersonId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Person? Person { get; set; }

        /// <summary>The list of line items included in this order.</summary>
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!PersonId.HasValue)
            {
                if (string.IsNullOrWhiteSpace(BuyerName))
                    yield return new ValidationResult("Buyer Name is required for guest checkout.", new[] { nameof(BuyerName) });
                else if (BuyerName.Length < 3 || BuyerName.Length > 100)
                    yield return new ValidationResult("Buyer Name must be between 3 and 100 characters.", new[] { nameof(BuyerName) });

                if (string.IsNullOrWhiteSpace(BuyerDocument))
                    yield return new ValidationResult("Buyer Document is required for guest checkout.", new[] { nameof(BuyerDocument) });

                if (!string.IsNullOrWhiteSpace(BuyerEmail))
                {
                    if (!Regex.IsMatch(BuyerEmail, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                        yield return new ValidationResult("Invalid email format.", new[] { nameof(BuyerEmail) });
                }

                if (!string.IsNullOrWhiteSpace(BuyerPhone))
                {
                    if (!Regex.IsMatch(BuyerPhone, @"^[\d\s\-\+\(\)]+$"))
                        yield return new ValidationResult("Invalid phone number format.", new[] { nameof(BuyerPhone) });
                }

                if (string.IsNullOrWhiteSpace(BuyerEmail) && string.IsNullOrWhiteSpace(BuyerPhone))
                {
                    yield return new ValidationResult("At least one contact method (Email or Phone) must be provided for guest checkout.", new[] { nameof(BuyerEmail), nameof(BuyerPhone) });
                }
            }
        }
    }

    /// <summary>
    /// Represents a single line item in an order.
    /// </summary>
    public class OrderItem
    {
        /// <summary>Unique identifier for the line item.</summary>
        public int Id { get; set; }
        /// <summary>Foreign key to the parent Order.</summary>
        public int OrderId { get; set; }
        /// <summary>Foreign key to the purchased Product.</summary>
        public int ProductId { get; set; }
        
        /// <summary>Navigation property for the associated product details.</summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Product? Product { get; set; }
        
        /// <summary>The number of units purchased for this product.</summary>
        public int Quantity { get; set; }
        /// <summary>The individual unit price at the time of purchase.</summary>
        public decimal UnitPrice { get; set; }
    }
}
