namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Exceptions
{
    public class ValueAlreadyExistsException : Exception
    {
        public ValueAlreadyExistsException() : base() { }

        public ValueAlreadyExistsException(string? message) : base(message) { }

        public ValueAlreadyExistsException(string? message, Exception? innerException) : base(message, innerException) { }
    }
}
