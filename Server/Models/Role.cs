using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nova_DMS.Models;

public class Role
{
    public int Id { get; set; }
    
    public string Name { get; set; } = null!;

    public IEnumerable<User> users { get; set; } = null!;
}
