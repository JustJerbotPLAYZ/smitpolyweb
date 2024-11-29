namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations
{
    /// <summary>
    /// Permissions to allow people to read/write certain things. <br/>
    /// If you wish to implement permissions in a controller, please use: <br/>
    /// [Authorize(Roles = nameof(Permission.PermissionName))]
    /// </summary>
    public enum Permission
    {
        // Please keep this file in alphabetical order so it's easier to find and add permissions

        AddressRead,
        AddressWrite,

        ArticleRead,
        ArticleWrite,

        CertificateRead,
        CertificateWrite,

        ChecklistRead,
        ChecklistWrite,

        CustomerRead,
        CustomerWrite,

        PropertyRead,
        PropertyWrite,

        RoleRead,
        RoleWrite,

        SupplierRead,
        SupplierWrite,

        TicketRead,
        TicketWrite,

        ImageUpload,

        UserRead,
        UserWrite,

        UpdatePassword


    }
}
