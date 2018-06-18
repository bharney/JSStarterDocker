using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
//using SendGrid;
//using SendGrid.Helpers.Mail;

namespace StarterKit.Services
{
    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _config;
        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string email, string subject, string message, string name = "")
        {
            var apiKey = _config["MailService:ApiKey"];
            //var client = new SendGridClient(apiKey);
            
            //var msg = new SendGridMessage()
            //{
            //    From = new EmailAddress("StarterKit@StarterKitFarms.com", "StarterKit Farms"),
            //    Subject = subject,
            //    HtmlContent = message
            //};
            //List<EmailAddress> tos = new List<EmailAddress>
            //{
            //    new EmailAddress(email, name),
            //};

            //msg.AddTos(tos);
            //var response = await client.SendEmailAsync(msg);
        }
    }
}
