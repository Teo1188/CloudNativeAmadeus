using ExtraHours.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.Core.Repositories
{
    public interface IExtraHourRepository
    {
        Task<IEnumerable<ExtraHour>> GetAllAsync();
        Task<ExtraHour> GetByIdAsync(int id);
        Task<IEnumerable<ExtraHour>> GetByUserIdAsync(int userId);
        Task AddAsync(ExtraHour extraHour);
        Task UpdateAsync(ExtraHour extraHour);
        Task DeleteAsync(int id);
    }
}