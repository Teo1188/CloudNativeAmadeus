using ExtraHours.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.Core.Services
{
    public interface IExtraHourService
    {
        Task<IEnumerable<ExtraHour>> GetAllExtraHours();
        Task<ExtraHour> GetExtraHourById(int id);
        Task<IEnumerable<ExtraHour>> GetExtraHoursByUser(int userId);
        Task<ExtraHour> CreateExtraHour(ExtraHour extraHour);
        Task<ExtraHour> UpdateExtraHour(int id, ExtraHour updatedExtraHour);
        Task<bool> DeleteExtraHour(int id);
        Task<ExtraHour> ApproveExtraHour(int id, int approvedById);
        Task<ExtraHour> RejectExtraHour(int id, string reason);
    }
}