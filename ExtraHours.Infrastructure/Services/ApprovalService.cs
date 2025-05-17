using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Core.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.Infrastructure.Services
{
    public class ApprovalService : IApprovalService
    {
        private readonly IApprovalRepository _approvalRepository;
        private readonly IExtraHourRepository _extraHourRepository;

        public ApprovalService(
            IApprovalRepository approvalRepository,
            IExtraHourRepository extraHourRepository)
        {
            _approvalRepository = approvalRepository;
            _extraHourRepository = extraHourRepository;
        }

        public async Task<IEnumerable<Approval>> GetAllApprovals()
        {
            return await _approvalRepository.GetAllAsync();
        }

        public async Task<Approval> GetApprovalById(int id)
        {
            return await _approvalRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Approval>> GetApprovalsByExtraHour(int extraHourId)
        {
            return await _approvalRepository.GetByExtraHourIdAsync(extraHourId);
        }

        public async Task<IEnumerable<Approval>> GetApprovalsByUser(int userId)
        {
            return await _approvalRepository.GetByUserIdAsync(userId);
        }

        public async Task<Approval> CreateApproval(Approval approval)
        {
            // Validación para propiedades requeridas
            if (approval.ExtraHourId <= 0 || approval.UserId <= 0)
                throw new InvalidOperationException("ExtraHourId and UserId must be set");

            await _approvalRepository.AddAsync(approval);
            return approval;
        }

        public async Task<Approval> UpdateApproval(int id, Approval updatedApproval)
        {
            var existing = await _approvalRepository.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Status = updatedApproval.Status;
            existing.Annotations = updatedApproval.Annotations;
            existing.UpdatedAt = DateTime.UtcNow;
            
            await _approvalRepository.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> DeleteApproval(int id)
        {
            var existing = await _approvalRepository.GetByIdAsync(id);
            if (existing == null) return false;

            await _approvalRepository.DeleteAsync(id);
            return true;
        }

        public async Task<Approval> ApproveExtraHour(int extraHourId, int userId, string annotations)
        {
            var extraHour = await _extraHourRepository.GetByIdAsync(extraHourId);
            if (extraHour == null) return null;

            var approval = new Approval
            {
                ExtraHourId = extraHourId,
                UserId = userId,
                Status = "Aprobado",
                Annotations = annotations,
                CreatedAt = DateTime.UtcNow
                // No establecemos las propiedades de navegación aquí
            };

            extraHour.Status = "Aprobado";
            extraHour.ApprovedById = userId;
            extraHour.UpdatedAt = DateTime.UtcNow;

            await _extraHourRepository.UpdateAsync(extraHour);
            await _approvalRepository.AddAsync(approval);

            return approval;
        }

        public async Task<Approval> RejectExtraHour(int extraHourId, int userId, string annotations)
        {
            var extraHour = await _extraHourRepository.GetByIdAsync(extraHourId);
            if (extraHour == null) return null;

            var approval = new Approval
            {
                ExtraHourId = extraHourId,
                UserId = userId,
                Status = "Rechazado",
                Annotations = annotations,
                CreatedAt = DateTime.UtcNow
                // No establecemos las propiedades de navegación aquí
            };

            extraHour.Status = "Rechazado";
            extraHour.UpdatedAt = DateTime.UtcNow;

            await _extraHourRepository.UpdateAsync(extraHour);
            await _approvalRepository.AddAsync(approval);

            return approval;
        }
    }
}