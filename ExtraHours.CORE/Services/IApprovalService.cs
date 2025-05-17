using ExtraHours.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.Core.Services
{
    public interface IApprovalService
    {
        Task<IEnumerable<Approval>> GetAllApprovals();
        Task<Approval> GetApprovalById(int id);
        Task<IEnumerable<Approval>> GetApprovalsByExtraHour(int extraHourId);
        Task<IEnumerable<Approval>> GetApprovalsByUser(int userId);
        Task<Approval> CreateApproval(Approval approval);
        Task<Approval> UpdateApproval(int id, Approval updatedApproval);
        Task<bool> DeleteApproval(int id);
        Task<Approval> ApproveExtraHour(int extraHourId, int userId, string annotations);
        Task<Approval> RejectExtraHour(int extraHourId, int userId, string annotations);
    }
}