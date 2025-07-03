using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace ExtraHours.API.Utils
{
    public class JWTUtils : IJWTUtils
    {
        private readonly SymmetricSecurityKey _key;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expirationMinutes;
        private const long REFRESH_TOKEN_EXPIRATION = 604800000; // 7 días en milisegundos

        public JWTUtils(IConfiguration configuration)
        {
            // Obtener JWT_SECRET del archivo .env o appsettings.json
            var secretString = Environment.GetEnvironmentVariable("JWT_SECRET") 
                            ?? configuration["JWT_SECRET"] 
                            ?? configuration["JwtSettings:SecretKey"];
            
            if (string.IsNullOrEmpty(secretString))
                throw new Exception("JWT_SECRET is not configured. Please check your .env file.");

            // Obtener configuración JWT del archivo .env
            _issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
                   ?? configuration["JWT_ISSUER"] 
                   ?? "ExtraHours.API";

            _audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
                     ?? configuration["JWT_AUDIENCE"] 
                     ?? "Client";

            var expirationString = Environment.GetEnvironmentVariable("JWT_EXPIRES_IN_MINUTES") 
                                ?? configuration["JWT_EXPIRES_IN_MINUTES"] 
                                ?? "60";

            if (!int.TryParse(expirationString, out _expirationMinutes))
                _expirationMinutes = 60; // Default: 1 hora

            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretString));
        }

        public string GenerateToken(dynamic user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email?.ToString()?.Trim() ?? user.email?.ToString()?.Trim() ?? ""),
                new Claim("role", user.Role?.ToString() ?? user.role?.ToString() ?? ""),
                new Claim("id", user.Id?.ToString() ?? user.id?.ToString() ?? ""),
                new Claim(ClaimTypes.NameIdentifier, user.Id?.ToString() ?? user.id?.ToString() ?? "")
            };

            // Convertir minutos a milisegundos para compatibilidad
            long expirationMs = _expirationMinutes * 60 * 1000;
            return CreateToken(claims, expirationMs);
        }

        public string GenerateRefreshToken(dynamic user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email?.ToString()?.Trim() ?? user.email?.ToString()?.Trim() ?? ""),
                new Claim("id", user.Id?.ToString() ?? user.id?.ToString() ?? ""),
                new Claim(ClaimTypes.NameIdentifier, user.Id?.ToString() ?? user.id?.ToString() ?? "")
            };

            return CreateToken(claims, REFRESH_TOKEN_EXPIRATION);
        }

        private string CreateToken(IEnumerable<Claim> claims, long expirationMs)
        {
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMilliseconds(expirationMs),
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public ClaimsPrincipal ExtractClaims(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _key,
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            return tokenHandler.ValidateToken(token, validationParameters, out _);
        }

        public bool IsTokenValid(string token, dynamic user)
        {
            try
            {
                var principal = ExtractClaims(token);
                var username = principal.Identity?.Name;
                var userId = principal.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
                
                var userEmail = user.Email?.ToString() ?? user.email?.ToString() ?? "";
                var userIdString = user.Id?.ToString() ?? user.id?.ToString() ?? "";

                return username == userEmail && userId == userIdString;
            }
            catch (Exception ex)
            {
                // Log del error si tienes un sistema de logging
                Console.WriteLine($"Token validation error: {ex.Message}");
                return false;
            }
        }
    }
}