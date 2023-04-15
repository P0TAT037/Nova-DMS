using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System.IdentityModel.Tokens.Jwt;

namespace Nova_DMS.Security;

[AttributeUsage(AttributeTargets.Method)]
public class AuthorizeAdminAttribute : Attribute, IAsyncAuthorizationFilter
{
    int _level;

    public AuthorizeAdminAttribute(int level = 1) {
        _level = level;
    }

    public Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        StringValues authToken;
        context.HttpContext.Request.Headers.TryGetValue("Authorization", out authToken);
        if (authToken.Count != 0)
        {
            var token = new JwtSecurityToken(authToken[0]!.Split(" ")[1]);
            var level = token.Claims.First(c => c.Type == "level").Value;
            
            int l = int.Parse(level);
            if (l == _level)
            {
                return Task.CompletedTask;
            }

        }
        context.Result = new UnauthorizedResult();
        return Task.CompletedTask;
        
    }
}
