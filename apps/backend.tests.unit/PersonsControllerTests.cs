using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using BackendAPI.Controllers;
using BackendAPI.Data;
using BackendAPI.Models;

namespace backend.tests.unit
{
    public class PersonsControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var context = new AppDbContext(options);
            context.Database.EnsureCreated();
            return context;
        }

        [Fact]
        public async Task RegisterPerson_ReturnsOk_WhenValid()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new PersonsController(context);
            var person = new Person
            {
                DocumentId = "12345ABC",
                FirstName = "Juan",
                LastName = "Perez",
                BirthDate = new DateTime(1990, 1, 1),
                Contacts = new List<ContactInfo>
                {
                    new ContactInfo { Type = "Phone", Value = "123456789" }
                }
            };

            // Act
            var result = await controller.RegisterPerson(person);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var apiResponse = Assert.IsType<ApiResponse<Person>>(okResult.Value);
            Assert.True(apiResponse.Success);
            Assert.Equal("Juan", apiResponse.Data.FirstName);
        }

        [Fact]
        public async Task RegisterPerson_ReturnsBadRequest_WhenDuplicateDocumentId()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new PersonsController(context);
            
            var person1 = new Person
            {
                DocumentId = "DUPLICATE",
                FirstName = "Juan",
                LastName = "Perez",
                BirthDate = new DateTime(1990, 1, 1)
            };
            context.Persons.Add(person1);
            await context.SaveChangesAsync();

            var person2 = new Person
            {
                DocumentId = "DUPLICATE",
                FirstName = "Maria",
                LastName = "Gomez",
                BirthDate = new DateTime(1995, 1, 1)
            };

            // Act
            var result = await controller.RegisterPerson(person2);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var apiResponse = Assert.IsType<ApiResponse<object>>(badRequestResult.Value);
            Assert.False(apiResponse.Success);
            Assert.Contains("Ya existe", apiResponse.Message);
        }
    }
}
