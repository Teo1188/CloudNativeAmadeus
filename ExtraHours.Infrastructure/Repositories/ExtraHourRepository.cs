using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraHours.Infrastructure.Repositories
{
    public class ExtraHourRepository : IExtraHourRepository
    {
        private readonly AppDbContext _context;

        public ExtraHourRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExtraHour>> GetAllAsync()
        {
            return await _context.ExtraHours
                .Include(eh => eh.User)
                .Include(eh => eh.ExtraHourType)
                .Include(eh => eh.ApprovedBy)
                .ToListAsync();
        }

        public async Task<ExtraHour> GetByIdAsync(int id)
        {
            var extraHour = await _context.ExtraHours
                .Include(eh => eh.User)
                .Include(eh => eh.ExtraHourType)
                .Include(eh => eh.ApprovedBy)
                .FirstOrDefaultAsync(eh => eh.Id == id);
                return extraHour ?? throw new KeyNotFoundException($"No se encontró ExtraHour con ID {id}");
        }

        public async Task<IEnumerable<ExtraHour>> GetByUserIdAsync(int userId)
        {
            return await _context.ExtraHours
                .Where(eh => eh.UserId == userId)
                .Include(eh => eh.ExtraHourType)
                .Include(eh => eh.ApprovedBy)
                .ToListAsync();
        }

        public async Task AddAsync(ExtraHour extraHour)
        {
            _context.ExtraHours.Add(extraHour);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ExtraHour extraHour)
        {
            extraHour.UpdatedAt = DateTime.UtcNow;
            _context.ExtraHours.Update(extraHour);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var extraHour = await _context.ExtraHours.FindAsync(id);
            if (extraHour != null)
            {
                _context.ExtraHours.Remove(extraHour);
                await _context.SaveChangesAsync();
            }
        }
    }
}