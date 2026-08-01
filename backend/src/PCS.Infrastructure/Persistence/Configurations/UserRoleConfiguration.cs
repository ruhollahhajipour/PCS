using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using PCS.Domain.Entities.Security;

namespace PCS.Infrastructure.Persistence.Configurations;

public class UserRoleConfiguration
    : IEntityTypeConfiguration<UserRole>
{
    public void Configure(
        EntityTypeBuilder<UserRole> builder)
    {

        // ==========================
        // Table
        // ==========================

        builder.ToTable("UserRoles");


        // ==========================
        // Composite Primary Key
        // ==========================

        builder.HasKey(x => new
        {
            x.UserId,
            x.RoleId
        });



        // ==========================
        // User Relation
        // ==========================

        builder.HasOne(x => x.User)
            .WithMany(x => x.UserRoles)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);



        // ==========================
        // Role Relation
        // ==========================

        builder.HasOne(x => x.Role)
            .WithMany(x => x.UserRoles)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);



        // ==========================
        // Indexes
        // ==========================

        builder.HasIndex(x => x.UserId);


        builder.HasIndex(x => x.RoleId);

    }
}