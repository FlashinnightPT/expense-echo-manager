
using System;

namespace GFIN.API.Models
{
    public class Category
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string ParentId { get; set; }
        public int Level { get; set; }
        public bool IsFixedExpense { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
