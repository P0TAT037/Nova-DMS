using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nova_DMS.Services;
using Nova_DMS.Services.Extenstions;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
Console.WriteLine();
// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
                    policy =>
                    {
                        policy.AllowAnyMethod()
                              .AllowAnyHeader()
                              .AllowCredentials()
                              .WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()!);
                    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o => {
    var securityDefinition = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    };
    o.AddSecurityDefinition("oauth2", securityDefinition);
    o.OperationFilter<SecurityRequirementsOperationFilter>();;
});


builder.Services.AddElasticSearch(builder.Configuration);
builder.Services.AddAuthentication()
    .AddJwtBearer(options => options.TokenValidationParameters = new (){
        
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!)),
        
        ValidateIssuer = false,
        ValidateAudience = false,   

        ValidateLifetime = true,
    });

builder.Services.AddScoped<IObjStorageService, MinIoService>();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();


app.MapControllers();

app.Run();
