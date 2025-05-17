using ExtraHours.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ExtraHours.Infrastructure.Data
{
    public static class DatabaseSeeder
{

    public static void Seed(ModelBuilder modelBuilder)
    {
        SeedRoles(modelBuilder);
        SeedDepartments(modelBuilder);
        SeedUsers(modelBuilder);
        SeedExtraHourTypes(modelBuilder);
    }

    private static void SeedRoles(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "administrador" },
            new Role { Id = 2, Name = "empleado" }
        );
    }

    private static void SeedDepartments(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Department>().HasData(
            new Department 
            { 
                Id = 1, 
                Name = "Tecnología", 
                Location = "Edificio principal torre 2 piso 7" 
            },
            new Department 
            { 
                Id = 2, 
                Name = "Administracion", 
                Location = "Edificio corporativo, gerencia" 
            }
        );
    }

    private static void SeedUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "admin",
                Email = "admin@admin.com",
                Password = "AQAAAAIAAYagAAAAEM7kWAg//wUuwiCJ+o/3tXs8JNrVO4VPH7ulyfwIxx+LPY7l5WcUV8FI8yfMTd/dTw==",
                Salary = 20000000,
                RoleId = 1,
                DepartmentId = 2
            },
            new User
            {
                Id = 2,
                Name = "dante",
                Email = "dante@empleado.com",
                Password = "AQAAAAIAAYagAAAAEOw45VY3DnPsqhXu07ATTilanJg0AoacObDzouO5ODqIK8JObDKfftnv9YL4QnmX9Q==",
                Salary = 8000000,
                RoleId = 2,
                DepartmentId = 1
            }
        );
    }

    private static void SeedExtraHourTypes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ExtraHourType>().HasData(
            new ExtraHourType { Id = 1, Name = "Diurna" },
            new ExtraHourType { Id = 2, Name = "Nocturna" },
            new ExtraHourType { Id = 3, Name = "Dominical Diurna" },
            new ExtraHourType { Id = 4, Name = "Dominical Nocturna" },
            new ExtraHourType { Id = 5, Name = "Festiva Diurna" },
            new ExtraHourType { Id = 6, Name = "Festiva Nocturna" }
        );
    }
    }
}