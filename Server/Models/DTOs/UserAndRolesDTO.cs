using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nova_DMS.Models.DTOs;

public class UserAndRolesDTO
{
    public User User { get; set; } = null!;
    public IEnumerable<dynamic> Roles { get; set; } = new List<dynamic>();
}
