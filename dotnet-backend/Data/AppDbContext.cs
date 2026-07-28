namespace Ntay.Data;

using Microsoft.EntityFrameworkCore;
using Ntay.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BankAccount>()
            .HasOne(ba => ba.Bank)
            .WithMany()
            .HasForeignKey(ba => ba.BankId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    public DbSet<Bank> Banks { get; set; } = null!;
    public DbSet<BankAccount> BankAccounts { get; set; } = null!;
}
