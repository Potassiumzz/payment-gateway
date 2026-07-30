using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ntay.Models;

namespace Ntay.Data.Configurations;

public class AccountPinConfiguration : IEntityTypeConfiguration<AccountPin>
{
    public void Configure(EntityTypeBuilder<AccountPin> builder)
    {
        builder
            .HasOne(a => a.BankAccount)
            .WithMany()
            .HasForeignKey(a => a.BankAccountId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
