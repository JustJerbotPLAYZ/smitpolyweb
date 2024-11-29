using Estrategy.SmitPolyweb.ClientPortal.API.Models.Exceptions;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using NLog;
using System.Net;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly Logger _logger = LogManager.GetCurrentClassLogger();

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleErrorAsync(httpContext, ex);
            }
        }

        /// <summary>
        /// Handles errors by logging them and sending a response back to the client.
        /// </summary>
        /// <param name="httpContext">The HTTP context for the request.</param>
        /// <param name="ex">The exception that occurred.</param>
        private async Task HandleErrorAsync(HttpContext httpContext, Exception ex)
        {
            var errorId = Guid.NewGuid();

            // Log the exception with a unique error ID
            _logger.Error(ex, "{0} : {1}", errorId, ex.Message);

            var errorResponse = new
            {
                Id = errorId,
                ErrorMessage = GetErrorMessage(ex, httpContext)
            };

            await httpContext.Response.WriteAsJsonAsync(errorResponse);
        }

        /// <summary>
        /// Checks if the error given in the method constructor matches any of the errors in the body, <br/>
        /// if the given error matches any of the errors it will return that errors message
        /// </summary>
        /// <param name="ex">The error to check against</param>
        /// <returns>A message belonging to that error</returns>
        internal static string GetErrorMessage(Exception ex, HttpContext httpContext)
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            httpContext.Response.ContentType = "application/json";

            // Check for specific errors like having no valid token
            if (ex is UserNotLoggedInException notLoggedInEx)
            {
                if (notLoggedInEx.HttpStatusCode != null)
                    httpContext.Response.StatusCode = (int)notLoggedInEx.HttpStatusCode;
                else
                    httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

                return ex.Message;
            }

            if (ex is ValueAlreadyExistsException)
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.Conflict;
                return ex.Message;
            }

            if (ex is DbUpdateException)
            {
                if (ex.InnerException is MySqlException)
                {
                    MySqlException mySqlEx = (MySqlException)ex.InnerException;
                    // This exception code is for when you are deleting an object that is still being referenced by another object
                    if (mySqlEx.Number == 1451)
                        return "Something else is referencing this item so it cannot be deleted! Please remove this association first.";

                    // This exception code is for when you are making or updating an object with a value that already exists
                    if (mySqlEx.Number == 1062)
                    {
                        httpContext.Response.StatusCode = (int)HttpStatusCode.Conflict;
                        return "The value you entered must be unique, but it already exists! Please enter a different value.";
                    }


                    // This is for finding other errors so we can include them here
                    else LogManager.GetCurrentClassLogger().Info(mySqlEx.Number);
                }
            }
            return "Something went wrong! We are looking into resolving this!";
        }
    }
}
