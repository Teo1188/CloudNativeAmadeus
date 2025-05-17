using ExtraHours.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.Core.Repositories
{
    public interface IApprovalRepository
    {
        Task<IEnumerable<Approval>> GetAllAsync();
        Task<Approval> GetByIdAsync(int id);
        Task<IEnumerable<Approval>> GetByExtraHourIdAsync(int extraHourId);
        Task<IEnumerable<Approval>> GetByUserIdAsync(int userId);
        Task AddAsync(Approval approval);
        Task UpdateAsync(Approval approval);
        Task DeleteAsync(int id);
    }
}