using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ntay.Models;

namespace Ntay.Data.Configurations;

public class BankAccountConfiguration : IEntityTypeConfiguration<BankAccount>
{
    public void Configure(EntityTypeBuilder<BankAccount> builder)
    {
        builder
            .HasOne(b => b.Bank)
            .WithMany()
            .HasForeignKey(b => b.BankId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
