namespace Nova_DMS.Models.DTOs;

public class UserDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int Level { get; set; }
    public string Password { get; set; } = null!;
}
