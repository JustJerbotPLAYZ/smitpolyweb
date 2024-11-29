using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class RoleDto
    {
        public int ID { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public List<Permission>? Permissions { get; set; }

    }
}
