using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.PMS;

namespace PCS.Infrastructure.Persistence.Configurations;

public class WbsNodeConfiguration : IEntityTypeConfiguration<WbsNode>
{
    public void Configure(EntityTypeBuilder<WbsNode> builder)
    {
        builder.ToTable("WbsNodes");

        builder.HasKey(x => x.Id);


        builder.Property(x => x.Code)
            .HasMaxLength(50)
            .IsRequired();


        builder.Property(x => x.Name)
            .HasMaxLength(250)
            .IsRequired();


        builder.Property(x => x.Path)
            .HasMaxLength(500);


        builder.Property(x => x.Budget)
            .HasPrecision(18, 2);


        builder.Property(x => x.Weight)
            .HasPrecision(5, 2);



        builder.HasOne(x => x.Project)
            .WithMany()
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);



        builder.HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentId)
            .OnDelete(DeleteBehavior.Restrict);



        builder.HasIndex(x => new
        {
            x.ProjectId,
            x.Code
        })
        .IsUnique();
    }
}