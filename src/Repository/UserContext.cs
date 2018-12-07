using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using StarterKit.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace StarterKit.Repository
{
    public class UserContext : IUserContext
    {
        private readonly ILogger _logger;
        private readonly ICachedUserRepository<ApplicationUser> _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private HttpContext _httpContext;
        private readonly IConfiguration _config;
        ApplicationUser _currentUser;
        private const string UserGuidCookiesName = "StarterPackUserGuid";
        private readonly IMemoryCache _cache;
        private const string MyModelCacheKey = "UserContext";
        private MemoryCacheEntryOptions cacheOptions;
        private const int DEFAULT_CACHE_SECONDS = 10;

        public UserContext(ICachedUserRepository<ApplicationUser> userRepository,
            UserManager<ApplicationUser> userManager,
            IHttpContextAccessor contextAccessor,
            IConfiguration config,
            ILoggerFactory loggerFactory,
            IMemoryCache cache)
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _httpContext = contextAccessor.HttpContext;
            _config = config;
            _logger = loggerFactory.CreateLogger("UserContext");
            _cache = cache;

            // 5 second cache
            cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(relative: TimeSpan.FromSeconds(DEFAULT_CACHE_SECONDS));
        }

        public async Task<string> GenerateToken(ApplicationUser model)
        {
            string key = MyModelCacheKey + "-" + model.Id;

            return await _cache.GetOrCreateAsync(key, entry =>
            {
                entry.SetOptions(cacheOptions);
                return TokenBuilder(model);
            });
        }

        private async Task<string> TokenBuilder(ApplicationUser model)
        {
            var claims = new List<Claim>
            {
              new Claim(JwtRegisteredClaimNames.Sub, model.Email),
              new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
              new Claim(ClaimTypes.Sid, model.Id),
              new Claim(ClaimTypes.Name, model.UserName),
              new Claim(ClaimTypes.UserData, model.UserGuid.ToString()),
            };

            var userClaims = await _userManager.GetClaimsAsync(model);
            claims.AddRange(userClaims);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Token:Issuer"],
              _config["Token:Issuer"],
              claims,
              expires: DateTime.Now.AddDays(30),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<ApplicationUser> GetCurrentUser()
        {
            var userGuid = GetUserGuidFromCookies();
            if (userGuid.HasValue)
            {
                _currentUser = await _userRepository.GetByIdAsync(userGuid.Value);
            }

            if (_currentUser != null)
            {
                return _currentUser;
            }

            _currentUser = NewGuestUser();
            SetUserGuidCookies(_currentUser.UserGuid);
            return _currentUser;
        }

        public ApplicationUser NewGuestUser()
        {
            var userGuid = Guid.NewGuid();
            var userPassword = Guid.NewGuid();
            var dummyEmail = string.Format("{0}@guest.starterpack.com", userGuid);
            _currentUser = new ApplicationUser
            {
                FirstName = "Guest",
                LastName = "Guest",
                UserGuid = userGuid,
                Email = dummyEmail,
                UserName = dummyEmail
            };
           // await _userManager.CreateAsync(_currentUser, userPassword.ToString());
           //  await _userManager.AddToRoleAsync(_currentUser, "Guest");

            return _currentUser;
        }

        public void RemoveUserGuidCookies()
        {
            _httpContext.Response.Cookies.Delete(UserGuidCookiesName);
        }

        public void SetUserGuidCookies(Guid userGuid)
        {
            _httpContext.Response.Cookies.Append(UserGuidCookiesName, userGuid.ToString(), new CookieOptions
            {
                Expires = DateTime.UtcNow.AddYears(5),
                HttpOnly = true
            });
        }

        public async Task<ApplicationUser> GetLoggedInUser()
        {
            var userGuid = GetUserGuidFromCookies();
            if (userGuid.HasValue)
            {
                return await _userRepository.GetByIdAsync(userGuid.Value);
            }

            return null;
        }

        public Guid? GetUserGuidFromCookies()
        {
            if (_httpContext.Request.Cookies.ContainsKey(UserGuidCookiesName))
            {
                return Guid.Parse(_httpContext.Request.Cookies[UserGuidCookiesName]);
            }

            return null;
        }
    }
}
