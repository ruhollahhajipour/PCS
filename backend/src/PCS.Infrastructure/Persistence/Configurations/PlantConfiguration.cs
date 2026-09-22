using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities;

namespace PCS.Infrastructure.Persistence.Configurations;

public class PlantConfiguration
    : IEntityTypeConfiguration<Plant>
{
    public void Configure(
        EntityTypeBuilder<Plant> builder)
    {
        builder.ToTable("Plants");


        builder.HasKey(x => x.Id);


        // ==========================
        // Basic Information
        // ==========================

        builder.Property(x => x.Code)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.Name)
            .HasMaxLength(250)
            .IsRequired();

        builder.Property(x => x.ShortName)
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);


        // ==========================
        // Organization
        // ==========================

        builder.HasOne(x => x.Company)
            .WithMany()
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);


        // ==========================
        // Contact
        // ==========================

        builder.Property(x => x.Address)
            .HasMaxLength(500);

        builder.Property(x => x.Phone)
            .HasMaxLength(50);

        builder.Property(x => x.Email)
            .HasMaxLength(250);


        // ==========================
        // Indexes
        // ==========================

        builder.HasIndex(x => new
        {
            x.CompanyId,
            x.Code
        })
        .IsUnique();
    }
}