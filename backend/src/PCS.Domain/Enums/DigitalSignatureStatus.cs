namespace PCS.Domain.Enums;

public enum DigitalSignatureStatus
{
    /// <summary>
    /// امضا معتبر و قابل استناد است
    /// </summary>
    Valid = 0,


    /// <summary>
    /// امضا توسط سیستم یا Super Admin باطل شده است
    /// </summary>
    Revoked = 1,


    /// <summary>
    /// اعتبار زمانی امضا تمام شده است
    /// </summary>
    Expired = 2,


    /// <summary>
    /// امضا در بررسی صحت نامعتبر تشخیص داده شده است
    /// </summary>
    Invalid = 3
}