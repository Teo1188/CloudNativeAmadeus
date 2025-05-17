using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.Core.Models
{
    public class Approval
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ExtraHourId { get; set; }

        [ForeignKey("ExtraHourId")]
        public ExtraHour ExtraHour { get; set; } = null!;

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!; 

        [Required]
        public string Status { get; set; } = "Pendiente";

        public string? Annotations { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}