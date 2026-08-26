using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Planning;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ProjectBaselineConfiguration 
    : IEntityTypeConfiguration<ProjectBaseline>
{
    public void Configure(EntityTypeBuilder<ProjectBaseline> builder)
    {
        builder.ToTable("ProjectBaselines");


        builder.HasKey(x => x.Id);



        // ==========================================
        // Baseline Information
        // ==========================================

        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();


        builder.Property(x => x.Description)
            .HasMaxLength(500);



        // ==========================================
        // Schedule Snapshot
        // ==========================================

        builder.Property(x => x.PlannedDuration)
            .IsRequired();



        // ==========================================
        // Cost Snapshot
        // ==========================================

        builder.Property(x => x.TotalBudget)
            .HasPrecision(18, 2);


        builder.Property(x => x.PlannedValue)
            .HasPrecision(18, 2);



        // ==========================================
        // Project Relationship
        // ==========================================

        builder.HasOne(x => x.Project)
        .WithMany(x => x.Baselines)
        .HasForeignKey(x => x.ProjectId)
        .OnDelete(DeleteBehavior.Cascade);



        // ==========================================
        // Index
        // ==========================================

        builder.HasIndex(x => new
        {
            x.ProjectId,
            x.Name
        })
        .IsUnique();


        builder.HasIndex(x => new
        {
            x.ProjectId,
            x.Version
        });
    }
}