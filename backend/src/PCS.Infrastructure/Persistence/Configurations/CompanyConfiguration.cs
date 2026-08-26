using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PCS.Domain.Entities;

namespace PCS.Infrastructure.Persistence.Configurations;

public class CompanyConfiguration 
    : IEntityTypeConfiguration<Company>
{
    public void Configure(
        EntityTypeBuilder<Company> builder)
    {
        builder.ToTable("Companies");


        builder.HasKey(x => x.Id);



        builder.Property(x => x.Code)
            .HasMaxLength(50)
            .IsRequired();


        builder.Property(x => x.Name)
            .HasMaxLength(250)
            .IsRequired();


        builder.Property(x => x.NationalId)
            .HasMaxLength(50);


        builder.Property(x => x.Address)
            .HasMaxLength(500);


        builder.Property(x => x.Phone)
            .HasMaxLength(50);


        builder.Property(x => x.Email)
            .HasMaxLength(250);



        builder.HasIndex(x => x.Code)
            .IsUnique();


        builder.HasIndex(x => x.NationalId)
            .IsUnique();



        // =====================================
        // Company Branding Theme
        // =====================================

        builder.OwnsOne(
            x => x.Theme,
            theme =>
            {
                theme.Property(x => x.PrimaryColor)
                    .HasMaxLength(20)
                    .HasColumnName("ThemePrimaryColor");


                theme.Property(x => x.DarkColor)
                    .HasMaxLength(20)
                    .HasColumnName("ThemeDarkColor");


                theme.Property(x => x.SecondaryColor)
                    .HasMaxLength(20)
                    .HasColumnName("ThemeSecondaryColor");


                theme.Property(x => x.BorderColor)
                    .HasMaxLength(20)
                    .HasColumnName("ThemeBorderColor");


                theme.Property(x => x.LogoPath)
                    .HasMaxLength(500)
                    .HasColumnName("ThemeLogoPath");


                theme.Property(x => x.IsCustomTheme)
                    .HasColumnName("ThemeIsCustomTheme");
            });
    }
}