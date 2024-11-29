using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IArticleRepository articleRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public ArticleController(IMapper mapper, IArticleRepository articleRepository)
        {
            this.mapper = mapper;
            this.articleRepository = articleRepository;
        }

        /// <summary>
        /// Searches for all the Articles inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Article/
        /// </summary>
        /// <returns>An OK 200 with all the Articles found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.ArticleRead))]
        public async Task<IActionResult> GetAllArticlesAsync()
        {
            Logger.Info("Grabbing all Articles from the Database");

            List<Article> articleDomainModel = await articleRepository.GetAllAsync();

            Logger.Info("Found Articles: {}", JsonSerializer.Serialize(articleDomainModel));

            return Ok(mapper.Map<List<ArticleDto>>(articleDomainModel));
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
        public async Task<IActionResult> GetArticleByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for Article: {}", ID);
            Article? articleDomainModel = await articleRepository.GetByIDAsync(ID);

            if (articleDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found Article: {}", JsonSerializer.Serialize(articleDomainModel));

            return Ok(mapper.Map<ArticleDto>(articleDomainModel));
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
        [ActionName(nameof(GetArticleByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.ArticleWrite))]
        public async Task<IActionResult> CreateArticleAsync([FromBody] ArticleDto addArticleRequestDto)
        {

            Logger.Info("Attempting to add {} to the database", addArticleRequestDto.Name);

            Article? articleDomainModel = mapper.Map<Article>(addArticleRequestDto);

            articleDomainModel = await articleRepository.CreateAsync(articleDomainModel);

            Logger.Info("Article added: {}", JsonSerializer.Serialize(articleDomainModel));

            ArticleDto articleDto = mapper.Map<ArticleDto>(articleDomainModel);
            return CreatedAtAction(nameof(GetArticleByIDAsync), new { id = articleDto.ID }, articleDto);
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
        public async Task<IActionResult> UpdateArticleByIDAsync([FromRoute] int ID, [FromBody] ArticleDto updateArticleRequestDto)
        {

            Logger.Info("Attempting to update {}", updateArticleRequestDto.Name);

            Article? articleDomainModel = mapper.Map<Article>(updateArticleRequestDto);

            if (articleDomainModel == null)
            {
                return NotFound();
            }

            articleDomainModel = await articleRepository.UpdateAsync(ID, articleDomainModel);

            Logger.Info("Updated Article with: {}", JsonSerializer.Serialize(articleDomainModel));

            return Ok(mapper.Map<ArticleDto>(articleDomainModel));
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
        public async Task<IActionResult> DeleteArticleByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Article with ID: {}", ID);

            //Deleting Article
            Article? articleDomainModel = await articleRepository.DeleteAsync(ID);
            if (articleDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Article: {}", JsonSerializer.Serialize(articleDomainModel));

            return Ok(mapper.Map<ArticleDto>(articleDomainModel));
        }

        [HttpGet]
        [Route("GetByName/{name}")]
        [Authorize(Roles = nameof(Permission.ArticleRead))]
        public async Task<IActionResult> GetArticleByNameFilter([FromRoute] string name)
        {
            //Getting data
            List<Article>? articleDomainModel = await articleRepository.GetArticleByNameFilter(name);

            //Checking if the role has value 
            if (articleDomainModel == null)
            {
                return NotFound();
            }

            //Converting Domain to Dto
            return Ok(mapper.Map<List<ArticleDto>>(articleDomainModel));
        }


        [HttpGet]
        [Route("GetByNumber/{articleNumber}")]
        [Authorize(Roles = nameof(Permission.ArticleRead))]
        public async Task<IActionResult> GetArticleByNumberFilter([FromRoute] string articleNumber)
        {
            //Getting data
            List<Article>? articleDomainModel = await articleRepository.GetArticleByNumberFilter(articleNumber);

            //Checking if the role has value 
            if (articleDomainModel == null)
            {
                return NotFound();
            }

            //Converting Domain to Dto
            return Ok(mapper.Map<List<ArticleDto>>(articleDomainModel));
        }
    }
}
