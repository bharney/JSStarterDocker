using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StarterKit.Models;
using StarterKit.Models.AccountViewModels;
using StarterKit.Services;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using StarterKit.Repository;
using Microsoft.AspNetCore.Http;
using StarterKit.Models.ManageViewModels;

namespace StarterKit.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserRepository _userRepository;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private HttpContext _httpContext;
        ApplicationUser _currentUser;
        private const string UserGuidCookiesName = "StarterPackUserGuid";

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ILogger<AccountController> logger,
            IConfiguration config,
            IHttpContextAccessor contextAccessor,
            IUserRepository userRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = logger;
            _config = config;
            _httpContext = contextAccessor.HttpContext;
            _userRepository = userRepository;
        }

        [TempData]
        public string ErrorMessage { get; set; }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user != null)
                {
                    var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                    if (result.Succeeded)
                    {
                        SetUserGuidCookies(user.UserGuid);
                        return GenerateToken(user);
                    }
                    return Ok(new { error = "Login Failed", error_description = "User could not be found. Or Password does not match login." });
                }
                else
                {
                    return Ok(new { error = "Login Failed", error_description = "User could not be found. Or Password does not match login." });
                }
            }

            // If we got this far, something failed, redisplay form
            return BadRequest();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody]RegisterViewModel model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            if (ModelState.IsValid)
            {
                var userGuid = Guid.NewGuid();
                _currentUser = new ApplicationUser { UserName = model.Email, Email = model.Email, UserGuid = userGuid };
                var result = await _userManager.CreateAsync(_currentUser, model.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");
                    //var code = await _userManager.GenerateEmailConfirmationTokenAsync(_currentUser);
                    //var callbackUrl = Url.EmailConfirmationLink(_currentUser.Id, code, Request.Scheme);
                    //await _emailSender.SendEmailConfirmationAsync(model.Email, callbackUrl);

                    var signInResult = await _signInManager.CheckPasswordSignInAsync(_currentUser, model.Password, false);
                    if (signInResult.Succeeded)
                    {
                        _logger.LogInformation("User signed into a new account.");
                        await _userManager.AddClaimAsync(_currentUser, new Claim(ClaimTypes.Role, "Member"));
                        SetUserGuidCookies(_currentUser.UserGuid);
                        return GenerateToken(_currentUser);
                    }
                }
                AddErrors(result);
                return Ok(new { error = "Registration Failed", error_description = "User could not be created using that user name" });
            }

            // If we got this far, something failed, redisplay form
            return BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            RemoveUserGuidCookies();
            _currentUser = await NewUserGuidCookies();
            _logger.LogInformation("User logged out.");
            return GenerateToken(_currentUser);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody]ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return Ok();
                }

                // For more information on how to enable account confirmation and password reset please
                // visit https://go.microsoft.com/fwlink/?LinkID=532713
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                var callbackUrl = Url.ResetPasswordCallbackLink(user.Id, code, Request.Scheme);
                await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                   $@"<h5>Hello!</h5><p>You are receiving this email because we have received 
                        a password reset request from your account.</p><p>Please reset your password 
                        by clicking here: <a href='{callbackUrl}'>link</a></p><p>If you did not request 
                        a password reset, no further action is needed on your part.</p><br/>
                        <p>Kind Regards,<br/>StarterKit Farms</p>",
                   $"{user.FirstName} {user.LastName}");
                return Ok(Json(model.Email));
            }

            // If we got this far, something failed, redisplay form
            return BadRequest();
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return Ok();
            }
            if (user.Email != model.Email)
            {
                // Don't reveal that the user does not exist
                return Ok();
            }
            var result = await _userManager.ResetPasswordAsync(user, model.Code.Replace(" ", "+"), model.Password);
            if (result.Succeeded)
            {
                _logger.LogInformation("User changed password successfully.");
                SetUserGuidCookies(user.UserGuid);
                return GenerateToken(user);
            }
            AddErrors(result);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword([FromBody]ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Ok();
            }

            var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (!changePasswordResult.Succeeded)
            {
                AddErrors(changePasswordResult);
                return Ok();
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            _logger.LogInformation("User changed their password successfully.");
            return GenerateToken(user);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetToken()
        {
            var currentUser = await GetCurrentUser();
            if (currentUser != null)
            {
                var userClaims = _userManager.GetClaimsAsync(currentUser);
                var claims = new List<Claim>
                    {
                      new Claim(JwtRegisteredClaimNames.Sub, currentUser.Email),
                      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                      new Claim(ClaimTypes.Sid, currentUser.Id),
                      new Claim(ClaimTypes.Name, currentUser.UserName),
                      new Claim(ClaimTypes.UserData, currentUser.UserGuid.ToString()),
                    };
                claims.AddRange(userClaims.Result);

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(_config["Token:Issuer"],
                  _config["Token:Issuer"],
                  claims,
                  expires: DateTime.Now.AddDays(30),
                  signingCredentials: creds);

                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });

            }

            return Ok();
        }

        private IActionResult GenerateToken(ApplicationUser model)
        {

            var claims = new List<Claim>
            {
              new Claim(JwtRegisteredClaimNames.Sub, model.Email),
              new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
              new Claim(ClaimTypes.Sid, model.Id),
              new Claim(ClaimTypes.Name, model.UserName),
              new Claim(ClaimTypes.UserData, model.UserGuid.ToString()),
            };

            var userClaims = _userManager.GetClaimsAsync(model);
            claims.AddRange(userClaims.Result);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Token:Issuer"],
              _config["Token:Issuer"],
              claims,
              expires: DateTime.Now.AddDays(30),
              signingCredentials: creds);

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        public async Task<ApplicationUser> GetCurrentUser()
        {
            var userGuid = GetUserGuidFromCookies();
            if (userGuid.HasValue)
            {
                _currentUser = _userRepository.Users.FirstOrDefault(x => x.UserGuid == userGuid);
            }

            if (_currentUser != null)
            {
                return _currentUser;
            }

            _currentUser = await NewUserGuidCookies();
            SetUserGuidCookies(_currentUser.UserGuid);
            return _currentUser;
        }

        public async Task<ApplicationUser> NewUserGuidCookies()
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
            await _userManager.CreateAsync(_currentUser, userPassword.ToString());
            await _userManager.AddToRoleAsync(_currentUser, "guest");

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
                return await _userRepository.GetUserByIdAsync(userGuid.Value);
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


        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction(nameof(HomeController.Index), "Home");
            }
        }

        #endregion
    }
}
