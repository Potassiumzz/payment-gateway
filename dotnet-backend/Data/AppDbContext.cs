namespace Ntay.Data;

using Microsoft.EntityFrameworkCore;
using Ntay.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public DbSet<Bank> Banks { get; set; } = null!;
    public DbSet<BankAccount> BankAccounts { get; set; } = null!;
    public DbSet<Transaction> Transactions { get; set; } = null!;
    public DbSet<PaymentIntent> PaymentIntents { get; set; } = null!;
    public DbSet<AccountPin> AccountPins { get; set; } = null!;
}
