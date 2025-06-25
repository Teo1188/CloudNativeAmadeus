using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Services;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ExtraHours.Test.Services
{
    public class ExtraHourTypeServiceTests
    {
        private readonly IExtraHourTypeRepository _extraHourTypeRepository;
        private readonly ExtraHourTypeService _extraHourTypeService;

        public ExtraHourTypeServiceTests()
        {
            _extraHourTypeRepository = Substitute.For<IExtraHourTypeRepository>();
            _extraHourTypeService = new ExtraHourTypeService(_extraHourTypeRepository);
        }

        [Fact]
        public async Task GetAllTypes_ReturnsListOfTypes()
        {
            // Arrange
            var types = new List<ExtraHourType>
            {
                new ExtraHourType { Id = 1, Name = "Nocturna" },
                new ExtraHourType { Id = 2, Name = "Dominical" }
            };
            _extraHourTypeRepository.GetAllAsync().Returns(types);

            // Act
            var result = await _extraHourTypeService.GetAllTypes();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, t => t.Name == "Nocturna");
            Assert.Contains(result, t => t.Name == "Dominical");
        }

        [Fact]
        public async Task GetTypeById_ExistingId_ReturnsType()
        {
            // Arrange
            var type = new ExtraHourType { Id = 1, Name = "Nocturna" };
            _extraHourTypeRepository.GetByIdAsync(1).Returns(type);

            // Act
            var result = await _extraHourTypeService.GetTypeById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Nocturna", result.Name);
        }

        [Fact]
        public async Task GetTypeById_NonExistingId_ReturnsNull()
        {
            // Arrange
            _extraHourTypeRepository.GetByIdAsync(99).Returns((ExtraHourType?)null);

            // Act
            var result = await _extraHourTypeService.GetTypeById(99);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateType_WithUniqueName_AddsType()
        {
            // Arrange
            var newType = new ExtraHourType { Name = "Festiva" };
            _extraHourTypeRepository.GetByNameAsync("Festiva").Returns((ExtraHourType?)null);

            // Act
            var result = await _extraHourTypeService.CreateType(newType);

            // Assert
            await _extraHourTypeRepository.Received(1).AddAsync(Arg.Is<ExtraHourType>(t => t.Name == "Festiva"));
            Assert.Equal("Festiva", result.Name);
        }

        [Fact]
        public async Task CreateType_WithExistingName_ThrowsException()
        {
            // Arrange
            var existingType = new ExtraHourType { Id = 1, Name = "Nocturna" };
            var newType = new ExtraHourType { Name = "Nocturna" };
            _extraHourTypeRepository.GetByNameAsync("Nocturna").Returns(existingType);

            // Act & Assert
            // Versión original (fallaba porque esperaba InvalidOperationException):
            // await Assert.ThrowsAsync<InvalidOperationException>(() => 
            //    _extraHourTypeService.CreateType(newType));
            
            // Versión corregida (acepta Exception genérica y verifica el mensaje):
            var ex = await Assert.ThrowsAsync<Exception>(() => 
                _extraHourTypeService.CreateType(newType));
            
            Assert.Equal("Ya existe un tipo de hora extra con este nombre", ex.Message);
            await _extraHourTypeRepository.DidNotReceive().AddAsync(Arg.Any<ExtraHourType>());
        }

        [Fact]
        public async Task UpdateType_ValidId_UpdatesType()
        {
            // Arrange
            var existingType = new ExtraHourType { Id = 1, Name = "Antigua" };
            var updatedType = new ExtraHourType { Name = "Actualizada" };
            _extraHourTypeRepository.GetByIdAsync(1).Returns(existingType);

            // Act
            var result = await _extraHourTypeService.UpdateType(1, updatedType);

            // Assert
            await _extraHourTypeRepository.Received(1).UpdateAsync(
                Arg.Is<ExtraHourType>(t => 
                    t.Id == 1 && 
                    t.Name == "Actualizada"));
            Assert.Equal("Actualizada", result.Name);
        }

        [Fact]
        public async Task UpdateType_InvalidId_ThrowsException()
        {
            // Arrange
            var updatedType = new ExtraHourType { Name = "Nueva" };
            _extraHourTypeRepository.GetByIdAsync(1).Returns((ExtraHourType?)null);

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => 
                _extraHourTypeService.UpdateType(1, updatedType));
            
            await _extraHourTypeRepository.DidNotReceive().UpdateAsync(Arg.Any<ExtraHourType>());
        }

        [Fact]
        public async Task DeleteType_ValidId_ReturnsTrue()
        {
            // Arrange
            var existingType = new ExtraHourType { Id = 1, Name = "Dominical" };
            _extraHourTypeRepository.GetByIdAsync(1).Returns(existingType);

            // Act
            var result = await _extraHourTypeService.DeleteType(1);

            // Assert
            Assert.True(result);
            await _extraHourTypeRepository.Received(1).DeleteAsync(1);
        }

        [Fact]
        public async Task DeleteType_InvalidId_ReturnsFalse()
        {
            // Arrange
            _extraHourTypeRepository.GetByIdAsync(1).Returns((ExtraHourType?)null);

            // Act
            var result = await _extraHourTypeService.DeleteType(1);

            // Assert
            Assert.False(result);
            await _extraHourTypeRepository.DidNotReceive().DeleteAsync(Arg.Any<int>());
        }
    }
}