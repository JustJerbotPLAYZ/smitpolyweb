using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Checklist : IIdEntity
    {
        #region properties
        public int ID { get; set; }
        public string Name { get; set; }
        public List<int> ChecklistFieldIDs { get; set; }
        public List<int> ChecklistPropertyIDs { get; set; }

        // Navigational Properties
        public List<ChecklistField>? Fields { get; set; }
        public List<Property>? Properties { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Checklist(string name, List<int> checklistFieldIDs, List<int> checklistPropertyIDs)
        {
            Name = name;
            ChecklistFieldIDs = checklistFieldIDs;
            ChecklistPropertyIDs = checklistPropertyIDs;
        }

        #endregion constructors
    }
}
