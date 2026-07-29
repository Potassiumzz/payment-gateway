namespace Ntay.Data;

using Microsoft.EntityFrameworkCore;
using Ntay.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .Entity<BankAccount>()
            .HasOne(ba => ba.Bank)
            .WithMany()
            .HasForeignKey(ba => ba.BankId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder
            .Entity<Transaction>()
            .HasOne(t => t.SenderAccount)
            .WithMany()
            .HasForeignKey(t => t.SenderAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder
            .Entity<Transaction>()
            .HasOne(t => t.ReceiverAccount)
            .WithMany()
            .HasForeignKey(t => t.ReceiverAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder
            .Entity<PaymentIntent>()
            .HasOne(pi => pi.ReceiverAccount)
            .WithMany()
            .HasForeignKey(pi => pi.ReceiverAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder
            .Entity<Transaction>()
            .HasOne(t => t.PaymentIntent)
            .WithMany()
            .HasForeignKey(t => t.PaymentIntentId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    public DbSet<Bank> Banks { get; set; } = null!;
    public DbSet<BankAccount> BankAccounts { get; set; } = null!;
    public DbSet<Transaction> Transactions { get; set; } = null!;
    public DbSet<PaymentIntent> PaymentIntents { get; set; } = null!;
}
