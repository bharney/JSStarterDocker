using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.TagHelpers.Internal;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace StarterKit.Views.Extensions
{
    public static class IRazorPageExtensions
    {
        public static string AddFileVersionToPath(this IRazorPage page, string path)
        {
            var context = page.ViewContext.HttpContext;
            IMemoryCache cache = context.RequestServices.GetRequiredService<IMemoryCache>();
            var hostingEnvironment = context.RequestServices.GetRequiredService<IHostingEnvironment>();
            var versionProvider = new FileVersionProvider(hostingEnvironment.WebRootFileProvider, cache, context.Request.Path);
            return versionProvider.AddFileVersionToPath(path);
        }
    }
}
