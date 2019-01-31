using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

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
            var apiKey = _config["MailService:Key"];
            var client = new SendGridClient(apiKey);
            var mailClientSender = _config["MailService:User"];
            var msg = new SendGridMessage()
            {
                From = new EmailAddress($"{mailClientSender}@{mailClientSender}.com", mailClientSender),
                Subject = subject,
                HtmlContent = message
            };
            List<EmailAddress> tos = new List<EmailAddress>
            {
                new EmailAddress(email, name),
            };

            msg.AddTos(tos);
            var response = await client.SendEmailAsync(msg);
        }

        public async Task SendEmailAsync(List<string> emails, string subject, string message, string name = "")
        {
            foreach (var email in emails)
            {
                await SendEmailAsync(email, subject, message, name);
            }
        }

        public async Task SendEmailConfirmationAsync(string email, string link, string name)
        {
            await SendEmailAsync(email, "Confirm your email",
                $@"<h3>Thank you for creating an account with StarterKit.</h3>
                    <h3>You must confirm your account before you can login. 
                    Please confirm your account by clicking this link: 
                    <a href='{HtmlEncoder.Default.Encode(link)}'>Confirm Email</a></h3>",
                name);
        }

        public async Task SendEmailChangeConfirmationAsync(List<string> email, string link, string name)
        {
            await SendEmailAsync(email, "StarterKit Email Change Requested",
                $@"<h3>Your Account on StarterKit has requested an Email change. If you did not 
                    initiate this request, then you can ignore this email.</h3>
                    <h3>You must confirm this action before the email change can be completed. 
                    Please click on this link: <a href='{HtmlEncoder.Default.Encode(link)}'>Change Email</a> </h3>",
                name);
        }
    }
}
