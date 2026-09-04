using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BackendAPI.Models
{
    /// <summary>
    /// Represents a product category with bilingual support.
    /// </summary>
    public class Category
    {
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
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string TitleEn { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        /// <summary>Foreign key to Category.</summary>
        public int CategoryId { get; set; }

        /// <summary>Navigation property to Category.</summary>
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Category? Category { get; set; }
    }

    /// <summary>
    /// Represents a customer order.
    /// </summary>
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal Total { get; set; }
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    /// <summary>
    /// Represents a single line item in an order.
    /// </summary>
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
