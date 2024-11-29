using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class PaginationRequest<T> where T : IIdEntity
    {
        public List<T>? Entities { get; set; }
        public int? TotalRecords { get; set; }


        public PaginationRequest(List<T> entities, int totalRecords)
        {
            Entities = entities;
            TotalRecords = totalRecords;
        }
    }
}
