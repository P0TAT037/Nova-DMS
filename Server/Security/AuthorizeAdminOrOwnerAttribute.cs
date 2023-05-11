using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Primitives;
using System.IdentityModel.Tokens.Jwt;

namespace Nova_DMS.Security;

[AttributeUsage(AttributeTargets.Method)]
public class AuthorizeAdminOrOwnerAttribute : Attribute, IAsyncAuthorizationFilter
{
    int _level;

    public AuthorizeAdminOrOwnerAttribute(int level = 1) {
        _level = level;
    }

    public Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var _db = context.HttpContext.RequestServices.GetService<SqlConnection>();
        var fileId = int.Parse(context.HttpContext.Request.Query["FileId"].ToString());
        StringValues authToken;
        context.HttpContext.Request.Headers.TryGetValue("Authorization", out authToken);
        if (authToken.Count != 0)
        {
            var token = new JwtSecurityToken(authToken[0]!.Split(" ")[1]);
            var level = token.Claims.First(c => c.Type == "level").Value;
            var UserId = token.Claims.First(c => c.Type == "id").Value;
            var result = _db.Query<int>("SELECT * FROM NOV.FILES_OWNERS WHERE NOV.FILES_OWNERS.FileID = @FILEID AND NOV.FILES_OWNERS.UserID = @USRID", param: new { FILEID = fileId, USRID = UserId });
            bool isOwner = result.Count() != 0;
            int l = int.Parse(level);
            if (l >= _level || isOwner)
            {
                return Task.CompletedTask;
            }

        }
        context.Result = new UnauthorizedResult();
        return Task.CompletedTask;
        
    }
}
