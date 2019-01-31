using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StarterKit.Models;
using StarterKit.Models.AccountViewModels;
using StarterKit.Models.ManageViewModels;
using StarterKit.Repository;
using StarterKit.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace StarterKit.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICachedUserRepository<ApplicationUser> _userRepository;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly IUserContext _userContext;
        private HttpContext _httpContext;
        
        private const string UserGuidCookiesName = "StarterPackUserGuid";

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ILoggerFactory loggerFactory,
            IConfiguration config,
            IHttpContextAccessor contextAccessor,
            ICachedUserRepository<ApplicationUser> userRepository,
            IMemoryCache cache)
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
                loggerFactory,
                cache);
        }

        [TempData]
        public string ErrorMessage { get; set; }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model, string returnUrl = null)
        {
            if (ModelState.IsValid)
            {
                var allowPassOnEmailVerfication = false;
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user != null)
                {
                    if (!string.IsNullOrWhiteSpace(user.UnConfirmedEmail))
                    {
                        allowPassOnEmailVerfication = true;
                    }

                    var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, true);
                    if (result.IsNotAllowed)
                    {
                        return Ok(new { error = "Account Requires Email Confirmation", error_description = "You must verify your email address using the confirmation email link before logging in." });
                    }
                    if (allowPassOnEmailVerfication)
                    {
                        return allowPassOnEmailVerfication ? RedirectToLocal(returnUrl) : RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                    }
                    if (result.Succeeded)
                    {
                        _userContext.SetUserGuidCookies(user.UserGuid);
                        return Ok(new { token = await _userContext.GenerateToken(user) });
                    }
                    if (result.IsLockedOut)
                    {
                        return Ok(new { error = "Account Locked", error_description = "User account locked out. Please wait 5 minutes before trying to login again." });
                    }
                }

                return Ok(new { error = "Login Failed", error_description = "User could not be found. Or Password does not match login." });
            }

            // If we got this far, something failed, redisplay form
            return BadRequest();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody]RegisterViewModel model, string returnUrl = null)
        {
            if (ModelState.IsValid)
            {
                var userGuid = Guid.NewGuid();
                ApplicationUser user = new ApplicationUser { UserName = model.Email, Email = model.Email, UserGuid = userGuid };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var callbackUrl = Url.RegistrationEmailConfirmationLink(user.Id, code, Uri.UriSchemeHttps);
                    //Once routes are fixed remove this substr
                    //Current need to remove the /Account from start of URL because
                    //There is a conflict with the routes on client side for /Account
                    var updatedCallbackUrl = callbackUrl.Remove(callbackUrl.IndexOf("/Account"), 8);
                    await _emailSender.SendEmailConfirmationAsync(model.Email, updatedCallbackUrl);
                    return Ok(new { });
                }

                return Ok(new { error = "Registration Failed", error_description = "User could not be created using that user name" });
            }

            // If we got this far, something failed, redisplay form
            return BadRequest();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmRegistrationEmail([FromBody]ConfirmRegistrationViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByIdAsync(model.UserId);
                if (user == null)
                {
                    return Ok();
                }

                var result = await _userManager.ConfirmEmailAsync(user, model.Code.Replace(" ", "+"));

                if (result.Succeeded)
                {
                    _logger.LogInformation("User signed into a new account.");
                    await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, "Member"));
                    _userContext.SetUserGuidCookies(user.UserGuid);
                    return Ok(new { token = await _userContext.GenerateToken(user) });
                }
            }

            return BadRequest();
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _userContext.RemoveUserGuidCookies();
            _logger.LogInformation("User logged out.");
            return Ok(new { token = await _userContext.GenerateToken(_userContext.NewGuestUser()) });
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
                var callbackUrl = Url.ResetPasswordCallbackLink(user.Id, code, Uri.UriSchemeHttps);
                await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                   $@"<h3> You have requested a password reset request from your account.</h3>
                        <h3>Please reset your password by clicking here: <a href='{callbackUrl}'>link</a></h3>
                        <h3>If you did not request a password reset, no further action is needed on your part.</h3>");
                return Ok(new { });
            }

            // If we got this far, something failed, redisplay form
            return BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userManager.FindByIdAsync(model.UserId);
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
                return Ok(new { token = await _userContext.GenerateToken(user) });
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
                return Ok(new { error = "User not found.", error_description = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
            }

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (!changePasswordResult.Succeeded)
            {
                AddErrors(changePasswordResult);
                return Ok();
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            _logger.LogInformation("User changed their password successfully.");
            return Ok(new { token = await _userContext.GenerateToken(user) });
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
                return Ok(new { error = "User not found.", error_description = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
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

            _logger.LogInformation("User deleted and logged out.");
            return Ok(new { token = await _userContext.GenerateToken(_userContext.NewGuestUser()) });
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Download()
        {
            if (!ModelState.IsValid)
            {
                return Ok();
            }

            var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value);
            if (user == null)
            {
                return Ok(new { error = "User not found.", error_description = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
            }

            Dictionary<string, object> result = new Dictionary<string, object>()
            {
                { "Email", user.Email },
                { "FirstName", user.FirstName },
                { "LastName", user.LastName },
                { "ImageUrl", user.ImageUrl },
                { "ImageThumbnailUrl", user.ImageThumbnailUrl }
            };

            byte[] byteArray = Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(result,
                                                        new JsonSerializerSettings
                                                        {
                                                            NullValueHandling = NullValueHandling.Ignore
                                                        })
            );
            MemoryStream stream = new MemoryStream(byteArray);
            return File(stream, "application/octet-stream");
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> ChangeEmail([FromBody]ChangeEmailViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value);
                if (user != null)
                {
                    //doing a quick swap so we can send the appropriate confirmation email
                    user.UnConfirmedEmail = user.Email;
                    user.Email = model.UnConfirmedEmail;
                    user.EmailConfirmed = false;
                    var result = await _userManager.UpdateAsync(user);

                    if (result.Succeeded)
                    {
                        var tempUnconfirmed = user.Email;
                        user.Email = user.UnConfirmedEmail;
                        user.UnConfirmedEmail = tempUnconfirmed;
                        result = await _userManager.UpdateAsync(user);
                        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        var callbackUrl = Url.EmailConfirmationLink(user.Id, code, Uri.UriSchemeHttps);
                        //Once routes are fixed remove this substr
                        //Current need to remove the /Account from start of URL because
                        //There is a conflict with the routes on client side for /Account
                        var updatedCallbackUrl = callbackUrl.Remove(callbackUrl.IndexOf("/Account"), 8);

                        await _emailSender.SendEmailChangeConfirmationAsync(new List<string>() { user.Email, user.UnConfirmedEmail }, updatedCallbackUrl);
                    }
                }
            }
            return BadRequest();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail([FromBody]ConfirmEmailViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByIdAsync(model.UserId);
                if (user == null)
                {
                    return Ok();
                }

                if (user.Email != model.Email)
                {
                    return Ok();
                }
               
                var result = await _userManager.ConfirmEmailAsync(user, model.Code.Replace(" ", "+"));

                if (result.Succeeded)
                {
                    var signInResult = await _signInManager.CheckPasswordSignInAsync(user, model.Password, true);

                    if (signInResult.IsNotAllowed)
                    {
                        return Ok(new { error = "Account Requires Email Confirmation", error_description = "You must verify your email address using the confirmation email link before logging in." });
                    }
                    if (signInResult.Succeeded)
                    {
                        if (!string.IsNullOrWhiteSpace(user.UnConfirmedEmail))
                        {
                            user.Email = user.UnConfirmedEmail;
                            user.UserName = user.UnConfirmedEmail;
                            user.UnConfirmedEmail = "";

                            await _userManager.UpdateAsync(user);
                        }

                        _logger.LogInformation("User confirmed email successfully.");
                        _userContext.SetUserGuidCookies(user.UserGuid);
                        return Ok(new { token = await _userContext.GenerateToken(user) });
                    }
                    if (signInResult.IsLockedOut)
                    {
                        return Ok(new { error = "Account Locked", error_description = "User account locked out. Please wait 5 minutes before trying to login again." });
                    }
                }
            }

            return BadRequest();
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> CancelUnconfirmedEmail([FromBody]string username)
        {
            var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value);
            if (user == null)
            {
                _logger.Log(LogLevel.Warning, $"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
                return Ok();
            }

            if (user.UserName != username)
            {
                return Ok();
            }
           
            user.UnConfirmedEmail = "";
            user.EmailConfirmed = true;
            var result = await _userManager.UpdateAsync(user);
            return Ok(new { token = await _userContext.GenerateToken(_userContext.NewGuestUser()) });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetToken()
        {
            return Ok(new { token = await _userContext.GenerateToken(await _userContext.GetCurrentUser()) });
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
