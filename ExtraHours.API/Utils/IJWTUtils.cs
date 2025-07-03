using System.Security.Claims;

namespace ExtraHours.API.Utils
{
    public interface IJWTUtils
    {
        string GenerateToken(dynamic user);
        string GenerateRefreshToken(dynamic user);
        ClaimsPrincipal ExtractClaims(string token);
        bool IsTokenValid(string token, dynamic user);
    }
}