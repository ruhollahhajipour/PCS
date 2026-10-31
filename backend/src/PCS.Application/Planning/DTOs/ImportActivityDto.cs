namespace PCS.Application.Planning.DTOs;

public class ImportActivityDto
{
    public string Code { get; set; }
        = string.Empty;



    public string WbsCode { get; set; }
        = string.Empty;



    public string Name { get; set; }
        = string.Empty;



    // ==============================
    // Schedule
    // ==============================

    public int Duration { get; set; }


    public int RemainingDuration { get; set; }



    public DateTime? PlannedStart { get; set; }


    public DateTime? PlannedFinish { get; set; }



    public DateTime? ActualStart { get; set; }


    public DateTime? ActualFinish { get; set; }




    // ==============================
    // Cost / Weight
    // ==============================

    public decimal Budget { get; set; }


    public decimal Weight { get; set; }


    public decimal Progress { get; set; }




    // ==============================
    // Status
    // ==============================

    public string Status { get; set; }
        = "NotStarted";



    public bool IsMilestone { get; set; }
}