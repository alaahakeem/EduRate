using System.Threading.Tasks;

namespace EduRate.Services
{
    public class EmailService : IEmailService
    {
        // Placeholder for actual SMTP implementation (e.g., MailKit)
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // For now, just a simulated delay. Later you can add MailKit or SendGrid integration.
            await Task.Delay(100);
            System.Console.WriteLine($"[Email Sent] To: {toEmail} | Subject: {subject}");
        }
    }
}
