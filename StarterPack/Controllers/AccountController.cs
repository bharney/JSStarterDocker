using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StarterKit.Models;
using StarterKit.Models.AccountViewModels;
using StarterKit.Models.ManageViewModels;
using StarterKit.Repository;
using StarterKit.Services;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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
        private readonly IUserContext _userContext;
        private HttpContext _httpContext;
        ApplicationUser _currentUser;
        private const string UserGuidCookiesName = "StarterPackUserGuid";

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ILoggerFactory loggerFactory,
            IConfiguration config,
            IHttpContextAccessor contextAccessor,
            IUserRepository userRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = loggerFactory.CreateLogger("AccountController");
            _config = config;
            _httpContext = contextAccessor.HttpContext;
            _userRepository = userRepository;

            _userContext = new UserContext(_userRepository,
                _userManager,
                contextAccessor,
                _config,
                loggerFactory);
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
                        _userContext.SetUserGuidCookies(user.UserGuid);
                        return Ok(new { token = _userContext.GenerateToken(user) });
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
                        _userContext.SetUserGuidCookies(_currentUser.UserGuid);
                        return Ok(new { token = _userContext.GenerateToken(_currentUser) });
                    }
                }
                AddErrors(result);
                return Ok(new { error = "Registration Failed", error_description = "User could not be created using that user name" });
            }

            // If we got this far, something failed, redisplay form
            return BadRequest();
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _userContext.RemoveUserGuidCookies();
            _currentUser = _userContext.NewGuestUser();
            _logger.LogInformation("User logged out.");
            return Ok(new { token = _userContext.GenerateToken(_currentUser) });
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
                _userContext.SetUserGuidCookies(user.UserGuid);
                return Ok(new { token = _userContext.GenerateToken(user) });
            }
            AddErrors(result);
            return Ok();
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
            return Ok(new { token = _userContext.GenerateToken(user) });
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Delete([FromBody]DeleteAccountViewModel model)
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

            if (user.UserName != model.UserName)
            {
                return Ok();
            }

            await _signInManager.SignOutAsync();
            _userContext.RemoveUserGuidCookies();

            var deleteUserResult = await _userManager.DeleteAsync(user);
            if (!deleteUserResult.Succeeded)
            {
                AddErrors(deleteUserResult);
                return Ok();
            }

            _currentUser = _userContext.NewGuestUser();
            _logger.LogInformation("User deleted and logged out.");
            return Ok(new { token = _userContext.GenerateToken(_currentUser) });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetToken()
        {
            _currentUser = await _userContext.GetCurrentUser();
            return Ok(new { token = _userContext.GenerateToken(_currentUser) });
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
