using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.Infrastructure.Services
{
    public class ExtraHourTypeService : IExtraHourTypeService
    {
        private readonly IExtraHourTypeRepository _extraHourTypeRepository;

        public ExtraHourTypeService(IExtraHourTypeRepository extraHourTypeRepository)
        {
            _extraHourTypeRepository = extraHourTypeRepository;
        }

        public async Task<IEnumerable<ExtraHourType>> GetAllTypes()
        {
            return await _extraHourTypeRepository.GetAllAsync();
        }

        public async Task<ExtraHourType> GetTypeById(int id)
        {
            return await _extraHourTypeRepository.GetByIdAsync(id);
        }

        public async Task<ExtraHourType> CreateType(ExtraHourType extraHourType)
        {
            // Validar si ya existe un tipo con el mismo nombre
            var existingType = await _extraHourTypeRepository.GetByNameAsync(extraHourType.Name);
            if (existingType != null)
                throw new System.Exception("Ya existe un tipo de hora extra con este nombre");

            await _extraHourTypeRepository.AddAsync(extraHourType);
            return extraHourType;
        }

        public async Task<ExtraHourType> UpdateType(int id, ExtraHourType updatedType)
        {
            var existingType = await _extraHourTypeRepository.GetByIdAsync(id);
            if (existingType == null)
                throw new System.Exception("Tipo de hora extra no encontrado");

            existingType.Name = updatedType.Name;
            await _extraHourTypeRepository.UpdateAsync(existingType);
            return existingType;
        }

        public async Task<bool> DeleteType(int id)
        {
            var existingType = await _extraHourTypeRepository.GetByIdAsync(id);
            if (existingType == null)
                return false;

            await _extraHourTypeRepository.DeleteAsync(id);
            return true;
        }
    }
}