using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Role, RoleDto>().ReverseMap();

            CreateMap<Logo, LogoDto>().ReverseMap();

            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Address, AddressDto>().ReverseMap();

            CreateMap<Customer, CustomerDto>().ReverseMap();

            CreateMap<Ticket, TicketDto>().ReverseMap();

            CreateMap<Certificate, CertificateDto>().ReverseMap();

            CreateMap<CertificateType, CertificateTypeDto>().ReverseMap();

            CreateMap<Article, ArticleDto>().ReverseMap();

            CreateMap<ArticleType, ArticleTypeDto>().ReverseMap();

            CreateMap<Supplier, SupplierDto>().ReverseMap();

            CreateMap<Checklist, ChecklistDto>().ReverseMap();

            CreateMap<Property, PropertyDto>().ReverseMap();

            CreateMap<Property, List<PropertyDto>>().ReverseMap();

            CreateMap<ChecklistField, ChecklistFieldDto>().ReverseMap();

            CreateMap<PasswordHistory, PasswordHistoryDto>().ReverseMap();

            CreateMap<ArticleTypeProperty, ArticleTypePropertyDto>().ReverseMap();

            CreateMap<PropertyChoise, PropertyChoiseDto>().ReverseMap();

            CreateMap<ArticleTypeProperty, ArticleTypePropertyDto>().ReverseMap();

            CreateMap<CertificateProperty, CertificatePropertyDto>().ReverseMap();

            CreateMap<CertificateTicket, CertificateTicketDto>().ReverseMap();
        }
    }
}
