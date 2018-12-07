using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using StarterKit.Models;
using StarterKit.Repository;

namespace StarterKit.Repository
{
    public interface ICachedUserRepository<T> where T : ApplicationUser 
    {
        Task<ApplicationUser> GetByIdAsync(Guid userGuid);
        Task<IEnumerable<ApplicationUser>> ListAsync();
    }
}