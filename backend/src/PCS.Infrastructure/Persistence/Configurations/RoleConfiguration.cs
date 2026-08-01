using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Persistence.Configurations;

public class RoleConfiguration
    : IEntityTypeConfiguration<Role>
{
    public void Configure(
        EntityTypeBuilder<Role> builder)
    {
        // ==========================
        // Table
        // ==========================

        builder.ToTable("Roles");


        // ==========================
        // Primary Key
        // ==========================

        builder.HasKey(x => x.Id);



        // ==========================
        // Properties
        // ==========================

        builder.Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();


        builder.Property(x => x.Description)
            .HasMaxLength(500);



        // ==========================
        // Index
        // ==========================

        builder.HasIndex(x => x.Name)
            .IsUnique();



        // ==========================
        // User Roles Relation
        // ==========================

        builder.HasMany(x => x.UserRoles)
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);



        // ==========================
        // Role Permissions Relation
        // ==========================

        builder.HasMany(x => x.RolePermissions)
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}