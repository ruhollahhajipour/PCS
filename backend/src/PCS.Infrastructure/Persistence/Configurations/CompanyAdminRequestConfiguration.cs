using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using PCS.Domain.Entities.Security;
using PCS.Domain.Enums;

namespace PCS.Infrastructure.Persistence.Configurations;

public class CompanyAdminRequestConfiguration
    : IEntityTypeConfiguration<CompanyAdminRequest>
{
    public void Configure(
        EntityTypeBuilder<CompanyAdminRequest> builder)
    {
        builder.ToTable("CompanyAdminRequests");


        // ==========================
        // Primary Key
        // ==========================

        builder.HasKey(x => x.Id);



        // ==========================
        // Properties
        // ==========================

        builder.Property(x => x.Reason)
            .HasMaxLength(1000)
            .IsRequired();


        builder.Property(x => x.ReferenceNumber)
            .HasMaxLength(100);


        builder.Property(x => x.DocumentPath)
            .HasMaxLength(500);


        builder.Property(x => x.ReviewComment)
            .HasMaxLength(1000);



        // ==========================
        // Enum Conversion
        // ==========================

        builder.Property(x => x.Status)
            .HasConversion<int>()
            .HasDefaultValue(
                CompanyAdminRequestStatus.Pending)
            .IsRequired();



        // ==========================
        // Company
        // ==========================

        builder.HasOne(x => x.Company)
        .WithMany(c => c.AdminRequests)
        .HasForeignKey(x => x.CompanyId)
        .OnDelete(DeleteBehavior.Restrict);



        // ==========================
        // Current Admin
        // ==========================

        builder.HasOne(x => x.CurrentAdmin)
            .WithMany()
            .HasForeignKey(x => x.CurrentAdminId)
            .OnDelete(DeleteBehavior.Restrict);



        // ==========================
        // Proposed Admin
        // ==========================

        builder.HasOne(x => x.ProposedAdmin)
            .WithMany()
            .HasForeignKey(x => x.ProposedAdminId)
            .OnDelete(DeleteBehavior.Restrict);



        // ==========================
        // Reviewer (Super Admin)
        // ==========================

        builder.HasOne(x => x.ReviewedByUser)
            .WithMany()
            .HasForeignKey(x => x.ReviewedByUserId)
            .OnDelete(DeleteBehavior.Restrict);


// ==========================
// Requested By
// ==========================

builder.HasOne(x => x.RequestedByUser)
    .WithMany()
    .HasForeignKey(x => x.RequestedByUserId)
    .OnDelete(DeleteBehavior.Restrict);


// ==========================
// Executed By
// ==========================

builder.HasOne(x => x.ExecutedByUser)
    .WithMany()
    .HasForeignKey(x => x.ExecutedByUserId)
    .OnDelete(DeleteBehavior.Restrict);

    
        // ==========================
        // Indexes
        // ==========================

        builder.HasIndex(x => x.CompanyId);


        builder.HasIndex(x => x.Status);


        builder.HasIndex(x => new
        {
            x.CompanyId,
            x.Status
        });


        builder.HasIndex(x => x.ProposedAdminId);



        // ==========================
        // Legal Tracking
        // ==========================

        builder.HasIndex(x => x.ReferenceNumber)
            .IsUnique()
            .HasFilter(
                "\"ReferenceNumber\" IS NOT NULL");
    }
}