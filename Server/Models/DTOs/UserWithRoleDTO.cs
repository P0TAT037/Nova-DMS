using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nova_DMS.Models.DTOs;

public class UserWithRoleDTO : User
{
        public int RoleId { get; set; }
}
