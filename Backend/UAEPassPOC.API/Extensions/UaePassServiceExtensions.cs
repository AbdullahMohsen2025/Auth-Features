using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UAEPassPOC.API.Configuration;
using UAEPassPOC.API.Services;

namespace UAEPassPOC.API.Extensions;

/// <summary>
/// Register UAE Pass as a reusable, injectable service in any .NET app.
/// </summary>
public static class UaePassServiceExtensions
{
    /// <summary>
    /// Adds UAE Pass services. Config is read from the "UaePass" section.
    /// </summary>
    /// <param name="services">Service collection</param>
    /// <param name="configuration">Configuration (e.g. builder.Configuration)</param>
    /// <returns>Same service collection for chaining</returns>
    public static IServiceCollection AddUaePass(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<UaePassSettings>(configuration.GetSection("UaePass"));
        services.AddScoped<UaePassClient>();
        services.AddScoped<IUaePassService, UaePassService>();
        return services;
    }
}
