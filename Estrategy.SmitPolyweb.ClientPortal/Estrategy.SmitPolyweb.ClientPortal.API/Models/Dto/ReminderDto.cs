namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class ReminderDto
    {
        public string? DebtorNumber { get; set; }
        public DateTime? StartSearchDate { get; set; }
        public DateTime? EndSearchDate { get; set; }
        public bool ThisMonth { get; set; }
        public bool NextMonth { get; set; }
        public bool LastMonth { get; set; }
    }
}