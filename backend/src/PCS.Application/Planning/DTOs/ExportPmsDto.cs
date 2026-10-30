namespace PCS.Application.Planning.DTOs;


public class ExportPmsDto
{
    public Guid ProjectId { get; set; }



    // ==========================================
    // Project Information
    // ==========================================

    public string ProjectName { get; set; }
        = string.Empty;


    public string ClientName { get; set; }
        = string.Empty;


    public string ContractorName { get; set; }
        = string.Empty;


    public string ConsultantName { get; set; }
        = string.Empty;



    // ==========================================
    // Report Information
    // ==========================================

    public string ReportTitle { get; set; }
        = "PCS Professional PMS Report";


    public string GeneratedBy { get; set; }
        = "PCS Project Control Suite";


    public string InstallationUrl { get; set; }
        = "https://pcs-platform.com/install";


    public DateTime ExportDate { get; set; }
        = DateTime.UtcNow;

    public bool HasApprovedBaseline { get; set; }

    public Guid? BaselineId { get; set; }

    public string? BaselineName { get; set; }

    public int BaselineVersion { get; set; }

    public DateTime EvmDataDate { get; set; }



    // ==========================================
    // Branding
    // ==========================================


    // Platform Branding

    public string PlatformName { get; set; }
        = "Project Control Suite";


    public string PlatformLogoPath { get; set; }
        = "pcs-logo.png";



    // Client / Company Branding

    public string CompanyDisplayName { get; set; }
        = string.Empty;


    public string CompanyLogoPath { get; set; }
        = string.Empty;



    // ==========================================
    // Company Theme
    // ==========================================

    public string ThemePrimaryColor { get; set; }
        = "#2563EB";


    public string ThemeDarkColor { get; set; }
        = "#0F172A";


    public string ThemeSecondaryColor { get; set; }
        = "#60A5FA";


    public string ThemeBorderColor { get; set; }
        = "#1E3A8A";



    // Legacy Support

    public string LogoPath { get; set; }
        = "pcs-logo.png";


    public string WatermarkPath { get; set; }
        = "pcs-watermark.png";



    // ==========================================
    // PMS Data Source
    // ==========================================

    public List<WbsNodeDto> WbsNodes { get; set; }
        = new();


    public List<ActivityDto> Activities { get; set; }
        = new();



    // ==========================================
    // Excel Formula Configuration
    // ==========================================

    public string WbsSheetName { get; set; }
        = "WBS";


    public string ActivitiesSheetName { get; set; }
        = "Activities";



    // ==========================================
    // Snapshot KPI
    // ==========================================

    public decimal TotalBudget { get; set; }


    public decimal OverallProgress { get; set; }


    public int TotalActivities { get; set; }


    public int TotalWbsNodes { get; set; }



    // ==========================================
    // Snapshot EVM
    // ==========================================

    public decimal PlannedValue { get; set; }


    public decimal EarnedValue { get; set; }


    public decimal ActualCost { get; set; }


    public decimal CostVariance { get; set; }


    public decimal ScheduleVariance { get; set; }


    public decimal CPI { get; set; }


    public decimal SPI { get; set; }
}