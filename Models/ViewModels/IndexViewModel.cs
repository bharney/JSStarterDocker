using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StarterKit.Models.ManageViewModels
{
    public class IndexViewModel
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

        public IFormFile ImageUrl { get; set; }

        public IFormFile ImageThumbnailUrl { get; set; }

        public IFormFile ReferralUrl { get; set; }

        public IFormFile StateLicenseUrl { get; set; }

        public string StatusMessage { get; set; }
    }
}
