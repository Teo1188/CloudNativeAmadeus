using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Core.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.Infrastructure.Services
{
    public class ExtraHourService : IExtraHourService
    {
        private readonly IExtraHourRepository _extraHourRepository;

        public ExtraHourService(IExtraHourRepository extraHourRepository)
        {
            _extraHourRepository = extraHourRepository;
        }

        public async Task<IEnumerable<ExtraHour>> GetAllExtraHours()
        {
            return await _extraHourRepository.GetAllAsync();
        }

        public async Task<ExtraHour> GetExtraHourById(int id)
        {
            return await _extraHourRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<ExtraHour>> GetExtraHoursByUser(int userId)
        {
            return await _extraHourRepository.GetByUserIdAsync(userId);
        }

        public async Task<ExtraHour> CreateExtraHour(ExtraHour extraHour)
        {
            extraHour.Status = "Pendiente";
            await _extraHourRepository.AddAsync(extraHour);
            return extraHour;
        }

        public async Task<ExtraHour> UpdateExtraHour(int id, ExtraHour updatedExtraHour)
        {
            var existing = await _extraHourRepository.GetByIdAsync(id);
            if (existing == null) return null!;

            existing.Date = updatedExtraHour.Date;
            existing.StartTime = updatedExtraHour.StartTime;
            existing.EndTime = updatedExtraHour.EndTime;
            existing.ExtraHourTypeId = updatedExtraHour.ExtraHourTypeId;
            existing.Reason = updatedExtraHour.Reason;

            await _extraHourRepository.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> DeleteExtraHour(int id)
        {
            var existing = await _extraHourRepository.GetByIdAsync(id);
            if (existing == null) return false;

            await _extraHourRepository.DeleteAsync(id);
            return true;
        }

        public async Task<ExtraHour> ApproveExtraHour(int id, int approvedById)
        {
            var extraHour = await _extraHourRepository.GetByIdAsync(id);
            if (extraHour == null) return null!;

            extraHour.Status = "Aprobado";
            extraHour.ApprovedById = approvedById;
            extraHour.UpdatedAt = DateTime.UtcNow;

            await _extraHourRepository.UpdateAsync(extraHour);
            return extraHour;
        }

        public async Task<ExtraHour> RejectExtraHour(int id, string reason)
        {
            var extraHour = await _extraHourRepository.GetByIdAsync(id);
            if (extraHour == null) return null!;

            extraHour.Status = "Rechazado";
            extraHour.Reason = reason;
            extraHour.UpdatedAt = DateTime.UtcNow;

            await _extraHourRepository.UpdateAsync(extraHour);
            return extraHour;
        }
    }
}