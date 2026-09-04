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
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>()
                .HasIndex(p => p.DocumentId)
                .IsUnique();

            // Unique index on Category Name to prevent duplicates
            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Name)
                .IsUnique();

            // Product -> Category FK
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Tecnología", NameEn = "Technology" },
                new Category { Id = 2, Name = "Libros", NameEn = "Books" },
                new Category { Id = 3, Name = "Accesorios", NameEn = "Accessories" }
            );

            // Seed products with Pexels-sourced images and CategoryId FK
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Title = "Laptop Pro", TitleEn = "Pro Laptop", Description = "Laptop de alto rendimiento", DescriptionEn = "High performance laptop", Price = 1200.00m, CategoryId = 1, ImageUrl = "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400" },
                new Product { Id = 2, Title = "Código Limpio", TitleEn = "Clean Code", Description = "Libro de programación", DescriptionEn = "Programming book", Price = 35.50m, CategoryId = 2, ImageUrl = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400" },
                new Product { Id = 3, Title = "Ratón Inalámbrico", TitleEn = "Wireless Mouse", Description = "Ratón ergonómico", DescriptionEn = "Ergonomic mouse", Price = 25.00m, CategoryId = 3, ImageUrl = "https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=400" }
            );
        }
    }
}
