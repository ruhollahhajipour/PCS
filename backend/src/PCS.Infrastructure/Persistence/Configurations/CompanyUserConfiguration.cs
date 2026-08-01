using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using PCS.Domain.Entities;

namespace PCS.Infrastructure.Persistence.Configurations;

public class CompanyUserConfiguration
    : IEntityTypeConfiguration<CompanyUser>
{
    public void Configure(
        EntityTypeBuilder<CompanyUser> builder)
    {
        // ==========================
        // Table
        // ==========================

        builder.ToTable("CompanyUsers");



        // ==========================
        // Primary Key
        // ==========================

        builder.HasKey(x => x.Id);



        // ==========================
        // Properties
        // ==========================

        builder.Property(x => x.Notes)
            .HasMaxLength(500);


        builder.Property(x => x.RemovalReason)
            .HasMaxLength(1000);



        // ==========================
        // Company Relation
        // ==========================

        builder.HasOne(x => x.Company)
            .WithMany(c => c.Users)
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);



        // ==========================
        // User Relation
        // ==========================

        builder.HasOne(x => x.User)
            .WithMany(u => u.Companies)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);



        // ==========================
        // Invited By Relation
        // ==========================

        builder.HasOne(x => x.InvitedByUser)
            .WithMany()
            .HasForeignKey(x => x.InvitedByUserId)
            .OnDelete(DeleteBehavior.Restrict);



        // ==========================
        // Unique Membership
        // ==========================

        // یک کاربر فقط یک عضویت فعال در یک شرکت دارد

        builder.HasIndex(x => new
        {
            x.CompanyId,
            x.UserId
        })
        .IsUnique();



        // ==========================
        // Active Company Users
        // ==========================

        builder.HasIndex(x => new
        {
            x.CompanyId,
            x.IsActive
        });



        // ==========================
        // فقط یک مدیر اصلی فعال برای هر شرکت
        // ==========================

        builder.HasIndex(x => new
        {
            x.CompanyId,
            x.IsPrimaryAdmin
        })
        .HasFilter(
            "\"IsPrimaryAdmin\" = 1 AND \"IsActive\" = 1")
        .IsUnique();
    }
}