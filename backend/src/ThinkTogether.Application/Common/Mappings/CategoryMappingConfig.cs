using Mapster;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.CategoryAggregate;

namespace ThinkTogether.Application.Common.Mappings;

public class CategoryMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // Category to DTO
        config.NewConfig<Category, CategoryDto>();
    }
}

