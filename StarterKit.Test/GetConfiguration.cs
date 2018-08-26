using Microsoft.Extensions.Configuration;
using System.IO;

namespace StarterKit.Test
{
    class GetConfiguration
    {
        public static IConfigurationRoot GetIConfiguration()
        {
            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddUserSecrets("f986c0ad-1451-4764-ab20-4f8fb8512e45")
                .AddEnvironmentVariables()
                .Build();
        }
    }
}
