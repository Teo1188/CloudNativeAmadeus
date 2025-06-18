using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Services;
using NSubstitute;
using Xunit;

namespace ExtraHours.Test
{
    public class PermissionServiceTests
    {
        private readonly IPermissionRepository _permissionRepository;
        private readonly PermissionService _permissionService;

        public PermissionServiceTests()
        {
            _permissionRepository = Substitute.For<IPermissionRepository>();
            _permissionService = new PermissionService(_permissionRepository);
        }

        [Fact]
        public async Task GetPermissions_ReturnsAllPermissions()
        {
            // Arrange
            var permissions = new List<Permission>
            {
                new Permission { Id = 1, Name = "Create", Description = "Can create resources" },
                new Permission { Id = 2, Name = "Edit", Description = "Can edit resources" }
            };
            _permissionRepository.GetAllPermissionsAsync().Returns(permissions);

            // Act
            var result = await _permissionService.GetPermissions();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetPermissionById_ReturnsPermission()
        {
            // Arrange
            var permission = new Permission { Id = 1, Name = "Create", Description = "Can create resources" };
            _permissionRepository.GetPermissionByIdAsync(1).Returns(permission);

            // Act
            var result = await _permissionService.GetPermissionById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Create", result?.Name);
        }

        [Fact]
        public async Task CreatePermission_AddsToRepository()
        {
            // Arrange
            var permission = new Permission { Id = 1, Name = "Create", Description = "Can create resources" };

            // Act
            var result = await _permissionService.CreatePermission(permission);

            // Assert
            await _permissionRepository.Received(1).AddPermissionAsync(permission);
            Assert.Equal("Create", result.Name);
        }

        [Fact]
        public async Task UpdatePermission_ValidId_UpdatesPermission()
        {
            // Arrange
            var existing = new Permission { Id = 1, Name = "Create", Description = "Can create resources" };
            var updated = new Permission { Id = 1, Name = "New", Description = "Updated" };
            _permissionRepository.GetPermissionByIdAsync(1).Returns(existing);

            // Act
            var result = await _permissionService.UpdatePermission(1, updated);

            // Assert
            await _permissionRepository.Received(1).UpdatePermissionAsync(Arg.Is<Permission>(p => p.Name == "New"));
            Assert.Equal("New", result?.Name);
        }

        [Fact]
        public async Task UpdatePermission_InvalidId_ReturnsNull()
        {
            // Arrange
            _permissionRepository.GetPermissionByIdAsync(99).Returns((Permission?)null);

            // Act
            var result = await _permissionService.UpdatePermission(99, new Permission { Id = 1, Name = "Create", Description = "Can create resources" }); 

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeletePermission_ValidId_ReturnsTrue()
        {
            // Arrange
            var permission = new Permission { Id = 1, Name = "Create", Description = "Can create resources" };
            _permissionRepository.GetPermissionByIdAsync(1).Returns(permission);

            // Act
            var result = await _permissionService.DeletePermission(1);

            // Assert
            Assert.True(result);
            await _permissionRepository.Received(1).DeletePermissionAsync(1);
        }

        [Fact]
        public async Task DeletePermission_InvalidId_ReturnsFalse()
        {
            // Arrange
            _permissionRepository.GetPermissionByIdAsync(99).Returns((Permission?)null);

            // Act
            var result = await _permissionService.DeletePermission(99);

            // Assert
            Assert.False(result);
        }
    }
}
