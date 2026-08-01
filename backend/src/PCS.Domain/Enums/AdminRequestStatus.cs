namespace PCS.Domain.Enums;

public enum AdminRequestStatus
{
    /// <summary>
    /// درخواست ثبت شده و منتظر بررسی است
    /// </summary>
    Pending = 0,


    /// <summary>
    /// درخواست توسط Super Admin تایید شده است
    /// </summary>
    Approved = 1,


    /// <summary>
    /// درخواست رد شده است
    /// </summary>
    Rejected = 2,


    /// <summary>
    /// درخواست لغو شده است
    /// </summary>
    Cancelled = 3,


    /// <summary>
    /// درخواست نیاز به اصلاح مدارک دارد
    /// </summary>
    NeedRevision = 4
}