using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ntay.Models;

namespace Ntay.Data.Configurations;

public class PaymentIntentConfiguration : IEntityTypeConfiguration<PaymentIntent>
{
    public void Configure(EntityTypeBuilder<PaymentIntent> builder)
    {
        builder
            .HasOne(p => p.ReceiverAccount)
            .WithMany()
            .HasForeignKey(p => p.ReceiverAccountId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
