namespace PCS.Application.Planning.DTOs;

public class WbsNodeDto
{
// ==========================================
// Identity
// ==========================================

public Guid Id { get; set; }


public Guid? ParentId { get; set; }



// ==========================================
// WBS Structure
// ==========================================

public string Code { get; set; }
    = string.Empty;


public string? ParentCode { get; set; }


public string Path { get; set; }
    = string.Empty;


public string Name { get; set; }
    = string.Empty;



/// <summary>
/// WBS hierarchy level
/// Level 1 ... N
/// Activity = 0
/// </summary>
public int Level { get; set; }


public int SortOrder { get; set; }


public bool IsActivity { get; set; }
    = false;



// ==========================================
// Cost / Weight
// ==========================================

public decimal Budget { get; set; }


public decimal ActualCost { get; set; }


public decimal PlannedValue { get; set; }


public decimal EarnedValue { get; set; }



/// <summary>
/// Weight relative to parent WBS (W.F)
/// </summary>
public decimal WeightFactor { get; set; }



/// <summary>
/// Weight relative to complete project (W.V)
/// </summary>
public decimal WeightValue { get; set; }



/// <summary>
/// Original imported weight
/// </summary>
public decimal Weight { get; set; }


public decimal Progress { get; set; }




// ==========================================
// EVM Indicators
// ==========================================

public decimal CPI
{
    get
    {
        if (ActualCost == 0)
            return 0;

        return EarnedValue / ActualCost;
    }
}



public decimal SPI
{
    get
    {
        if (PlannedValue == 0)
            return 0;

        return EarnedValue / PlannedValue;
    }
}





// ==========================================
// Tree
// ==========================================

public List<WbsNodeDto> Children { get; set; }
    = new();

}
