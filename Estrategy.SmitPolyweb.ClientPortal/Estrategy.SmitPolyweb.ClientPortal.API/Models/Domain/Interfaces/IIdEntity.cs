namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces
{
    public interface IIdEntity
    {
        public int ID { get; set; }



        public int CreatedBy { get; set; }

        public DateTime CreationDate { get; set; }

        public int ModifiedBy { get; set; }

        public DateTime LastModified { get; set; }
    }
}
