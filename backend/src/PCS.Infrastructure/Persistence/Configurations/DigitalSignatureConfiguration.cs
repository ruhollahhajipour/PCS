using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using PCS.Domain.Entities.Security;
using PCS.Domain.Enums;

namespace PCS.Infrastructure.Persistence.Configurations;

public class DigitalSignatureConfiguration
    : IEntityTypeConfiguration<DigitalSignature>
{
    public void Configure(
        EntityTypeBuilder<DigitalSignature> builder)
    {
        // ==========================
        // Table
        // ==========================

        builder.ToTable("DigitalSignatures");


        // ==========================
        // Primary Key
        // ==========================

        builder.HasKey(x => x.Id);



        // ==========================
        // Properties
        // ==========================

        builder.Property(x => x.EntityType)
            .HasMaxLength(200)
            .IsRequired();


        builder.Property(x => x.SignedContentHash)
            .HasMaxLength(512)
            .IsRequired();


        builder.Property(x => x.HashAlgorithm)
            .HasMaxLength(50)
            .IsRequired();


        builder.Property(x => x.CertificateInfo)
            .HasMaxLength(2000);


        builder.Property(x => x.SignatureReference)
            .HasMaxLength(100)
            .IsRequired();


        builder.Property(x => x.StatusReason)
            .HasMaxLength(1000);


        builder.Property(x => x.IpAddress)
            .HasMaxLength(50);


        builder.Property(x => x.DeviceInfo)
            .HasMaxLength(500);


        builder.Property(x => x.LocationInfo)
            .HasMaxLength(500);



        // ==========================
        // Enum Conversion
        // ==========================

        builder.Property(x => x.Status)
            .HasConversion<int>()
            .HasDefaultValue(
                DigitalSignatureStatus.Valid)
            .IsRequired();



        // ==========================
        // User Relation
        // ==========================

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);



        // ==========================
        // Indexes
        // ==========================

        builder.HasIndex(x => x.SignatureReference)
            .IsUnique();


        builder.HasIndex(x => new
        {
            x.EntityType,
            x.EntityId
        });


        builder.HasIndex(x => x.UserId);


        builder.HasIndex(x => x.Status);


        builder.HasIndex(x => new
        {
            x.EntityType,
            x.EntityId,
            x.Status
        })
        .HasFilter(
            "\"Status\" = 0");
    }
}