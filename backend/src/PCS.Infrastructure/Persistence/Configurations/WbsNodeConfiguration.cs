using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Planning;

namespace PCS.Infrastructure.Persistence.Configurations;

public class WbsNodeConfiguration : IEntityTypeConfiguration<WbsNode>
{
    public void Configure(EntityTypeBuilder<WbsNode> builder)
    {
        builder.ToTable("WbsNodes");

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


        builder.Property(x => x.Type)
            .HasMaxLength(50)
            .IsRequired();


        builder.Property(x => x.Path)
            .HasMaxLength(500);



        // ==========================================
        // Cost Control
        // ==========================================

        builder.Property(x => x.Budget)
            .HasPrecision(18, 2);


        builder.Property(x => x.ActualCost)
            .HasPrecision(18, 2);


        builder.Property(x => x.Weight)
            .HasPrecision(5, 2);


        builder.Property(x => x.Progress)
            .HasPrecision(5, 2);



        // ==========================================
        // Project Relationship
        // ==========================================

        builder.HasOne(x => x.Project)
        .WithMany(x => x.WbsNodes)
        .HasForeignKey(x => x.ProjectId)
        .OnDelete(DeleteBehavior.Cascade);



        // ==========================================
        // Self Hierarchy
        // ==========================================

        builder.HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentId)
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