using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Wordle.Api.Data;
using Wordle.Api.Services;

var MyAllowAllOrigins = "_myAllowAllOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowAllOrigins,
                      policy =>
                      {
                          // Allow origins from appSettings.json
                          var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string>() ??  "*";
                          foreach (var origin in origins.Split(";"))
                          {
                              policy.WithOrigins(origin);
                          }
                      });
});

var logger = LoggerFactory.Create(config =>
{
    config.AddConsole();
}).CreateLogger<Program>();

logger.LogInformation("Starting Add Services");
// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Custom Services
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddScoped<WordService>();


logger.LogInformation("Building Services");
var app = builder.Build();


logger.LogInformation("Creating and Seeding Database");
//Create database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();
    Word.SeedWords(context);
    logger.LogInformation(scope.ServiceProvider.GetRequiredService<WordService>().GetWord().Text);
}




app.Logger.LogInformation("App Services Built. Building App Pipeline.");




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowAllOrigins);

app.UseAuthorization();

app.MapControllers();

app.Logger.Log(LogLevel.Information, "Starting App...");
app.Run();

public partial class Program { }