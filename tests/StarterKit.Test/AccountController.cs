using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using StarterKit.Controllers;
using StarterKit.Models;
using StarterKit.Repository;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StarterKit.Test
{
    [TestClass]
    public class AccountController
    {
        private Mock<UserManager<ApplicationUser>> _userManager;
        private Mock<ICachedUserRepository<ApplicationUser>> _userRepository;
        private Mock<SignInManager<ApplicationUser>> _signInManager;
        private Mock<Services.IEmailSender> _emailSender;
        private Mock<ILoggerFactory> _logger;
        private IConfiguration _config;
        private Mock<IUserContext> _userContext;
        private Mock<IHttpContextAccessor> _contextAccessor;

        private const string UserGuidCookiesName = "StarterPackUserGuid";

        [TestInitialize]
        public void initialize()
        {
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _userManager = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
            _contextAccessor = new Mock<IHttpContextAccessor>();
            _signInManager = new Mock<SignInManager<ApplicationUser>>(_userManager.Object, _contextAccessor.Object,
                 new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
                 new Mock<IOptions<IdentityOptions>>().Object,
                 new Mock<ILogger<SignInManager<ApplicationUser>>>().Object,
                 new Mock<IAuthenticationSchemeProvider>().Object);
            _emailSender = new Mock<Services.IEmailSender>();
            _userRepository = new Mock<ICachedUserRepository<ApplicationUser>>();
            _contextAccessor.Setup(x => x.HttpContext).Returns(new DefaultHttpContext());
            _logger = new Mock<ILoggerFactory>();
            _config = GetConfiguration.GetIConfiguration();
            _userContext = new Mock<IUserContext>();
            _userContext.Setup(x => x.GetCurrentUser()).ReturnsAsync(It.IsAny<ApplicationUser>());
            _userContext.Setup(x => x.GenerateToken(It.IsAny<ApplicationUser>())).ReturnsAsync(It.IsAny<string>());
            //_cache.Setup(x => x.GetOrCreateAsync(It.IsAny<string>(), It.IsAny<Func<ICacheEntry, string>>())).ReturnsAsync(It.IsAny<string>());
        }

        [TestMethod]
        public void Account_GetToken_Guest_Success()
        {
            IList<Claim> guestClaim = new List<Claim>();
            _userManager.Setup(x => x.GetClaimsAsync(It.IsAny<ApplicationUser>())).ReturnsAsync(guestClaim);
            
            Controllers.AccountController accountController = new Controllers.AccountController(_userManager.Object,
                _signInManager.Object,
                _emailSender.Object,
                _logger.Object,
                _config,
                _contextAccessor.Object,
                _userRepository.Object,
                new MemoryCache(new MemoryCacheOptions()));
            var actionResult = accountController.GetToken();
            var objectResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(objectResult.Value);
            JwtSecurityToken token = DeserializeToken(objectResult);
            var claim = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value;
            Assert.IsNotNull(claim);
            Assert.IsFalse(token.Claims.Where(c => c.Type == ClaimTypes.Role).Any());

        }

        [TestMethod]
        public void Account_GetToken_Member_Success()
        {
            IList<Claim> memberClaim = new List<Claim>() { new Claim(ClaimTypes.Role, "Member") };
            _userManager.Setup(x => x.GetClaimsAsync(It.IsAny<ApplicationUser>())).ReturnsAsync(memberClaim);
            Controllers.AccountController accountController = new Controllers.AccountController(_userManager.Object, 
                _signInManager.Object, 
                _emailSender.Object, 
                _logger.Object, 
                _config, 
                _contextAccessor.Object, 
                _userRepository.Object,
                new MemoryCache(new MemoryCacheOptions()));
            var actionResult = accountController.GetToken();
            var objectResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(objectResult.Value);
            JwtSecurityToken token = DeserializeToken(objectResult);
            var claim = token.Claims.Where(c => c.Type == ClaimTypes.Role);
            Assert.IsTrue(claim.FirstOrDefault().Value == "Member");
        }

        private static JwtSecurityToken DeserializeToken(OkObjectResult objectResult)
        {
            var objectStr = objectResult.Value.ToString().TrimEnd('}').Trim();
            var tokenSubstr = objectStr.Substring(10);
            var token = new JwtSecurityTokenHandler().ReadToken(tokenSubstr) as JwtSecurityToken;
            return token;
        }

        [TestMethod]
        public void Account_GetToken_Admin_Success()
        {
            IList<Claim> adminClaim = new List<Claim>() { new Claim(ClaimTypes.Role, "Admin") };
            _userManager.Setup(x => x.GetClaimsAsync(It.IsAny<ApplicationUser>())).ReturnsAsync(adminClaim);
            Controllers.AccountController accountController = new Controllers.AccountController(_userManager.Object, 
                _signInManager.Object, 
                _emailSender.Object, 
                _logger.Object, 
                _config, 
                _contextAccessor.Object, 
                _userRepository.Object,
                new MemoryCache(new MemoryCacheOptions()));
            var actionResult = accountController.GetToken();
            var objectResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(objectResult.Value);
            JwtSecurityToken token = DeserializeToken(objectResult);
            var claim = token.Claims.Where(c => c.Type == ClaimTypes.Role);
            Assert.IsTrue(claim.FirstOrDefault().Value == "Admin");
        }
    }
}
