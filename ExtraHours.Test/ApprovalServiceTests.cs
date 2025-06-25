using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Services;
using NSubstitute;
using Xunit;

namespace ExtraHours.Test;

public class ApprovalServiceTests
{
    private readonly IApprovalRepository _approvalRepository;
    private readonly IExtraHourRepository _extraHourRepository;
    private readonly ApprovalService _approvalService;

    public ApprovalServiceTests()
    {
        _approvalRepository = Substitute.For<IApprovalRepository>();
        _extraHourRepository = Substitute.For<IExtraHourRepository>();
        _approvalService = new ApprovalService(_approvalRepository, _extraHourRepository);
    }

    [Fact]
    public async Task GetApprovalById_ReturnsApproval()
    {
        // Arrange
        var approval = new Approval { Id = 1, Status = "Pendiente" };
        _approvalRepository.GetByIdAsync(1).Returns(approval);

        // Act
        var result = await _approvalService.GetApprovalById(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Pendiente", result.Status);
    }

    [Fact]
    public async Task CreateApproval_ValidData_AddsApproval()
    {
        // Arrange
        var approval = new Approval { ExtraHourId = 1, UserId = 1 };

        // Act
        var result = await _approvalService.CreateApproval(approval);

        // Assert
        await _approvalRepository.Received(1).AddAsync(approval);
        Assert.Equal(1, result.ExtraHourId);
    }

    [Fact]
    public async Task CreateApproval_InvalidData_ThrowsException()
    {
        // Arrange
        var approval = new Approval { ExtraHourId = 0, UserId = 0 };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _approvalService.CreateApproval(approval));
    }

    [Fact]
    public async Task ApproveExtraHour_Valid_ReturnsApproval()
    {
        // Arrange
        var extraHour = new ExtraHour { Id = 1, Status = "Pendiente" };
        _extraHourRepository.GetByIdAsync(1).Returns(extraHour);

        // Act
        var result = await _approvalService.ApproveExtraHour(1, 2, "Bien hecho");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Aprobado", result.Status);
        await _extraHourRepository.Received(1).UpdateAsync(extraHour);
        await _approvalRepository.Received(1).AddAsync(Arg.Any<Approval>());
    }

    [Fact]
    public async Task ApproveExtraHour_ExtraHourNotFound_ReturnsNull()
    {
        // Arrange
        _extraHourRepository.GetByIdAsync(1).Returns((ExtraHour)null);

        // Act
        var result = await _approvalService.ApproveExtraHour(1, 2, "Comentario");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task RejectExtraHour_Valid_ReturnsApproval()
    {
        // Arrange
        var extraHour = new ExtraHour { Id = 1, Status = "Pendiente" };
        _extraHourRepository.GetByIdAsync(1).Returns(extraHour);

        // Act
        var result = await _approvalService.RejectExtraHour(1, 2, "No es válida");

        // Assert
        Assert.Equal("Rechazado", result.Status);
        await _extraHourRepository.Received(1).UpdateAsync(extraHour);
        await _approvalRepository.Received(1).AddAsync(Arg.Any<Approval>());
    }
}
