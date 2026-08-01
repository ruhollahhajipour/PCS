using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.PMS;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ProjectBaselineConfiguration : IEntityTypeConfiguration<ProjectBaseline>
{
    public void Configure(EntityTypeBuilder<ProjectBaseline> builder)
    {
        builder.ToTable("ProjectBaselines");


        builder.HasKey(x => x.Id);



        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();



        builder.Property(x => x.Description)
            .HasMaxLength(500);



        builder.Property(x => x.TotalBudget)
            .HasPrecision(18, 2);



        builder.HasOne(x => x.Project)
            .WithMany()
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);



        builder.HasIndex(x => new
        {
            x.ProjectId,
            x.Name
        })
        .IsUnique();
    }
}