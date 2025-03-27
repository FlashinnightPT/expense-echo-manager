
using System;

namespace GFIN.API.Models
{
    public class Transaction
    {
        public string Id { get; set; }
        public string Date { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public string Type { get; set; }
    }
}
