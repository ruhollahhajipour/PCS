using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using PCS.Application.Common.Interfaces;
using PCS.Domain.Entities;

namespace PCS.Infrastructure.Persistence;

/// <summary>
/// Turns pending EF Core changes into <see cref="AuditLog"/> rows that are
/// saved in the same transaction as the change itself.
///
/// Rules:
///  - only an allow-list of business entities is audited;
///  - properties that look like secrets (password, hash, token, ...) are never
///    written, and an entry whose only changes are such properties is skipped;
///  - bookkeeping columns (UpdatedAt, LastLoginAt, ...) do not count as changes;
///  - more than <see cref="BulkThreshold"/> rows of one type and action in a
///    single save (imports, seeding) become one summary row.
/// </summary>
internal static class AuditTrailBuilder
{
    private const int BulkThreshold = 25;
    private const int MaxValueLength = 500;
    private const int MaxJsonLength = 4000;

    private static readonly HashSet<string> AuditedEntities =
        new(StringComparer.Ordinal)
        {
            "Company", "Plant", "Project",
            "User", "Role", "RolePermission", "UserRole", "CompanyUser", "CompanyAdminRequest",
            "License", "LicenseModule",
            "WbsNode", "Activity", "ActivityRelationship",
            "ProjectBaseline", "ProjectCalendar", "ProgressEntry",
            "Document", "DocumentFolder", "DocumentVersion",
            "CostItem"
        };

    private static readonly HashSet<string> IgnoredProperties =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy",
            "DeletedAt", "DeletedBy", "LastLoginAt", "RowVersion", "ConcurrencyStamp"
        };

    private static readonly string[] SensitiveFragments =
    {
        "password", "hash", "secret", "token", "salt", "securitystamp", "privatekey"
    };

    public static List<AuditLog> Build(
        IReadOnlyCollection<EntityEntry> entries,
        ICurrentTenant? tenant,
        IAuditContext? context)
    {
        var candidates = new List<(EntityEntry Entry, string EntityName, string Action)>();

        foreach (EntityEntry entry in entries)
        {
            if (entry.State != EntityState.Added &&
                entry.State != EntityState.Modified &&
                entry.State != EntityState.Deleted)
            {
                continue;
            }

            string entityName = entry.Metadata.ClrType.Name;

            if (!AuditedEntities.Contains(entityName))
            {
                continue;
            }

            candidates.Add((entry, entityName, ResolveAction(entry)));
        }

        var rows = new List<AuditLog>();

        foreach (var group in candidates.GroupBy(x => (x.EntityName, x.Action)))
        {
            var items = group.ToList();

            if (items.Count > BulkThreshold)
            {
                rows.Add(CreateRow(
                    tenant,
                    context,
                    group.Key.EntityName,
                    entityId: $"bulk:{items.Count}",
                    action: group.Key.Action,
                    companyId: tenant?.CompanyId,
                    oldValues: null,
                    newValues: JsonSerializer.Serialize(new { count = items.Count })));

                continue;
            }

            foreach (var item in items)
            {
                AuditLog? row = BuildEntryRow(
                    item.Entry,
                    item.EntityName,
                    item.Action,
                    tenant,
                    context);

                if (row is not null)
                {
                    rows.Add(row);
                }
            }
        }

        return rows;
    }

    private static string ResolveAction(EntityEntry entry)
    {
        if (entry.State == EntityState.Added)
        {
            return "Create";
        }

        if (entry.State == EntityState.Deleted)
        {
            return "Delete";
        }

        PropertyEntry? isDeleted = entry.Properties.FirstOrDefault(
            p => p.Metadata.Name == "IsDeleted");

        if (isDeleted is { IsModified: true } &&
            isDeleted.OriginalValue is bool before &&
            isDeleted.CurrentValue is bool after &&
            before != after)
        {
            return after ? "Delete" : "Restore";
        }

        return "Update";
    }

    private static AuditLog? BuildEntryRow(
        EntityEntry entry,
        string entityName,
        string action,
        ICurrentTenant? tenant,
        IAuditContext? context)
    {
        var oldValues = new Dictionary<string, object?>();
        var newValues = new Dictionary<string, object?>();

        foreach (PropertyEntry property in entry.Properties)
        {
            string name = property.Metadata.Name;

            if (IsIgnored(name))
            {
                continue;
            }

            if (entry.State == EntityState.Added)
            {
                if (property.CurrentValue is not null)
                {
                    newValues[name] = Sanitize(property.CurrentValue);
                }
            }
            else if (entry.State == EntityState.Deleted)
            {
                if (property.OriginalValue is not null)
                {
                    oldValues[name] = Sanitize(property.OriginalValue);
                }
            }
            else if (property.IsModified &&
                     !Equals(property.OriginalValue, property.CurrentValue))
            {
                oldValues[name] = Sanitize(property.OriginalValue);
                newValues[name] = Sanitize(property.CurrentValue);
            }
        }

        // An update whose only changes were secrets or bookkeeping columns is
        // not an auditable data change (password changes have an explicit event).
        if (entry.State == EntityState.Modified &&
            action == "Update" &&
            newValues.Count == 0)
        {
            return null;
        }

        string entityId = string.Join(
            "|",
            entry.Properties
                .Where(p => p.Metadata.IsPrimaryKey())
                .Select(p => (p.CurrentValue ?? p.OriginalValue)?.ToString() ?? string.Empty));

        Guid? companyId = ResolveCompanyId(entry, entityName, tenant);

        return CreateRow(
            tenant,
            context,
            entityName,
            entityId,
            action,
            companyId,
            oldValues.Count == 0 ? null : ToJson(oldValues),
            newValues.Count == 0 ? null : ToJson(newValues));
    }

    private static Guid? ResolveCompanyId(
        EntityEntry entry,
        string entityName,
        ICurrentTenant? tenant)
    {
        if (entityName == "Company")
        {
            PropertyEntry? id = entry.Properties.FirstOrDefault(
                p => p.Metadata.Name == "Id");

            if (id?.CurrentValue is Guid companyEntityId)
            {
                return companyEntityId;
            }
        }

        PropertyEntry? companyProperty = entry.Properties.FirstOrDefault(
            p => p.Metadata.Name == "CompanyId");

        if (companyProperty?.CurrentValue is Guid ownerCompanyId &&
            ownerCompanyId != Guid.Empty)
        {
            return ownerCompanyId;
        }

        return tenant?.CompanyId;
    }

    private static AuditLog CreateRow(
        ICurrentTenant? tenant,
        IAuditContext? context,
        string entityName,
        string entityId,
        string action,
        Guid? companyId,
        string? oldValues,
        string? newValues)
    {
        return new AuditLog
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UserId = tenant?.UserId,
            Username = string.IsNullOrWhiteSpace(context?.Username)
                ? "system"
                : context!.Username!,
            CompanyId = companyId,
            Module = ModuleOf(entityName),
            Entity = entityName,
            EntityId = entityId,
            Action = action,
            OldValues = oldValues,
            NewValues = newValues,
            IpAddress = context?.IpAddress,
            UserAgent = context?.UserAgent,
            CorrelationId = context?.CorrelationId
        };
    }

    private static string ModuleOf(string entityName) =>
        entityName switch
        {
            "User" or "Role" or "RolePermission" or "UserRole"
                or "CompanyUser" or "CompanyAdminRequest" => "Security",
            "License" or "LicenseModule" => "Licensing",
            "WbsNode" or "Activity" or "ActivityRelationship" or "ProjectBaseline"
                or "ProjectCalendar" or "ProgressEntry" => "Planning",
            "Document" or "DocumentFolder" or "DocumentVersion" => "Documents",
            "CostItem" => "Cost",
            "Project" => "Projects",
            _ => "MasterData"
        };

    private static bool IsIgnored(string propertyName)
    {
        if (IgnoredProperties.Contains(propertyName))
        {
            return true;
        }

        foreach (string fragment in SensitiveFragments)
        {
            if (propertyName.Contains(fragment, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    private static object? Sanitize(object? value)
    {
        return value switch
        {
            null => null,
            byte[] => "[binary]",
            string text when text.Length > MaxValueLength => text[..MaxValueLength] + "...",
            _ => value
        };
    }

    private static string ToJson(Dictionary<string, object?> values)
    {
        string json = JsonSerializer.Serialize(values);

        return json.Length <= MaxJsonLength
            ? json
            : JsonSerializer.Serialize(new { truncated = true, properties = values.Count });
    }
}
