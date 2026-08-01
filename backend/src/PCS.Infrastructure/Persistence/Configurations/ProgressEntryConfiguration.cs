using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.PMS;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ProgressEntryConfiguration : IEntityTypeConfiguration<ProgressEntry>
{
    public void Configure(EntityTypeBuilder<ProgressEntry> builder)
    {
        builder.ToTable("ProgressEntries");


        builder.HasKey(x => x.Id);



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



        builder.HasOne(x => x.Activity)
            .WithMany()
            .HasForeignKey(x => x.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);



        builder.HasIndex(x => new
        {
            x.ActivityId,
            x.ProgressDate
        })
        .IsUnique();
    }
}