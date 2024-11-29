using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleTypePropertyController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IArticleTypePropertyRepository articleTypePropertyRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();


        public ArticleTypePropertyController(IMapper mapper, IArticleTypePropertyRepository articleTypePropertyRepository)
        {
            this.mapper = mapper;
            this.articleTypePropertyRepository = articleTypePropertyRepository;

        }

        /// <summary>
        /// Searches for all the ArticleTypePropertys inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/ArticleTypeProperty/
        /// </summary>
        /// <returns>An OK 200 with all the ArticleTypePropertys found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetAllAsync()
        {
            Logger.Info("Grabbing all ArticleTypePropertys from the Database");

            List<ArticleTypeProperty> articleTypePropertiesDomainModel = await articleTypePropertyRepository.GetAllAsync();

            Logger.Info("Found ArticleTypePropertys: {}", JsonSerializer.Serialize(articleTypePropertiesDomainModel));

            return Ok(mapper.Map<List<ArticleTypePropertyDto>>(articleTypePropertiesDomainModel));
        }

        /// <summary>
        /// Search for a specific ArticleTypeProperty in the database, this endpoint is accesible through:<br/>
        /// GET: api/ArticleTypeProperty/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the ArticleTypeProperty it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for article: {}", ID);

            ArticleTypeProperty? articleTypePropertyDomainModel = await articleTypePropertyRepository.GetByIDAsync(ID);

            if (articleTypePropertyDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found ArticleTypeProperty: {}", JsonSerializer.Serialize(articleTypePropertyDomainModel));

            return Ok(mapper.Map<ArticleTypePropertyDto>(articleTypePropertyDomainModel));
        }

        /// <summary>
        /// Creates a new ArticleTypeProperty in the Database, this endpoint is accesible through:<br/>
        /// POST: api/ArticleTypeProperty
        /// </summary>
        /// <remarks>
        /// The data used to create the ArticleTypeProperty is located in the Body of the request
        /// </remarks>
        /// <param name="addArticleTypePropertyRequestDto">Info with which to create a new ArticleTypeProperty in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(CreateAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> CreateAsync([FromBody] ArticleTypePropertyDto addArticleTypePropertyRequestDto)
        {
            ArticleTypeProperty? articleTypePropertyDomainModel = mapper.Map<ArticleTypeProperty>(addArticleTypePropertyRequestDto);

            articleTypePropertyDomainModel = await articleTypePropertyRepository.CreateAsync(articleTypePropertyDomainModel);

            ArticleTypePropertyDto articleTypePropertyDto = mapper.Map<ArticleTypePropertyDto>(articleTypePropertyDomainModel);
            return CreatedAtAction(nameof(CreateAsync), new { id = articleTypePropertyDto.ID }, articleTypePropertyDto);
        }

        /// <summary>
        /// Updates the ArticleTypeProperty that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/ArticleTypeProperty/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the ArticleTypeProperty is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the ArticleTypeProperty you want to update</param>
        /// <param name="updateArticleTypePropertyRequestDto">The updated information for the ArticleTypeProperty</param>
        /// <returns>A OK 200 with the Updated ArticleTypeProperty</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> UpdateAsync([FromRoute] int ID, [FromBody] ArticleTypePropertyDto updateArticleTypePropertyRequestDto)
        {

            ArticleTypeProperty? articleTypePropertyDomainModel = mapper.Map<ArticleTypeProperty>(updateArticleTypePropertyRequestDto);
            if (articleTypePropertyDomainModel == null)
            {
                return BadRequest();
            }

            articleTypePropertyDomainModel = await articleTypePropertyRepository.UpdateAsync(ID, articleTypePropertyDomainModel);


            return Ok(mapper.Map<ArticleTypePropertyDto>(articleTypePropertyDomainModel));
        }

        /// <summary>
        /// Delete the ArticleTypeProperty that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/ArticleTypeProperty/{ID}
        /// </summary>
        /// <param name="ID">The ID of the ArticleTypeProperty you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted ArticleTypeProperty</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> DeleteAsync([FromRoute] int ID)
        {

            ArticleTypeProperty? articleTypePropertyDomainModel = await articleTypePropertyRepository.DeleteAsync(ID);
            if (articleTypePropertyDomainModel == null)
            {
                return NotFound();
            }


            return Ok(mapper.Map<ArticleTypePropertyDto>(articleTypePropertyDomainModel));
        }

        [HttpPost]
        [ValidateModel]
        [Route("GetArticleTypePropertyByIDs")]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> GetArticleTypePropertyByIDs([FromBody] ArticleTypePropertyFilterDto articleTypePropertyIDs)
        {
            List<ArticleTypeProperty?> articleTypeProperties = await articleTypePropertyRepository.GetArticleTypePropertyByIDs(articleTypePropertyIDs);

            return Ok(mapper.Map<ArticleTypePropertyDto>(articleTypeProperties[0]));
        }

    }
}
