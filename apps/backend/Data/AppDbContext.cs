using Microsoft.EntityFrameworkCore;
using BackendAPI.Models;

namespace BackendAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Person> Persons { get; set; }
        public DbSet<ContactInfo> Contacts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>()
                .HasIndex(p => p.DocumentId)
                .IsUnique();

            // Seed some products for the ecommerce
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Title = "Laptop Pro", Description = "High performance laptop", Price = 1200.00m, Category = "Tecnología", ImageUrl = "https://via.placeholder.com/150" },
                new Product { Id = 2, Title = "Clean Code", Description = "Programming book", Price = 35.50m, Category = "Libros", ImageUrl = "https://via.placeholder.com/150" },
                new Product { Id = 3, Title = "Wireless Mouse", Description = "Ergonomic mouse", Price = 25.00m, Category = "Tecnología", ImageUrl = "https://via.placeholder.com/150" }
            );
        }
    }
}
