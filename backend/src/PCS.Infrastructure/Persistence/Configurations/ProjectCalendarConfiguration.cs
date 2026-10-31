using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities.Planning;

namespace PCS.Infrastructure.Persistence.Configurations;

public class ProjectCalendarConfiguration 
    : IEntityTypeConfiguration<ProjectCalendar>
{
    public void Configure(EntityTypeBuilder<ProjectCalendar> builder)
    {
        builder.ToTable("ProjectCalendars");


        builder.HasKey(x => x.Id);



        // ==========================================
        // Calendar Information
        // ==========================================

        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();


        builder.Property(x => x.Description)
            .HasMaxLength(500);



        // ==========================================
        // Working Time
        // ==========================================

        builder.Property(x => x.WorkingDaysPerWeek)
            .IsRequired();


        builder.Property(x => x.WorkingHoursPerDay)
            .HasPrecision(5, 2);



        // ==========================================
        // Project Relationship
        // ==========================================

        builder.HasOne(x => x.Project)
        .WithMany(x => x.Calendars)
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



        // ==========================================
        // Default Calendar
        // ==========================================

        builder.HasIndex(x => new
        {
            x.ProjectId,
            x.IsDefault
        });
    }
}