using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Planning;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ProgressEntryConfiguration 
    : IEntityTypeConfiguration<ProgressEntry>
{
    public void Configure(EntityTypeBuilder<ProgressEntry> builder)
    {
        builder.ToTable("ProgressEntries");


        builder.HasKey(x => x.Id);



        // ==========================================
        // Progress & EVM Values
        // ==========================================

        builder.Property(x => x.Progress)
            .HasPrecision(5, 2);


        builder.Property(x => x.ActualCost)
            .HasPrecision(18, 2);


        builder.Property(x => x.EarnedValue)
            .HasPrecision(18, 2);


        builder.Property(x => x.PlannedValue)
            .HasPrecision(18, 2);


        builder.Property(x => x.RemainingCost)
            .HasPrecision(18, 2);



        // ==========================================
        // Activity Relationship
        // ==========================================

        builder.HasOne(x => x.Activity)
            .WithMany()
            .HasForeignKey(x => x.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);



        // ==========================================
        // Reporting Index
        // ==========================================

        builder.HasIndex(x => new
        {
            x.ActivityId,
            x.ProgressDate
        })
        .IsUnique();
    }
}