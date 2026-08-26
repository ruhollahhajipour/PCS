namespace PCS.Domain.Entities;

public sealed class CompanyTheme
{
    public Guid Id { get; set; }


    public Guid CompanyId { get; set; }



    public string PrimaryColor { get; set; }
        = "#2563EB";


    public string DarkColor { get; set; }
        = "#0F172A";


    public string SecondaryColor { get; set; }
        = "#60A5FA";


    public string BorderColor { get; set; }
        = "#1E3A8A";



    public string LogoPath { get; set; }
        = string.Empty;



    public bool IsCustomTheme { get; set; }
        = false;



    public Company Company { get; set; }
        = null!;
}