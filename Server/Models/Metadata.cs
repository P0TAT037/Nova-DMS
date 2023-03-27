namespace Nova_DMS.Models;

public class Metadata
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string? Description { get; set; }

    public string? Content { get; set; }

    public string Author { get; set; } = null!;

    public DateTime Created { get; set; }

    public DateTime Updated { get; set; }

    public string? EditedBy { get; set; }

    public int Version { get; set; }
}
