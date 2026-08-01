using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Persistence.Configurations;

public class RolePermissionConfiguration
    : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(
        EntityTypeBuilder<RolePermission> builder)
    {

        // ==========================
        // Table
        // ==========================

        builder.ToTable("RolePermissions");



        // ==========================
        // Composite Primary Key
        // ==========================

        builder.HasKey(x => new
        {
            x.RoleId,
            x.PermissionId
        });



        // ==========================
        // Role Relation
        // ==========================

        builder.HasOne(x => x.Role)
            .WithMany(x => x.RolePermissions)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);



        // ==========================
        // Permission Relation
        // ==========================

        builder.HasOne(x => x.Permission)
            .WithMany(x => x.RolePermissions)
            .HasForeignKey(x => x.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);



        // ==========================
        // Indexes
        // ==========================

        builder.HasIndex(x => x.RoleId);


        builder.HasIndex(x => x.PermissionId);

    }
}