using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

//Esto le dice a dotnet ef cómo instanciar AppDbContext en tiempo de diseño.

namespace ExtraHours.Infrastructure.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            var connectionString = config.GetConnectionString("DefaultConnection");

            optionsBuilder.UseNpgsql(connectionString); // Usa el provider de PostgreSQL

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
