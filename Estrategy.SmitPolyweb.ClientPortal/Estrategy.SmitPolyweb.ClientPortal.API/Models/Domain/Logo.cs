using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Logo : IIdEntity
    {
        #region properties

        public int ID { get; set; }
        [NotMapped]
        public IFormFile File { get; set; }
        public string FileName { get; set; }
        public string? FileDescription { get; set; }
        public string? FileExtension { get; set; }
        public long FileSizeInBytes { get; set; }
        public string? FilePath { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Logo(IFormFile file, string fileName, long fileSizeInBytes)
        {
            File = file;
            FileName = fileName;
            FileSizeInBytes = fileSizeInBytes;
        }

        /// <summary>
        /// Entity framework core specific constructor as "It CaNnOt SeT nAvIgAtIoNaL pRoPpErTiEs"
        /// </summary>
        private Logo(string fileName, long fileSizeInBytes)
        {
            FileName = fileName;
            FileSizeInBytes = fileSizeInBytes;
        }

        #endregion constructors
    }
}
