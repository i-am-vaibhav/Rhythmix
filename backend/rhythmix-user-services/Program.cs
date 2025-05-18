using Steeltoe.Extensions.Configuration.ConfigServer;
using Microsoft.EntityFrameworkCore;
using rhythmix_user_services.Data;
using rhythmix_user_services.Services;

var builder = WebApplication.CreateBuilder(args);

//spring cloud config support
var profile = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

builder.Configuration.AddConfigServer(profile);

// Add EF Core with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration["ConnectionStrings__DefaultConnection"]));


// Add controller support (for APIs)
builder.Services.AddControllers();

builder.Services.AddScoped<IUserService, UserService>();

// Optional: Swagger for API testing (in dev only)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


Console.WriteLine("Connection string: " + builder.Configuration["ConnectionStrings__DefaultConnection"]);



var app = builder.Build();

// Redirect root URL to Swagger UI
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/")
    {
        context.Response.Redirect("/swagger");  // Redirect to Swagger UI
        return;
    }
    await next();
});

// Swagger setup
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // Apply any pending migrations automatically
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();