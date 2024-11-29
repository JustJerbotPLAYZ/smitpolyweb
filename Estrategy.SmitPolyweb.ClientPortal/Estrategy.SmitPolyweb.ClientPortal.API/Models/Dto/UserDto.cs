using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class UserDto
    {
        public int ID { get; set; }
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string? Password { get; set; }
        public PasswordHashType? PasswordHashType { get; set; }
        [Required]
        public string? FirstName { get; set; }
        public string? Infix { get; set; }
        [Required]
        public string? LastName { get; set; }
        [Required]
        public int RoleID { get; set; }
        public int? RefreshTokenID { get; set; }

        public int? CustomerID { get; set; }

        public bool AccountActive { get; set; }
        public bool AccountBlocked { get; set; }

        public RoleDto? Role { get; set; }
        public CustomerDto? Customer { get; set; }
    }
}
