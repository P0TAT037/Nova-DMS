using Microsoft.AspNetCore.Mvc;

namespace Nova_DMS.Models.DTOs;

public class NodeDataDTO
{
    public string Dir { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string Type { get; set; } = null!;

    public string? Content { get; set; }

    public bool? DefaultPerm { get; set; }
}
