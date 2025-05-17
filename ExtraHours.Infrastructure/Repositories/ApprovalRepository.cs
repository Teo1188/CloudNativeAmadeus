using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraHours.Infrastructure.Repositories
{
    public class ApprovalRepository : IApprovalRepository
    {
        private readonly AppDbContext _context;

        public ApprovalRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Approval>> GetAllAsync()
        {
            return await _context.Approvals
                .AsNoTracking()
                .Include(a => a.ExtraHour)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task<Approval> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID must be greater than zero", nameof(id));

            return await _context.Approvals
                .Include(a => a.ExtraHour)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Approval>> GetByExtraHourIdAsync(int extraHourId)
        {
            if (extraHourId <= 0)
                throw new ArgumentException("ExtraHour ID must be greater than zero", nameof(extraHourId));

            return await _context.Approvals
                .AsNoTracking()
                .Where(a => a.ExtraHourId == extraHourId)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Approval>> GetByUserIdAsync(int userId)
        {
            if (userId <= 0)
                throw new ArgumentException("User ID must be greater than zero", nameof(userId));

            return await _context.Approvals
                .AsNoTracking()
                .Where(a => a.UserId == userId)
                .Include(a => a.ExtraHour)
                .ToListAsync();
        }

        public async Task AddAsync(Approval approval)
        {
            if (approval == null)
                throw new ArgumentNullException(nameof(approval));

            approval.CreatedAt = DateTime.UtcNow;
            _context.Approvals.Add(approval);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Approval approval)
        {
            if (approval == null)
                throw new ArgumentNullException(nameof(approval));

            approval.UpdatedAt = DateTime.UtcNow;
            _context.Approvals.Update(approval);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID must be greater than zero", nameof(id));

            var approval = await _context.Approvals.FindAsync(id);
            if (approval != null)
            {
                _context.Approvals.Remove(approval);
                await _context.SaveChangesAsync();
            }
        }
    }
}