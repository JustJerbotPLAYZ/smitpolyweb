using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class ChecklistField : IIdEntity
    {
        #region properties
        public int ID { get; set; }
        public string Name { get; set; }
        public bool Checked { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public ChecklistField(string name, bool Checked)
        {
            Name = name;
            this.Checked = Checked;
        }

        #endregion constructors
    }
}
