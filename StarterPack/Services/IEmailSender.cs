using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StarterKit.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message, string name = "");
        Task SendEmailAsync(List<string> emails, string subject, string message, string name = "");
        Task SendEmailConfirmationAsync(string email, string callbackUrl, string name = "");
        Task SendEmailChangeConfirmationAsync(List<string> emails, string callbackUrl, string name = "");
    }
}
