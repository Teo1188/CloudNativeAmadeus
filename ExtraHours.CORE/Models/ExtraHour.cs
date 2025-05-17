using System;

namespace ExtraHours.Core.Models
{
    public class ExtraHour
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int ExtraHourTypeId { get; set; }
        public int? ApprovedById { get; set; }
        public required string Status { get; set; } // "Pendiente", "Aprobado", "Rechazado"
        public string? Reason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Propiedades de navegación CORRECTAS:
        public User? User { get; set; }          // Usuario que registra
        public ExtraHourType? ExtraHourType { get; set; } // Tipo de hora extra
        public User? ApprovedBy { get; set; }    // Usuario que aprueba
    }
}