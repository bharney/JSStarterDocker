using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StarterKit.Models.AccountViewModels
{
    public class ConfirmRegistrationViewModel
    {
        public string UserId { get; set; }
        public string Code { get; set; }
    }
}
