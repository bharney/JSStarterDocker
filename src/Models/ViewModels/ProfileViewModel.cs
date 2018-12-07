using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StarterKit.Models.ViewModels
{
    public class ProfileViewModel
    {
        public string Username { get; set; }

        public bool IsEmailConfirmed { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Display(Name = "Last Name")]
        public string FirstName { get; set; }

        [Display(Name = "First Name")]
        public string LastName { get; set; }

        public Guid UserGuid { get; set; }

        public string ImageUrl { get; set; }

        [FileExtensions(Extensions= ".jpeg,.jpg,.png,.gif", ErrorMessage= "Incorrect file format")]
        public IFormFile ImageBlob { get; set; }

        public string ImageThumbnailUrl { get; set; }
        public string Location { get; set; }

        public string Description { get; set; }

        public string StatusMessage { get; set; }
    }
}
