using Microsoft.Data.Sqlite;

var dbPath = Path.GetFullPath(
    Path.Combine(
        "src",
        "PCS.API",
        "pcs.db"));

Console.WriteLine($"Database: {dbPath}");
Console.WriteLine();

if (!File.Exists(dbPath))
{
    Console.WriteLine("DATABASE NOT FOUND.");
    return;
}

using var connection =
    new SqliteConnection($"Data Source={dbPath}");

connection.Open();

using var transaction =
    connection.BeginTransaction();

try
{
    using var command =
        connection.CreateCommand();

    command.Transaction = transaction;

    command.CommandText = """
    UPDATE Roles
    SET
        Code = 'SUPER_ADMIN',
        Scope = 'Platform',
        IsSystemRole = 1
    WHERE Name = 'SuperAdmin';

    UPDATE Roles
    SET
        Code = 'COMPANY_ADMIN',
        Scope = 'Company',
        IsSystemRole = 1
    WHERE Name = 'CompanyAdmin';

    UPDATE Roles
    SET
        Code = 'PROJECT_MANAGER',
        Scope = 'Project',
        IsSystemRole = 1
    WHERE Name = 'ProjectManager';

    UPDATE Roles
    SET
        Code = 'COST_CONTROLLER',
        Scope = 'Project',
        IsSystemRole = 1
    WHERE Name = 'CostController';

    UPDATE Roles
    SET
        Code = 'DOCUMENT_MANAGER',
        Scope = 'Company',
        IsSystemRole = 1
    WHERE Name = 'DocumentManager';

    UPDATE Roles
    SET
        Code = 'VIEWER',
        Scope = 'Company',
        IsSystemRole = 1
    WHERE Name = 'Viewer';
    """;

    var affected =
        command.ExecuteNonQuery();

    transaction.Commit();

    Console.WriteLine(
        $"Rows affected: {affected}");

    Console.WriteLine(
        "ROLE DATA FIX COMPLETED.");
}
catch (Exception ex)
{
    transaction.Rollback();

    Console.WriteLine(
        "ROLE DATA FIX FAILED.");

    Console.WriteLine(
        ex.Message);

    return;
}
