using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using StarterKit.Models;
using StarterKit.Repository;

namespace StarterKit.Repository
{
    public class CachedUserRepositoryDecorator : ICachedUserRepository<ApplicationUser>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMemoryCache _cache;
        private const string MyModelCacheKey = "Users";
        private MemoryCacheEntryOptions cacheOptions;
        private const int DEFAULT_CACHE_SECONDS = 10;

        // alternatively use IDistributedCache if you use redis and multiple services
        public CachedUserRepositoryDecorator(IUserRepository userRepository,
            IMemoryCache cache)
        {
            _userRepository = userRepository;
            _cache = cache;

            // 5 second cache
            cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(relative: TimeSpan.FromSeconds(DEFAULT_CACHE_SECONDS));
        }

        public async Task<ApplicationUser> GetByIdAsync(Guid userGuid)
        {
            string key = MyModelCacheKey + "-" + userGuid;

            return await _cache.GetOrCreateAsync(key, entry =>
            {
                entry.SetOptions(cacheOptions);
                return _userRepository.GetUserByIdAsync(userGuid);
            });
        }

        public async Task<IEnumerable<ApplicationUser>> ListAsync()
        {
            return await _cache.GetOrCreateAsync(MyModelCacheKey, entry =>
             {
                 entry.SetOptions(cacheOptions);
                 return _userRepository.GetUsersAsync();
             });
        }
    }
}