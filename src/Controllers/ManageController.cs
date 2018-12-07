using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StarterKit.Models;
using StarterKit.Models.ManageViewModels;
using StarterKit.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.IO;
using StarterKit.Repository;
using StarterKit.Models.ViewModels;

namespace StarterKit.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("[controller]/[action]")]
    public class ManageController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;
        private readonly UrlEncoder _urlEncoder;
        private readonly IImageStorageService _imageService;

        public ManageController(
          UserManager<ApplicationUser> userManager,
          SignInManager<ApplicationUser> signInManager,
          IEmailSender emailSender,
          ILogger<ManageController> logger,
          UrlEncoder urlEncoder,
          IImageStorageService imageService)

        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = logger;
            _urlEncoder = urlEncoder;
            _imageService = imageService;
        }

        [TempData]
        public string StatusMessage { get; set; }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value);
            if (user == null)
            {
                return Ok(new { error = "User not found.", error_description = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
            }

            return Ok(new ProfileViewModel {
                UserGuid = user.UserGuid,
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsEmailConfirmed = user.EmailConfirmed,
                ImageThumbnailUrl = user.ImageThumbnailUrl,
                ImageUrl = user.ImageUrl,
                Location = "",
                Description = "",
                StatusMessage = StatusMessage
            });
        }

        [HttpPost]
        public async Task<IActionResult> Index(ProfileViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value);
            if (user == null)
            {
                return Ok(new { error = "User not found.", error_description = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
            }

            var email = user.Email;
            if (model.Email != email)
            {
                user.Email = model.Email;
                var setEmailResult = await _userManager.SetEmailAsync(user, model.Email);
                if (!setEmailResult.Succeeded)
                {
                    return Ok(new { error = "Failed to change Email.", error_description = $"Unexpected error occurred setting email for user with ID '{user.Id}'." });
                }
            }

            var firstName = user.FirstName;
            if (model.FirstName != firstName)
            {
                user.FirstName = model.FirstName;
                var setNameResult = await _userManager.UpdateAsync(user);
                if (!setNameResult.Succeeded)
                {
                    return Ok(new { error = "Failed to change First Name.", error_description = $"Unexpected error occurred setting first name for user with ID '{user.Id}'." });
                }
            }

            var lastName = user.LastName;
            if (model.LastName != lastName)
            {
                user.LastName = model.LastName;
                var setNameResult = await _userManager.UpdateAsync(user);
                if (!setNameResult.Succeeded)
                {
                    return Ok(new { error = "Failed to change Last Name.", error_description = $"Unexpected error occurred setting last name for user with ID '{user.Id}'." });
                }
            }

            var imageUrl = Path.GetFileName(user.ImageUrl);
            if (model.ImageBlob != null && model.ImageBlob.FileName != imageUrl)
            {
                user.ImageUrl = await Upload(model.ImageBlob);
                var setNameResult = await _userManager.UpdateAsync(user);
                if (!setNameResult.Succeeded)
                {
                    return Ok(new { error = "Failed to change Image Url.", error_description = $"Unexpected error occurred setting image url for user with ID '{user.Id}'." });
                }
            }

            StatusMessage = "Your profile has been updated";
            return RedirectToAction(nameof(Index));
        }

        public async Task<string> Upload(IFormFile model)
        {
            try
            {
                //check if the image is less than 200kb
                if (model != null && ((model.Length / 1048576.0) < .2))
                {
                    using (var stream = new MemoryStream())
                    {
                        model.CopyTo(stream);
                        var fileBytes = stream.ToArray();
                        var op = _imageService.StoreProfile(model.FileName, fileBytes);

                        op.Wait();
                        if (!op.IsCompletedSuccessfully)
                        {
                            _logger.Log(LogLevel.Error, $"Unable to upload image file: {op.Exception}");
                            throw op.Exception;
                        }
                        return await op;
                    }
                }

                return "";
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value);
            if (user == null)
            {
                return Ok(new { error = "User not found.", error_description = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
            }
            var userClaims = _userManager.GetClaimsAsync(user);
            if (userClaims.Result.Any(x => x.Type == ClaimTypes.Role && x.Value == "Admin"))
            {
                var users = await _userManager.GetUsersForClaimAsync(new Claim(ClaimTypes.Role, "User"));
                return Ok(users.Select(x => new ProfileViewModel
                {
                    UserGuid = x.UserGuid,
                    Username = x.UserName,
                    Email = x.Email,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    IsEmailConfirmed = x.EmailConfirmed,
                    ImageThumbnailUrl = x.ImageThumbnailUrl,
                    ImageUrl = x.ImageUrl,
                    StatusMessage = StatusMessage
                }).ToList());

            }

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> SendVerificationEmail(ProfileViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userManager.FindByIdAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid).Value); ;
            if (user == null)
            {
                return Ok(new { error = "User not found.", error_description = $"Unable to load user with ID '{_userManager.GetUserId(User)}'." });
            }

            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            //var callbackUrl = Url.EmailConfirmationLink(user.Id, code, Request.Scheme);
            var email = user.Email;
            //await _emailSender.SendEmailConfirmationAsync(email, callbackUrl, $"{user.FirstName} {user.LastName}");

            StatusMessage = "Verification email sent. Please check your email.";
            return RedirectToAction(nameof(Index));
        }

        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        #endregion
    }
}
