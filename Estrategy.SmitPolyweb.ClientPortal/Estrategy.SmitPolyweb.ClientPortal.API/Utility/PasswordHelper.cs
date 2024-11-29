using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Utility
{
    public class PasswordHelper
    {
        /// <summary>
        ///     Handles validation of password
        /// </summary>
        /// <param name="password">Password</param>
        /// <returns>True in case valid</returns>
        public static bool ValidatePassword(string password)
        {
            if (!string.IsNullOrEmpty(password))
            {
                // Checks if the string contains a special character, digit, capital letter, smal letter and is between 9 and 32 characters long.
                // All special characters are allowed with exceptions of "[]"
                Regex rg = new Regex("^(?=.*[!@#$%^&*()\\-_=+`~,./<>?:;|])(?=.*\\d)(?=.*[A-Za-z]).{8,32}$");
                MatchCollection mc = rg.Matches(password);

                if (mc.Count == 1)
                    return true;
            }
            return false;
        }
        /// <summary>
        /// TODO: Implement as soon as password history is a thing
        /// </summary>
        /// <param name="user"></param>
        /// <param name="i_new_password"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public static bool PasswordPreviouslyUsed(User user, string password)
        {
            return user.previouslyUsedPasswords.Any(x => x.OldPasswordHash == password);
        }


        /// <summary>
        ///     Generates salted password, for password value and salt value
        /// </summary>
        /// <param name="password">Password</param>
        /// <param name="salt">Salt</param>
        /// <returns>Salted password as String</returns>
        public static string GenerateSaltedPassword(string password, string salt)
        {
            return BitConverter.ToString(GeneratePBKDF2HashValue(password, Encoding.UTF8.GetBytes(salt))).Replace("-", string.Empty);
        }

        /// <summary>
        ///     Generates Hash value
        /// </summary>
        /// <param name="password">Password</param>
        /// <param name="salt">Salt</param>
        /// <returns>Has value as Byte array</returns>
        private static byte[] GeneratePBKDF2HashValue(string password, byte[] salt, int iterations = 24000)
        {
            byte[] hashValue;
            string valueToHash = string.IsNullOrEmpty(password) ? string.Empty : password;
            using (Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(valueToHash, salt, iterations, HashAlgorithmName.SHA256))
            {
                hashValue = pbkdf2.GetBytes(64 / 2); // device by 2, as mysql function uses 2 bytes per hex value, string keylength will be 64 chars in db
            }

            return hashValue;
        }
    }
}

