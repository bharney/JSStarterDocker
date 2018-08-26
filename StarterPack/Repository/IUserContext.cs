using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StarterKit.Models;

namespace StarterKit.Repository
{
    public interface IUserContext
    {
        string GenerateToken(ApplicationUser model);
        Task<ApplicationUser> GetCurrentUser();
        Task<ApplicationUser> NewUserGuidCookies();
        void RemoveUserGuidCookies();
        void SetUserGuidCookies(Guid userGuid);
        Task<ApplicationUser> GetLoggedInUser();
        Guid? GetUserGuidFromCookies();
    }
}