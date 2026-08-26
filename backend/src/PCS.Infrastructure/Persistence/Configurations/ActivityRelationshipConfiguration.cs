using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Planning;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ActivityRelationshipConfiguration
    : IEntityTypeConfiguration<ActivityRelationship>
{
    public void Configure(EntityTypeBuilder<ActivityRelationship> builder)
    {
        builder.ToTable("ActivityRelationships");


        builder.HasKey(x => x.Id);



        // ==========================================
        // Relationship Type
        // ==========================================

        builder.Property(x => x.Type)
            .HasMaxLength(2)
            .IsRequired();


        builder.Property(x => x.Lag)
            .IsRequired();


        builder.Property(x => x.Description)
            .HasMaxLength(500);



        // ==========================================
        // CPM Relationships
        // ==========================================

        builder.HasOne(x => x.Predecessor)
            .WithMany(x => x.Successors)
            .HasForeignKey(x => x.PredecessorId)
            .OnDelete(DeleteBehavior.Restrict);



        builder.HasOne(x => x.Successor)
            .WithMany(x => x.Predecessors)
            .HasForeignKey(x => x.SuccessorId)
            .OnDelete(DeleteBehavior.Restrict);



        // ==========================================
        // Index
        // ==========================================

        builder.HasIndex(x => new
        {
            x.PredecessorId,
            x.SuccessorId,
            x.Type
        })
        .IsUnique();
    }
}