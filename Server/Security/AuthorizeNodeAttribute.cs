using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.Extensions.Primitives;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.Intrinsics.Arm;
using Microsoft.Data.SqlClient;
using Dapper;
using Nest;

namespace Nova_DMS.Security;

[AttributeUsage(AttributeTargets.Method)]
public class AuthorizeNodeAttribute : Attribute, IAsyncAuthorizationFilter
{
    int _perm;
    public AuthorizeNodeAttribute(int perm = 0)
    {
        _perm = perm;
    }

    public Task OnAuthorizationAsync(AuthorizationFilterContext filterContext)
    {
        var config = filterContext.HttpContext.RequestServices.GetService<IConfiguration>();
        var _db = new SqlConnection(config.GetConnectionString("SqlServer"));
        StringValues authToken;
        filterContext.HttpContext.Request.Headers.TryGetValue("Authorization", out authToken);
        if (authToken.Count != 0)
        {
            var token = new JwtSecurityToken(authToken[0]!.Split(" ")[1]);
            var userId = token.Claims.First(c => c.Type == "id").Value;
            StringValues fileId;
            filterContext.HttpContext.Request.Query.TryGetValue("id", out fileId);
            var param = new DynamicParameters();
            param.Add("@USRID", int.Parse(userId));
            param.Add("@FILEID", int.Parse(fileId!));

            var result = _db.Query<int>("SELECT NOV.FILES_USERS.PERM FROM NOV.FILES_USERS WHERE FILE_ID = @FILEID AND USER_ID = @USRID", param: param);
            

            if(result.Count() == 0 || result.First() < _perm)
            {
                filterContext.Result = new UnauthorizedResult();
            }
            return Task.CompletedTask;


        }
        else
        {
            filterContext.Result = new UnauthorizedResult();
            return Task.CompletedTask;
        }
    }

    public bool IsValidToken(string authToken)
    {
        //validate Token here  
        return true;
    }
}
