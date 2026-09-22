using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Licensing;

namespace PCS.Infrastructure.Persistence.Configurations;

public class LicenseModuleConfiguration : IEntityTypeConfiguration<LicenseModule>
{
    public void Configure(EntityTypeBuilder<LicenseModule> builder)
    {
        builder.ToTable("LicenseModules");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ModuleId)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.IsActive)
            .IsRequired();

        builder.Property(x => x.ExpiresAt);

        builder.HasOne(x => x.License)
            .WithMany(x => x.Modules)
            .HasForeignKey(x => x.LicenseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.LicenseId);

        builder.HasIndex(x => new { x.LicenseId, x.ModuleId })
            .IsUnique();

        builder.HasIndex(x => x.ModuleId);
    }
}