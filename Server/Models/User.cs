using System.Reflection.Metadata.Ecma335;

namespace Nova_DMS.Models;

public class User
{
    public int Id { get; set; }
    
    public string Username { get; set; } = null!;

    public string? Name { get; set; }
    
    public int Level { get; set; }

}