using ExtraHours.Core.Repositories;
using ExtraHours.Core.Services;
using ExtraHours.Infrastructure.Services;
using ExtraHours.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using ExtraHours.Infrastructure.Repositories;
using ExtraHours.API.Utils;
 
var builder = WebApplication.CreateBuilder(args);
 
// ⚡ Configurar para leer variables de entorno
builder.Configuration.AddEnvironmentVariables();
 
try
{
    // Add services to the container.
    // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
 
    builder.Services.AddOpenApi();
 
    // 🔧 CONFIGURACIÓN DE BASE DE DATOS con variables de entorno
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
 
    if (string.IsNullOrEmpty(connectionString))
    {
        var dbHost = builder.Configuration["DB_HOST"];
        var dbPort = builder.Configuration["DB_PORT"] ?? "5432";
        var dbName = builder.Configuration["DB_NAME"];
        var dbUser = builder.Configuration["DB_USER"];
        var dbPassword = builder.Configuration["DB_PASSWORD"];
 
        if (string.IsNullOrEmpty(dbHost) || string.IsNullOrEmpty(dbName) ||
            string.IsNullOrEmpty(dbUser) || string.IsNullOrEmpty(dbPassword))
        {
            throw new InvalidOperationException("Faltan variables de entorno de base de datos: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD");
        }
 
        connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";
    }
 
    builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
 
    // 🔐 CONFIGURACIÓN JWT con variables de entorno
    var jwtSecret = builder.Configuration["JWT_SECRET"] ?? builder.Configuration["JWT:Key"] ?? "secret_key";
    var jwtIssuer = builder.Configuration["JWT_ISSUER"] ?? builder.Configuration["JWT:Issuer"] ?? "ExtraHours.API";
    var jwtAudience = builder.Configuration["JWT_AUDIENCE"] ?? builder.Configuration["JWT:Audience"] ?? "Client";
 
    if (string.IsNullOrEmpty(jwtSecret) || jwtSecret.Length < 32)
    {
        throw new InvalidOperationException("JWT_SECRET debe tener al menos 32 caracteres");
    }
 
    var key = Encoding.UTF8.GetBytes(jwtSecret);
 
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options => {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };
        });
 
    // 🌐 CONFIGURACIÓN CORS con variables de entorno
    var allowedOrigins = builder.Configuration["ALLOWED_ORIGINS"]?.Split(',') 
                       ?? new[] { "http://localhost:3000", "http://localhost:5173", "http://localhost:4200", "cloud-native-amadeus.vercel.app" };
 
    builder.Services.AddCors(options => 
    {
        // Política específica para orígenes permitidos
        options.AddPolicy("AllowSpecificOrigins", policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials());
        // Mantener tu política original para compatibilidad
        options.AddPolicy("AllowAll", policy => 
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader());
    });
 
    // 🔧 REGISTRAR SERVICIOS JWT
    builder.Services.AddScoped<IJWTUtils, JWTUtils>();
 
    // 📋 TUS SERVICIOS ORIGINALES (sin cambios)
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IRoleService, RoleService>();
    builder.Services.AddScoped<IRoleRepository, RoleRepository>();
    builder.Services.AddScoped<IDepartmentService, DepartmentService>();
    builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
    builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
    builder.Services.AddScoped<IPermissionService, PermissionService>();
    builder.Services.AddScoped<IExtraHourTypeRepository, ExtraHourTypeRepository>();
    builder.Services.AddScoped<IExtraHourTypeService, ExtraHourTypeService>();
    builder.Services.AddScoped<IExtraHourRepository, ExtraHourRepository>();
    builder.Services.AddScoped<IExtraHourService, ExtraHourService>();
    builder.Services.AddScoped<IApprovalRepository, ApprovalRepository>();
    builder.Services.AddScoped<IApprovalService, ApprovalService>();
 
    builder.Services.AddControllers();
    builder.Services.AddAuthorization();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
 
    var app = builder.Build();
 
    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.UseSwagger();
        app.UseSwaggerUI();
    }
 
    // 🔐 ORDEN CORRECTO DEL PIPELINE
    app.UseCors("AllowSpecificOrigins"); // Usar la política más segura
    app.UseHttpsRedirection();
    app.UseAuthentication(); // ⚠️ IMPORTANTE: Agregar autenticación
    app.UseAuthorization();  // ⚠️ IMPORTANTE: Mover después de Authentication
    app.MapControllers();
 
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("ExtraHours API iniciada correctamente");
 
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Error crítico al iniciar la aplicación: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
 
    // Log adicional para debugging
    if (ex.InnerException != null)
    {
        Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
    }
 
    throw;
}