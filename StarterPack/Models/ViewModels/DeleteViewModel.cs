using System.ComponentModel.DataAnnotations;

namespace StarterKit.Models.ManageViewModels
{
    public class DeleteAccountViewModel
    {
        [Required]
        public string UserName { get; set; }
    }
}
