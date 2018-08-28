using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
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
        private Mock<IUserRepository> _userRepository;
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
            _userRepository = new Mock<IUserRepository>();
            _contextAccessor.Setup(x => x.HttpContext).Returns(new DefaultHttpContext());
            _logger = new Mock<ILoggerFactory>();
            _config = GetConfiguration.GetIConfiguration();
            _userContext = new Mock<IUserContext>();
        }

        [TestMethod]
        public void Account_GetToken_Guest_Success()
        {
            IList<Claim> guestClaim = new List<Claim>();
            _userContext.Setup(x => x.GetCurrentUser()).ReturnsAsync(It.IsAny<ApplicationUser>());
            _userManager.Setup(x => x.GetClaimsAsync(It.IsAny<ApplicationUser>())).ReturnsAsync(guestClaim);
            Controllers.AccountController accountController = new Controllers.AccountController(_userManager.Object, 
                _signInManager.Object, 
                _emailSender.Object,
                _logger.Object,
                _config, 
                _contextAccessor.Object,
                _userRepository.Object);
            var actionResult = accountController.GetToken();
            var objectResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(objectResult.Value);
            var objectStr = objectResult.Value.ToString().TrimEnd('}').Trim();
            var tokenSubstr = objectStr.Substring(10);
            var token = new JwtSecurityTokenHandler().ReadToken(tokenSubstr) as JwtSecurityToken;
            var claim = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value;
            Assert.IsNotNull(claim);
            Assert.IsFalse(token.Claims.Where(c => c.Type == ClaimTypes.Role).Any());

        }

        [TestMethod]
        public void Account_GetToken_Member_Success()
        {
            _userContext.Setup(x => x.GetUserGuidFromCookies()).Returns(It.IsAny<Guid>());
            _userRepository.Setup(x => x.Users).Returns(It.IsAny<List<ApplicationUser>>());
            _userContext.Setup(x => x.GetCurrentUser()).ReturnsAsync(new ApplicationUser()
            {
                Email = _config["SeedAccount:UserName"]
            });
            IList<Claim> memberClaim = new List<Claim>() { new Claim(ClaimTypes.Role, "Member") };
            _userManager.Setup(x => x.GetClaimsAsync(It.IsAny<ApplicationUser>())).ReturnsAsync(memberClaim);
            Controllers.AccountController accountController = new Controllers.AccountController(_userManager.Object, _signInManager.Object, _emailSender.Object, _logger.Object, _config, _contextAccessor.Object, _userRepository.Object);
            var actionResult = accountController.GetToken();
            var objectResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(objectResult.Value);
            var objectStr = objectResult.Value.ToString().TrimEnd('}').Trim();
            var tokenSubstr = objectStr.Substring(10);
            var token = new JwtSecurityTokenHandler().ReadToken(tokenSubstr) as JwtSecurityToken;
            var claim = token.Claims.Where(c => c.Type == ClaimTypes.Role);
            Assert.IsTrue(claim.FirstOrDefault().Value == "Member");
        }

        [TestMethod]
        public void Account_GetToken_Admin_Success()
        {
            IList<Claim> adminClaim = new List<Claim>() { new Claim(ClaimTypes.Role, "Admin") };
            _userContext.Setup(x => x.GetCurrentUser()).ReturnsAsync(new ApplicationUser() {
                Email = _config["SeedAccount:UserName"]
            });
            _userManager.Setup(x => x.GetClaimsAsync(It.IsAny<ApplicationUser>())).ReturnsAsync(adminClaim);
            Controllers.AccountController accountController = new Controllers.AccountController(_userManager.Object, _signInManager.Object, _emailSender.Object, _logger.Object, _config, _contextAccessor.Object, _userRepository.Object);
            var actionResult = accountController.GetToken();
            var objectResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(objectResult.Value);
            var objectStr = objectResult.Value.ToString().TrimEnd('}').Trim();
            var tokenSubstr = objectStr.Substring(10);
            var token = new JwtSecurityTokenHandler().ReadToken(tokenSubstr) as JwtSecurityToken;
            var claim = token.Claims.Where(c => c.Type == ClaimTypes.Role);
            Assert.IsTrue(claim.FirstOrDefault().Value == "Admin");
        }
    }
}
