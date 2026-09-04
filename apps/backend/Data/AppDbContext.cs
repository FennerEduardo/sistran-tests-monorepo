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
                new Product { Id = 1, Title = "Laptop Pro", TitleEn = "Pro Laptop", Description = "Laptop de alto rendimiento", DescriptionEn = "High performance laptop", Price = 1200.00m, Category = "Tecnología", ImageUrl = "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg" },
                new Product { Id = 2, Title = "Código Limpio", TitleEn = "Clean Code", Description = "Libro de programación", DescriptionEn = "Programming book", Price = 35.50m, Category = "Libros", ImageUrl = "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg" },
                new Product { Id = 3, Title = "Ratón Inalámbrico", TitleEn = "Wireless Mouse", Description = "Ratón ergonómico", DescriptionEn = "Ergonomic mouse", Price = 25.00m, Category = "Tecnología", ImageUrl = "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg" }
            );

        }
    }
}
