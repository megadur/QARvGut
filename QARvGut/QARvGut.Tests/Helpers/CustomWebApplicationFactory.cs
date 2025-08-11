using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using QARvGut.Core.Infrastructure;
using QARvGut.Core.Models.Account;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Configuration;
using QARvGut.Tests.Helpers;

namespace QARvGut.Server
{
    public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove ALL database-related services including seeder
                var descriptorsToRemove = services.Where(d => 
                    d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                    d.ServiceType == typeof(ApplicationDbContext) ||
                    (d.ServiceType.IsGenericType && d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>)) ||
                    d.ServiceType == typeof(DbContextOptions) ||
                    d.ImplementationType?.Name.Contains("ApplicationDbContext") == true ||
                    d.ServiceType.Name.Contains("DatabaseSeeder") ||
                    d.ImplementationType?.Name.Contains("DatabaseSeeder") == true
                ).ToList();

                foreach (var descriptor in descriptorsToRemove)
                {
                    services.Remove(descriptor);
                }

                // Remove OpenIddict services and authentication
                var servicesToRemove = services.Where(d =>
                    d.ServiceType.Name.Contains("OpenIddict") ||
                    d.ImplementationType?.Name.Contains("OpenIddict") == true ||
                    d.ServiceType.Name.Contains("Authentication") ||
                    d.ServiceType.Name.Contains("Identity") ||
                    d.ServiceType == typeof(Microsoft.AspNetCore.Authorization.IAuthorizationService)
                ).ToList();

                foreach (var descriptor in servicesToRemove)
                {
                    services.Remove(descriptor);
                }

                // Add ApplicationDbContext using ONLY in-memory database for testing
                services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                    options.UseInternalServiceProvider(null); // Use EF's internal service provider
                });

                // Configure authentication for testing
                services.AddAuthentication("Test")
                    .AddScheme<Microsoft.AspNetCore.Authentication.AuthenticationSchemeOptions, TestAuthenticationHandler>(
                        "Test", options => { });

                // Re-add Identity services to ensure they use the new context
                services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
                {
                    // Configure test-friendly identity options
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 6;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireLowercase = false;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

                // Re-add authorization
                services.AddAuthorizationBuilder();

                // Add a mock database seeder to avoid the error in Program.cs
                services.AddTransient<QARvGut.Core.Infrastructure.IDatabaseSeeder, MockDatabaseSeeder>();
            });

            builder.ConfigureAppConfiguration((context, config) =>
            {
                // Override configuration for testing
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    { "Jwt:Key", "ThisIsATestKeyForJwtTokenGenerationInTestEnvironmentWithAtLeast32Characters" },
                    { "Jwt:Issuer", "TestIssuer" },
                    { "Jwt:Audience", "TestAudience" }
                });
            });

            builder.UseEnvironment("Testing");
            
            // Override the application startup to skip seeding
            builder.UseSetting("SkipSeeding", "true");
        }

        //protected override void ConfigureWebHost(IWebHostBuilder builder)
        //{
        //    base.ConfigureWebHost(builder);
        //}

        public async Task InitializeAsync()
        {
            using var scope = Services.CreateScope();
            var scopedServices = scope.ServiceProvider;
            
            try
            {
                var db = scopedServices.GetRequiredService<ApplicationDbContext>();
                var userManager = scopedServices.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = scopedServices.GetRequiredService<RoleManager<ApplicationRole>>();

                // Ensure the database is created
                await db.Database.EnsureCreatedAsync();

                // Seed the database with test data
                await SeedData(db, userManager, roleManager);
            }
            catch (Exception ex)
            {
                var logger = scopedServices.GetService<ILogger<CustomWebApplicationFactory<TProgram>>>();
                logger?.LogError(ex, "An error occurred seeding the database with test messages. Error: {Message}", ex.Message);
                throw;
            }
        }
        private async Task SeedData(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            // Seed Roles
            if (!await roleManager.RoleExistsAsync("Admin"))
                await roleManager.CreateAsync(new ApplicationRole("Admin"));
            if (!await roleManager.RoleExistsAsync("User"))
                await roleManager.CreateAsync(new ApplicationRole("User"));
            if (!await roleManager.RoleExistsAsync("Manager"))
                await roleManager.CreateAsync(new ApplicationRole("Manager"));

            // Seed Users
            if (await userManager.FindByNameAsync("admin") == null)
            {
                var adminUser = new ApplicationUser { UserName = "admin", Email = "admin@test.com", EmailConfirmed = true, IsActive = true };
                await userManager.CreateAsync(adminUser, "P@ssword123");
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            if (await userManager.FindByNameAsync("testuser1") == null)
            {
                var testUser1 = new ApplicationUser { Id = "testuser1-id", UserName = "testuser1", Email = "testuser1@test.com", EmailConfirmed = true, IsActive = true, LoginCount = 10, LastLoginDate = DateTime.UtcNow.AddDays(-5), LastLoginIp = "127.0.0.1" };
                await userManager.CreateAsync(testUser1, "P@ssword123");
                await userManager.AddToRoleAsync(testUser1, "User");
            }

            if (await userManager.FindByNameAsync("testuser2") == null)
            {
                var testUser2 = new ApplicationUser { Id = "testuser2-id", UserName = "testuser2", Email = "testuser2@test.com", EmailConfirmed = true, IsActive = false, GesperrtSeit = DateTime.UtcNow.AddDays(-1) };
                await userManager.CreateAsync(testUser2, "P@ssword123");
                await userManager.AddToRoleAsync(testUser2, "User");
            }

            await context.SaveChangesAsync();
        }

        public async Task<string> GetAccessTokenAsync(string userName)
        {
            using (var scope = Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var user = await userManager.FindByNameAsync(userName);

                if (user == null)
                {
                    throw new Exception($"Test user '{userName}' not found.");
                }

                var roles = await userManager.GetRolesAsync(user);
                var permissions = new List<string>();
                
                // Add permissions based on roles (simplified for testing)
                if (roles.Contains("Admin"))
                {
                    permissions.AddRange(new[] { "users.view", "users.manage", "roles.view", "roles.manage" });
                }
                else if (roles.Contains("Manager"))
                {
                    permissions.AddRange(new[] { "users.view", "users.manage" });
                }
                else if (roles.Contains("User"))
                {
                    permissions.Add("users.view");
                }

                var testUser = new
                {
                    UserId = user.Id,
                    UserName = user.UserName ?? "",
                    Email = user.Email ?? "",
                    Roles = roles.ToList(),
                    Permissions = permissions
                };

                var json = System.Text.Json.JsonSerializer.Serialize(testUser);
                var tokenBytes = System.Text.Encoding.UTF8.GetBytes(json);
                return Convert.ToBase64String(tokenBytes);
            }
        }
    }
}