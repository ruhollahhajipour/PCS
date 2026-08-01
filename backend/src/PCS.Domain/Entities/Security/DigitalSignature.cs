using PCS.Domain.Common;
using PCS.Domain.Enums;

namespace PCS.Domain.Entities.Security;

public class DigitalSignature : AuditableEntity
{
    // ==========================
    // Signer
    // ==========================

    /// <summary>
    /// کاربری که امضا را انجام داده
    /// </summary>
    public Guid UserId { get; set; }



    // ==========================
    // Signed Entity
    // ==========================

    /// <summary>
    /// نوع موجودیت امضا شده
    /// مثال:
    /// CompanyAdminRequest
    /// DocumentApproval
    /// Contract
    /// </summary>
    public string EntityType { get; set; }
        = string.Empty;


    /// <summary>
    /// شناسه رکورد امضا شده
    /// </summary>
    public Guid EntityId { get; set; }



    // ==========================
    // Cryptographic Information
    // ==========================

    /// <summary>
    /// Hash محتوای امضا شده
    /// </summary>
    public string SignedContentHash { get; set; }
        = string.Empty;


    /// <summary>
    /// الگوریتم Hash
    /// </summary>
    public string HashAlgorithm { get; set; }
        = "SHA256";



    /// <summary>
    /// اطلاعات Certificate یا CA
    /// در نسخه Enterprise استفاده می‌شود
    /// </summary>
    public string? CertificateInfo { get; set; }



    // ==========================
    // Signature Tracking
    // ==========================

    /// <summary>
    /// شناسه یکتا برای رهگیری حقوقی
    /// </summary>
    public string SignatureReference { get; set; }
        = Guid.NewGuid().ToString();


    /// <summary>
    /// زمان انجام امضا
    /// </summary>
    public DateTime SignedAt { get; set; }
        = DateTime.UtcNow;



    /// <summary>
    /// وضعیت اعتبار امضا
    /// </summary>
    public DigitalSignatureStatus Status { get; set; }
        = DigitalSignatureStatus.Valid;



    /// <summary>
    /// دلیل ابطال یا تغییر وضعیت
    /// </summary>
    public string? StatusReason { get; set; }



    // ==========================
    // Security Information
    // ==========================

    public string? IpAddress { get; set; }


    public string? DeviceInfo { get; set; }


    public string? LocationInfo { get; set; }



    // ==========================
    // Navigation
    // ==========================

    public User User { get; set; }
        = null!;
}