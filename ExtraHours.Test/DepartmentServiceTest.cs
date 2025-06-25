using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Services;
using NSubstitute;
using Xunit;

namespace ExtraHours.Test
{
    public class DepartmentServiceTests
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly DepartmentService _departmentService;

        public DepartmentServiceTests()
        {
            _departmentRepository = Substitute.For<IDepartmentRepository>();
            _departmentService = new DepartmentService(_departmentRepository);
        }

        [Fact]
        public async Task GetDepartments_ReturnsAllDepartments()
        {
            // Arrange
            var departments = new List<Department>
            {
                new Department { Id = 1, Name = "HR", Location = "Floor 1" },
                new Department { Id = 2, Name = "IT", Location = "Floor 2" }
            };
            _departmentRepository.GetAllDepartmentsAsync().Returns(departments);

            // Act
            var result = await _departmentService.GetDepartments();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetDepartmentById_ExistingId_ReturnsDepartment()
        {
            // Arrange
            var department = new Department { Id = 1, Name = "HR", Location = "Floor 1" };
            _departmentRepository.GetDepartmentByIdAsync(1).Returns(department);

            // Act
            var result = await _departmentService.GetDepartmentById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("HR", result?.Name);
            Assert.Equal("Floor 1", result?.Location);
        }

        [Fact]
        public async Task GetDepartmentById_NonExistingId_ReturnsNull()
        {
            // Arrange
            _departmentRepository.GetDepartmentByIdAsync(99).Returns((Department?)null);

            // Act
            var result = await _departmentService.GetDepartmentById(99);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateDepartment_AddsToRepository()
        {
            // Arrange
            var department = new Department { Name = "Finance", Location = "Floor 3" };

            // Act
            var result = await _departmentService.CreateDepartment(department);

            // Assert
            await _departmentRepository.Received(1).AddDepartmentAsync(department);
            Assert.Equal("Finance", result.Name);
            Assert.Equal("Floor 3", result.Location);
        }

        [Fact]
        public async Task UpdateDepartment_ValidId_UpdatesDepartment()
        {
            // Arrange
            var existing = new Department { Id = 1, Name = "HR", Location = "Floor 1" };
            var updated = new Department { Id = 1, Name = "Human Resources", Location = "Floor 1A" };
            _departmentRepository.GetDepartmentByIdAsync(1).Returns(existing);

            // Act
            var result = await _departmentService.UpdateDepartment(1, updated);

            // Assert
            await _departmentRepository.Received(1).UpdateDepartmentAsync(
                Arg.Is<Department>(d => 
                    d.Name == "Human Resources" && 
                    d.Location == "Floor 1A"));
            Assert.Equal("Human Resources", result?.Name);
            Assert.Equal("Floor 1A", result?.Location);
        }

        [Fact]
        public async Task UpdateDepartment_InvalidId_ReturnsNull()
        {
            // Arrange
            _departmentRepository.GetDepartmentByIdAsync(99).Returns((Department?)null);
            var updated = new Department { Id = 99, Name = "Test", Location = "Test" };

            // Act
            var result = await _departmentService.UpdateDepartment(99, updated);

            // Assert
            Assert.Null(result);
            await _departmentRepository.DidNotReceive().UpdateDepartmentAsync(Arg.Any<Department>());
        }

        [Fact]
        public async Task DeleteDepartment_ValidId_ReturnsTrue()
        {
            // Arrange
            var department = new Department { Id = 1, Name = "HR", Location = "Floor 1" };
            _departmentRepository.GetDepartmentByIdAsync(1).Returns(department);

            // Act
            var result = await _departmentService.DeleteDepartment(1);

            // Assert
            Assert.True(result);
            await _departmentRepository.Received(1).DeleteDepartmentAsync(1);
        }

        [Fact]
        public async Task DeleteDepartment_InvalidId_ReturnsFalse()
        {
            // Arrange
            _departmentRepository.GetDepartmentByIdAsync(99).Returns((Department?)null);

            // Act
            var result = await _departmentService.DeleteDepartment(99);

            // Assert
            Assert.False(result);
            await _departmentRepository.DidNotReceive().DeleteDepartmentAsync(Arg.Any<int>());
        }
    }
}