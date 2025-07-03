
using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Services;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ExtraHours.Test
{
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
            var approval = new Approval { Id = 1, Status = "Pendiente" };
            _approvalRepository.GetByIdAsync(1).Returns(approval);

            var result = await _approvalService.GetApprovalById(1);

            Assert.NotNull(result);
            Assert.Equal("Pendiente", result.Status);
        }

        [Fact]
        public async Task CreateApproval_ValidData_AddsApproval()
        {
            var approval = new Approval { ExtraHourId = 1, UserId = 1 };

            var result = await _approvalService.CreateApproval(approval);

            await _approvalRepository.Received(1).AddAsync(approval);
            Assert.Equal(1, result.ExtraHourId);
        }

        [Fact]
        public async Task CreateApproval_InvalidData_ThrowsException()
        {
            var approval = new Approval { ExtraHourId = 0, UserId = 0 };

            await Assert.ThrowsAsync<InvalidOperationException>(() => _approvalService.CreateApproval(approval));
        }

        [Fact]
        public async Task GetAllApprovals_ReturnsList()
        {
            var list = new List<Approval> {
                new Approval { Id = 1 }, new Approval { Id = 2 }
            };
            _approvalRepository.GetAllAsync().Returns(list);

            var result = await _approvalService.GetAllApprovals();

            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetApprovalsByExtraHour_ReturnsApprovals()
        {
            var list = new List<Approval> {
                new Approval { ExtraHourId = 1 },
                new Approval { ExtraHourId = 1 }
            };
            _approvalRepository.GetByExtraHourIdAsync(1).Returns(list);

            var result = await _approvalService.GetApprovalsByExtraHour(1);

            Assert.All(result, a => Assert.Equal(1, a.ExtraHourId));
        }

        [Fact]
        public async Task GetApprovalsByUser_ReturnsApprovals()
        {
            var list = new List<Approval> {
                new Approval { UserId = 5 },
                new Approval { UserId = 5 }
            };
            _approvalRepository.GetByUserIdAsync(5).Returns(list);

            var result = await _approvalService.GetApprovalsByUser(5);

            Assert.All(result, a => Assert.Equal(5, a.UserId));
        }

        [Fact]
        public async Task UpdateApproval_ValidId_UpdatesAndReturns()
        {
            var existing = new Approval { Id = 1, Status = "Antiguo", Annotations = "Antiguo" };
            var updated = new Approval { Status = "Nuevo", Annotations = "Nuevo" };
            _approvalRepository.GetByIdAsync(1).Returns(existing);

            var result = await _approvalService.UpdateApproval(1, updated);

            Assert.Equal("Nuevo", result.Status);
            Assert.Equal("Nuevo", result.Annotations);
            await _approvalRepository.Received(1).UpdateAsync(existing);
        }

        [Fact]
        public async Task UpdateApproval_InvalidId_ReturnsNull()
        {
            _approvalRepository.GetByIdAsync(99).Returns((Approval?)null);
            var updated = new Approval { Status = "x", Annotations = "x" };

            var result = await _approvalService.UpdateApproval(99, updated);

            Assert.Null(result);
            await _approvalRepository.DidNotReceive().UpdateAsync(Arg.Any<Approval>());
        }

        [Fact]
        public async Task DeleteApproval_ValidId_ReturnsTrue()
        {
            var existing = new Approval { Id = 1 };
            _approvalRepository.GetByIdAsync(1).Returns(existing);

            var result = await _approvalService.DeleteApproval(1);

            Assert.True(result);
            await _approvalRepository.Received(1).DeleteAsync(1);
        }

        [Fact]
        public async Task DeleteApproval_InvalidId_ReturnsFalse()
        {
            _approvalRepository.GetByIdAsync(77).Returns((Approval?)null);

            var result = await _approvalService.DeleteApproval(77);

            Assert.False(result);
            await _approvalRepository.DidNotReceive().DeleteAsync(Arg.Any<int>());
        }

        [Fact]
        public async Task ApproveExtraHour_ValidData_ReturnsApproval()
        {
            var extraHour = new ExtraHour { Id = 1, Status = "Pendiente" };
            _extraHourRepository.GetByIdAsync(1).Returns(extraHour);

            var result = await _approvalService.ApproveExtraHour(1, 2, "comentario");

            Assert.NotNull(result);
            Assert.Equal("Aprobado", result.Status);
            await _extraHourRepository.Received(1).UpdateAsync(extraHour);
            await _approvalRepository.Received(1).AddAsync(Arg.Any<Approval>());
        }

        [Fact]
        public async Task ApproveExtraHour_NotFound_ReturnsNull()
        {
            _extraHourRepository.GetByIdAsync(999).Returns((ExtraHour?)null);

            var result = await _approvalService.ApproveExtraHour(999, 2, "comentario");

            Assert.Null(result);
            await _extraHourRepository.DidNotReceive().UpdateAsync(Arg.Any<ExtraHour>());
            await _approvalRepository.DidNotReceive().AddAsync(Arg.Any<Approval>());
        }

        [Fact]
        public async Task RejectExtraHour_ValidData_ReturnsApproval()
        {
            var extraHour = new ExtraHour { Id = 1, Status = "Pendiente" };
            _extraHourRepository.GetByIdAsync(1).Returns(extraHour);

            var result = await _approvalService.RejectExtraHour(1, 3, "rechazo");

            Assert.Equal("Rechazado", result.Status);
            await _extraHourRepository.Received(1).UpdateAsync(extraHour);
            await _approvalRepository.Received(1).AddAsync(Arg.Any<Approval>());
        }

        [Fact]
        public async Task RejectExtraHour_NotFound_ReturnsNull()
        {
            _extraHourRepository.GetByIdAsync(999).Returns((ExtraHour?)null);

            var result = await _approvalService.RejectExtraHour(999, 3, "comentario");

            Assert.Null(result);
            await _extraHourRepository.DidNotReceive().UpdateAsync(Arg.Any<ExtraHour>());
            await _approvalRepository.DidNotReceive().AddAsync(Arg.Any<Approval>());
        }
    }
}
