using System.Net;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Exceptions
{
    public class UserNotLoggedInException : Exception
    {
        public HttpStatusCode? HttpStatusCode { get; set; }

        public UserNotLoggedInException() : base() { }

        public UserNotLoggedInException(string? message) : base(message) { }

        public UserNotLoggedInException(HttpStatusCode? httpStatusCode, string? message) : base(message)
        {
            HttpStatusCode = httpStatusCode;
        }

        public UserNotLoggedInException(string? message, Exception? innerException) : base(message, innerException) { }

        public UserNotLoggedInException(HttpStatusCode? httpStatusCode, string? message, Exception? innerException) : base(message, innerException)
        {
            HttpStatusCode = httpStatusCode;
        }
    }
}
