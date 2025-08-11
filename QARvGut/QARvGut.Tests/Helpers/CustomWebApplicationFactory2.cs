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
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore;

namespace QARvGut.Tests.Helpers
{
    public class CustomWebApplicationFactory2<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
    {
        protected override IWebHostBuilder CreateWebHostBuilder()
        {
            return WebHost.CreateDefaultBuilder()
                .UseStartup<TestStartup>()
                .UseEnvironment("Testing");
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    { "Jwt:Key", "ThisIsATestKeyForJwtTokenGenerationInTestEnvironmentWithAtLeast32Characters" },
                    { "Jwt:Issuer", "TestIssuer" },
                    { "Jwt:Audience", "TestAudience" }
                });
            });
        }

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
                var logger = scopedServices.GetService<ILogger<CustomWebApplicationFactory2<TProgram>>>();
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