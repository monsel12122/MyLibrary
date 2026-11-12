
using Microsoft.EntityFrameworkCore;
using MyLibrary.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Configure SQLite database.
builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseSqlite("Data Source=mylibrary.db"));

var app = builder.Build();

// Enable Swagger in development.
if (app.Environment.IsDevelopment())
{
   app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthorization();

app.MapControllers();

app.Run();
