using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Property : IIdEntity
    {
        #region properties

        public int ID { get; set; }
        public string Name { get; set; }
        public string EnglishName { get; set; }
        public string PropertyName { get; set; }
        public int FieldType { get; set; }
        public List<PropertyChoise> PropertyChoises { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Property(string propertyName, string name, string englishName, int fieldType)
        {
            PropertyName = propertyName;
            Name = name;
            EnglishName = englishName;
            FieldType = fieldType;
        }

        #endregion constructors
    }
}
