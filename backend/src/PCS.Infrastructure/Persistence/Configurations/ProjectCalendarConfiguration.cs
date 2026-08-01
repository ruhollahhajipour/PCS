using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.PMS;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ProjectCalendarConfiguration : IEntityTypeConfiguration<ProjectCalendar>
{
    public void Configure(EntityTypeBuilder<ProjectCalendar> builder)
    {
        builder.ToTable("ProjectCalendars");


        builder.HasKey(x => x.Id);



        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();



        builder.Property(x => x.WorkingHoursPerDay)
            .HasPrecision(5, 2);



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