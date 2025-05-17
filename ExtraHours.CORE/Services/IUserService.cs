using ExtraHours.Core.Models;
 
namespace ExtraHours.Core.Services
{
    public interface IUserService
    {
        Task<(User? user, string? token)> Authenticate(string email, string password);
        Task<User> Register(User user);
        Task<IEnumerable<User>> GetUsers();
        Task<User?> GetUserById(int id);
        Task<bool> UpdateUser(User user);
        Task<bool> DeleteUser(int id);
    }
}