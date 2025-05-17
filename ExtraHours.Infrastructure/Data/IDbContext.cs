using ExtraHours.Core.Models;
using Microsoft.EntityFrameworkCore; 


namespace ExtraHours.Infrastructure.Data
{
    public interface IDbContext
    {
      DbSet<User> Users { get;}
      DbSet<Role> Roles { get;}
      DbSet<Permission> Permissions { get;}
      DbSet<Department> Departments { get; }

    }
}