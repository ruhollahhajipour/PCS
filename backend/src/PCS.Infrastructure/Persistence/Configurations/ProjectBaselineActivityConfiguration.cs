using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Planning;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ProjectBaselineActivityConfiguration
    : IEntityTypeConfiguration<ProjectBaselineActivity>
{
    public void Configure(EntityTypeBuilder<ProjectBaselineActivity> builder)
    {
        builder.ToTable("ProjectBaselineActivities");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ActivityCode)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.ActivityName)
            .HasMaxLength(250)
            .IsRequired();

        builder.Property(x => x.WbsCode)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.WbsName)
            .HasMaxLength(250)
            .IsRequired();

        builder.Property(x => x.CalendarName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Budget)
            .HasPrecision(18, 2);

        builder.Property(x => x.WorkingHoursPerDay)
            .HasPrecision(5, 2);

        // Snapshot data deliberately has no FK to Activities.
        builder.HasOne(x => x.ProjectBaseline)
            .WithMany(x => x.Activities)
            .HasForeignKey(x => x.ProjectBaselineId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new
        {
            x.ProjectBaselineId,
            x.ActivityId
        }).IsUnique();

        builder.HasIndex(x => new
        {
            x.ProjectBaselineId,
            x.WbsCode
        });
    }
}
