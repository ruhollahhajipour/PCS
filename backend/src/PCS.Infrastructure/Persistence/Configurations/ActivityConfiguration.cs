using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Planning;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
{
    public void Configure(EntityTypeBuilder<Activity> builder)
    {
        builder.ToTable("Activities");


        builder.HasKey(x => x.Id);



        // ==========================================
        // Basic Information
        // ==========================================

        builder.Property(x => x.Code)
            .HasMaxLength(50)
            .IsRequired();


        builder.Property(x => x.Name)
            .HasMaxLength(250)
            .IsRequired();



        // ==========================================
        // Cost Control
        // ==========================================

        builder.Property(x => x.Budget)
            .HasPrecision(18, 2);


        builder.Property(x => x.ActualCost)
            .HasPrecision(18, 2);


        builder.Property(x => x.EarnedValue)
            .HasPrecision(18, 2);



        builder.Property(x => x.Weight)
            .HasPrecision(5, 2);


        builder.Property(x => x.Progress)
            .HasPrecision(5, 2);



        // ==========================================
        // Project Relationship
        // ==========================================

        builder.HasOne(x => x.Project)
        .WithMany(x => x.Activities)
        .HasForeignKey(x => x.ProjectId)
        .OnDelete(DeleteBehavior.Cascade);



        // ==========================================
        // WBS Relationship
        // ==========================================

        builder.HasOne(x => x.WbsNode)
            .WithMany(x => x.Activities)
            .HasForeignKey(x => x.WbsNodeId)
            .OnDelete(DeleteBehavior.Restrict);



        // ==========================================
        // Index
        // ==========================================

        builder.HasIndex(x => new
        {
            x.ProjectId,
            x.Code
        })
        .IsUnique();
    }
}