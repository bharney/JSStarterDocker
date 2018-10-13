using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StarterKit.Models.AccountViewModels
{
    public class ConfirmEmailViewModel
    {
        public string UserId { get; set; }
        public string Code { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
