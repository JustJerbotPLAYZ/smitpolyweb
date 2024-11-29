using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories;
using Estrategy.SmitPolyweb.ClientPortal.API.Services;
using Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleTypeController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IArticleTypeRepository articleTypeRepository;
        private readonly IArticleTypeService articleTypeService;
        private readonly IPropertyRepository propertyRepository;
        private readonly IPropertyChoiseRepository propertyChoiseRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();


        public ArticleTypeController(IMapper mapper, IArticleTypeRepository articleTypeRepository, IArticleTypeService articleTypeService, IPropertyRepository propertyRepository, IPropertyChoiseRepository propertyChoiseRepository)
        {
            this.mapper = mapper;
            this.articleTypeRepository = articleTypeRepository;
            this.articleTypeService = articleTypeService;
            this.propertyRepository = propertyRepository;
            this.propertyChoiseRepository = propertyChoiseRepository;
        }

        /// <summary>
        /// Searches for all the Articles inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Article/
        /// </summary>
        /// <returns>An OK 200 with all the Articles found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.ArticleRead))]
        public async Task<IActionResult> GetAllArticleTypesAsync()
        {
            List<ArticleType> articleTypeDomainModel = await articleTypeRepository.GetAllAsync();

            //converting Domain to Dto
            return Ok(mapper.Map<List<ArticleTypeDto>>(articleTypeDomainModel));
        }

        /// <summary>
        /// Search for a specific Article in the database, this endpoint is accesible through:<br/>
        /// GET: api/Article/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Article it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.ArticleRead))]
        public async Task<IActionResult> GetArticleTypeByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for article: {}", ID);
            //Getting data
            ArticleType? articleTypeDomainModel = await articleTypeRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (articleTypeDomainModel == null)
            {
                return NotFound();
            }


            //Converting Domain to Dto
            return Ok(mapper.Map<ArticleTypeDto>(articleTypeDomainModel));


        }

        /// <summary>
        /// Creates a new Article in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Article
        /// </summary>
        /// <remarks>
        /// The data used to create the Article is located in the Body of the request
        /// </remarks>
        /// <param name="addArticleRequestDto">Info with which to create a new Article in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetArticleTypeByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.ArticleWrite))]
        public async Task<IActionResult> CreateArticleTypeAsync([FromBody] ArticleTypeDto addArticleTypeRequestDto)
        {

            Logger.Info("Attempting to add {} to the database", addArticleTypeRequestDto.Name);

            //Convert Dto to domain
            ArticleType? articleTypeDomainModel = mapper.Map<ArticleType>(addArticleTypeRequestDto);

            //Create role
            articleTypeDomainModel = await articleTypeRepository.CreateAsync(articleTypeDomainModel);

            Logger.Info("Article added succesfully");

            //Map Domain to Dto
            ArticleTypeDto articleTypeDto = mapper.Map<ArticleTypeDto>(articleTypeDomainModel);
            return CreatedAtAction(nameof(GetArticleTypeByIDAsync), new { id = articleTypeDto.ID }, articleTypeDto);
        }

        /// <summary>
        /// Updates the Article that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Article/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Article is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Article you want to update</param>
        /// <param name="updateArticleRequestDto">The updated information for the Article</param>
        /// <returns>A OK 200 with the Updated Article</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.ArticleWrite))]
        public async Task<IActionResult> UpdateArticleTypeByIDAsync([FromRoute] int ID, [FromBody] ArticleTypeDto updateArticleTypeRequestDto)
        {

            //Convert Dto to Domain
            ArticleType? articleTypeDomainModel = mapper.Map<ArticleType>(updateArticleTypeRequestDto);
            if (articleTypeDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            articleTypeDomainModel = await articleTypeRepository.UpdateAsync(ID, articleTypeDomainModel);


            //convert Domain to Dto
            return Ok(mapper.Map<ArticleTypeDto>(articleTypeDomainModel));
        }

        /// <summary>
        /// Delete the Article that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Article/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Article you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Article</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.ArticleWrite))]
        public async Task<IActionResult> DeleteArticleTypeByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Article with ID: {}", ID);

            //Deleting ArticleType
            ArticleType? articleTypeDomainModel = await articleTypeRepository.DeleteAsync(ID);
            if (articleTypeDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Article: {}", JsonSerializer.Serialize(articleTypeDomainModel));

            return Ok(mapper.Map<ArticleTypeDto>(articleTypeDomainModel));
        }

        [HttpGet]
        [Route("GetArticleTypePropertyByArticleTypeID/{ID:int}")]
        [Authorize(Roles = nameof(Permission.ArticleRead))]
        public async Task<IActionResult> GetArticleTypePropertyByArticleTypeID([FromRoute] int ID)
        {
            ArticleType? articleType = await articleTypeRepository.GetByIDAsync(ID);
            List<ArticleTypeProperty?> articleTypeDomainModel = await articleTypeService.GetArticleTypePropertyByArticleTypeID(articleType);
            if (articleTypeDomainModel == null)
            {
                return Ok();
            }
            return Ok(mapper.Map<List<ArticleTypePropertyDto>>(articleTypeDomainModel));
        }


        [HttpGet]
        [Route("GetAllArticleTypePropertyData/{ID:int}")]
        [Authorize(Roles = nameof(Permission.ArticleRead))]
        public async Task<IActionResult> GetAllArticleTypePropertyData([FromRoute] int ID)
        {

            List<Property?> propertyList = new();
            List<ArticleTypeProperty?> articleTypePropertyList = new();
            List<PropertyChoise?> propertyChoises = new();

            ArticleType articleType = await articleTypeRepository.GetByIDAsync(ID);
            //Getting data
            List<ArticleTypeProperty?> articleTypePropertiesList = await articleTypeService.GetArticleTypePropertyByArticleTypeID(articleType);

            articleTypePropertyList.AddRange(articleTypePropertiesList);

            for (int i = articleTypePropertiesList.Count() - 1; i >= 0; i--)
            {

                Property? tempProp = await propertyRepository.GetByIDAsync(articleTypePropertiesList[i].PropertyID);
                propertyList.Add(tempProp);

                if (tempProp.FieldType == 3)
                {
                    List<PropertyChoise> propertyChoisesList = await propertyChoiseRepository.GetPropertyChoisesByPropertyID(tempProp);
                    propertyChoises.AddRange(propertyChoisesList);
                }


            }

            //Converting Domain to Dto
            List<PropertyDto> propertyListDto = mapper.Map<List<PropertyDto>>(propertyList);
            List<ArticleTypePropertyDto> articleTypePropertyListDto = mapper.Map<List<ArticleTypePropertyDto>>(articleTypePropertyList);
            List<PropertyChoiseDto> propertyChoiseListDto = mapper.Map<List<PropertyChoiseDto>>(propertyChoises);

            return Ok(new { propertyListDto, articleTypePropertyListDto, propertyChoiseListDto });
        }

    }
}


