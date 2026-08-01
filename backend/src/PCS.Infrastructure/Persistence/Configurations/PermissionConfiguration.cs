using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Persistence.Configurations;

public class PermissionConfiguration
    : IEntityTypeConfiguration<Permission>
{
    public void Configure(
        EntityTypeBuilder<Permission> builder)
    {
        // ==========================
        // Table
        // ==========================

        builder.ToTable("Permissions");


        // ==========================
        // Primary Key
        // ==========================

        builder.HasKey(x => x.Id);



        // ==========================
        // Properties
        // ==========================

        builder.Property(x => x.Code)
            .HasMaxLength(100)
            .IsRequired();


        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();


        builder.Property(x => x.Description)
            .HasMaxLength(1000);


        builder.Property(x => x.Module)
            .HasMaxLength(100)
            .IsRequired();



        // ==========================
        // Indexes
        // ==========================

        // شناسه سیستمی Permission
        builder.HasIndex(x => x.Code)
            .IsUnique();



        // برای فیلتر سریع Permissionهای هر ماژول

        builder.HasIndex(x => x.Module);



        // ==========================
        // Default Values
        // ==========================

        builder.Property(x => x.IsActive)
            .HasDefaultValue(true);


        builder.Property(x => x.IsSystemPermission)
            .HasDefaultValue(false);
    }
}