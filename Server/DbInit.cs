using Dapper;
using Microsoft.Data.SqlClient;

public static class DbInitializer{
    public static async Task InitDb(string connstr, string scriptPath){
        string script = File.ReadAllText(scriptPath);

        using(var conn = new SqlConnection(connstr)){
            await conn.ExecuteAsync(script);
        }
    }
}


