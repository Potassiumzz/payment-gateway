using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Ntay.Data;
using Ntay.Data.Seed;
using Ntay.Events;
using Ntay.Services;

WebApplicationBuilder? builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddScoped<BankService>();
builder.Services.AddScoped<BankAccountService>();
builder.Services.AddScoped<AccountPinService>();
builder.Services.AddScoped<PaymentIntentService>();
builder.Services.AddScoped<IdempotencyService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<SeedDatabase>();

builder.Services.AddSingleton<AccountEventBroadcaster>();
builder.Services.AddHostedService<AccountExpiryBackgroundService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Default",
        policy =>
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
        }
    );
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    SeedDatabase seeder = scope.ServiceProvider.GetRequiredService<SeedDatabase>();
    seeder.SeedDefaults();
}

app.UseCors("Default");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
