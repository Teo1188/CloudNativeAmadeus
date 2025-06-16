using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Services;
using NSubstitute;
using Xunit;

namespace ExtraHours.Test
{
    public class ExtraHourServiceTests
    {
        private readonly IExtraHourRepository _extraHourRepository;
        private readonly ExtraHourService _extraHourService;

        public ExtraHourServiceTests()
        {
            _extraHourRepository = Substitute.For<IExtraHourRepository>();
            _extraHourService = new ExtraHourService(_extraHourRepository);
        }

        [Fact]
        public async Task CreateExtraHour_SetsStatusToPendiente_AndCallsRepository()
        {
            // Arrange
            var extraHour = new ExtraHour
            {
                Id = 1,
                UserId = 1,
                Date = DateTime.UtcNow,
                StartTime = TimeSpan.FromHours(18),
                EndTime = TimeSpan.FromHours(20),
                ExtraHourTypeId = 1,
                Status = "Otro"
            };

            // Act
            var result = await _extraHourService.CreateExtraHour(extraHour);

            // Assert
            Assert.Equal("Pendiente", result.Status);
            await _extraHourRepository.Received(1).AddAsync(extraHour);
        }
    }
}