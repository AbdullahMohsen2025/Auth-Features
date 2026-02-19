using System.Reflection;
using UAEPassPOC.API.Extensions;
using UAEPassPOC.API.Services;

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container
    builder.Services.AddControllers();
    builder.Services.AddSwaggerGen();

    // Register UAE Pass as a reusable, injectable service (reads "UaePass" from config)
    builder.Services.AddUaePass(builder.Configuration);

    // Add CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAngular",
            policy =>
            {
                policy.WithOrigins("http://localhost:4200")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
    });

    var app = builder.Build();

    // Configure the HTTP request pipeline
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors("AllowAngular");

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (ReflectionTypeLoadException ex)
{
    Console.WriteLine("=== REFLECTION TYPE LOAD EXCEPTION ===");
    Console.WriteLine($"Message: {ex.Message}");
    Console.WriteLine("\n=== LOADER EXCEPTIONS ===");
    
    if (ex.LoaderExceptions != null)
    {
        foreach (var loaderEx in ex.LoaderExceptions)
        {
            Console.WriteLine($"\n- {loaderEx?.Message}");
            if (loaderEx is FileNotFoundException fileNotFound)
            {
                Console.WriteLine($"  Assembly: {fileNotFound.FileName}");
                Console.WriteLine($"  FusionLog: {fileNotFound.FusionLog}");
            }
        }
    }
    
    Console.WriteLine("\n=== PRESS ANY KEY TO EXIT ===");
    Console.ReadKey();
    throw;
}
catch (Exception ex)
{
    Console.WriteLine("=== GENERAL EXCEPTION ===");
    Console.WriteLine($"Type: {ex.GetType().Name}");
    Console.WriteLine($"Message: {ex.Message}");
    Console.WriteLine($"StackTrace: {ex.StackTrace}");
    Console.WriteLine("\n=== PRESS ANY KEY TO EXIT ===");
    Console.ReadKey();
    throw;
}
