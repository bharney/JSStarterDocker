using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StarterKit.Models;

namespace StarterKit.Repository
{
    public interface IUserRepository
    {
        IEnumerable<ApplicationUser> Users { get; }

        Task<bool> DeleteUserAsync(Guid id);
        ApplicationUser GetUserById(Guid userGuid);
        Task<ApplicationUser> InsertUserAsync(ApplicationUser user);
        Task<bool> UpdateUserAsync(ApplicationUser user);
        Task<ApplicationUser> GetUserByIdAsync(Guid userGuid);
    }
}