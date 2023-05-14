using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nova_DMS.Models;

public class RefreshToken
{
    public Guid Token { get; set; } = Guid.NewGuid();
    public DateTime Expires { get; set; } = DateTime.Now.AddDays(7);
}
