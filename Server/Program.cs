using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Nova_DMS.Services;
using Nova_DMS.Services.Extenstions;

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
builder.Services.AddSwaggerGen();


builder.Services.AddElasticSearch(builder.Configuration);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme,options => builder.Configuration.Bind("JwtSettings", options));

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
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
