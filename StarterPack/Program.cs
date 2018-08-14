using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.Extensions.Logging;
using System;
using System.Reflection;

namespace StarterKit
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((ctx, config) =>
            {
                var env = ctx.HostingEnvironment;
                if (env.IsDevelopment())
                {
                    var appAssembly = Assembly.Load(new AssemblyName(env.ApplicationName));
                    if (appAssembly != null)
                    {
                        config.AddUserSecrets(appAssembly, optional: true);
                    }
                }
                var builtConfig = config.Build();

                var keyVaultConfigBuilder = new ConfigurationBuilder();

                keyVaultConfigBuilder.AddAzureKeyVault(
                    builtConfig["MSI_ENDPOINT"],
                    builtConfig["MSI_CLIENT"],
                    builtConfig["MSI_SECRET"]);
                var keyVaultConfig = keyVaultConfigBuilder.Build();
                config.AddConfiguration(keyVaultConfig);
                
                //else
                //{
                //    var builtConfig = config.Build();

                //    var keyVaultEndpoint = GetKeyVaultEndpoint();
                //    if (!string.IsNullOrEmpty(keyVaultEndpoint))
                //    {
                //        var azureServiceTokenProvider = new AzureServiceTokenProvider();
                //        var keyVaultClient = new KeyVaultClient(
                //            new KeyVaultClient.AuthenticationCallback(
                //                azureServiceTokenProvider.KeyVaultTokenCallback));
                //        config.AddAzureKeyVault(
                //            keyVaultEndpoint, keyVaultClient, new DefaultKeyVaultSecretManager());
                //    }
                //}
            })
            .UseStartup<Startup>()
            .Build();
        private static string GetKeyVaultEndpoint() => "https://starterpackvault.vault.azure.net/";
    }
}