namespace PCS.Domain.Enums;

public enum CompanyAdminRequestStatus
{
    // درخواست ثبت شده و منتظر بررسی Super Admin است
    Pending = 0,


    // در حال بررسی مدارک و اعتبارسنجی
    UnderReview = 1,


    // تایید شده و تغییر ادمین انجام شده است
    Approved = 2,


    // رد شده توسط Super Admin
    Rejected = 3,


    // لغو شده توسط درخواست کننده
    Cancelled = 4
}