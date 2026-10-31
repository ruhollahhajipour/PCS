using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Licensing;

namespace PCS.Infrastructure.Persistence.Configurations;

public class LicenseConfiguration : IEntityTypeConfiguration<License>
{
    public void Configure(EntityTypeBuilder<License> builder)
    {
        builder.ToTable("Licenses");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.LicenseKey)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Status)
            .IsRequired();

        builder.Property(x => x.IssuedAt)
            .IsRequired();

        builder.Property(x => x.ExpiresAt);

        builder.HasOne(x => x.Company)
            .WithOne()
            .HasForeignKey<License>(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.CompanyId)
            .IsUnique();

        builder.HasIndex(x => x.LicenseKey)
            .IsUnique();

        builder.HasIndex(x => x.Status);
    }
}