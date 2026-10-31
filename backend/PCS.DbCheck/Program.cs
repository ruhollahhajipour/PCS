using Microsoft.Data.Sqlite;

var dbPath = Path.GetFullPath(
    Path.Combine(
        "src",
        "PCS.API",
        "pcs.db"));

using var connection =
    new SqliteConnection($"Data Source={dbPath}");

connection.Open();

using var command = connection.CreateCommand();

command.CommandText = """
SELECT
    name,
    sql
FROM sqlite_master
WHERE type = 'index'
  AND tbl_name = 'Users'
ORDER BY name;
""";

using var reader = command.ExecuteReader();

Console.WriteLine("=== USERS INDEXES ===");

while (reader.Read())
{
    Console.WriteLine($"Index: {reader["name"]}");
    Console.WriteLine($"SQL:   {reader["sql"]}");
    Console.WriteLine();
}
