using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using QARvGut.Core.Infrastructure;
using QARvGut.Core.Models.Account;
using QARvGut.Core.Services;
using QARvGut.Core.Services.Account;
using QARvGut.Core.Services.Shop;
using QARvGut.Server.Authorization;
using QARvGut.Server.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Routing;

namespace QARvGut.Tests.Helpers
{
    public class TestStartup
    {
        public TestStartup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Get the shared database name from configuration
            var databaseName = Configuration["TestDatabaseName"] ?? $"InMemoryDbForTesting_{Guid.NewGuid()}";
            
            // Add ApplicationDbContext using the shared in-memory database name
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseInMemoryDatabase(databaseName);
            });

            // Add Identity services
            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // Configure test authentication
            services.AddAuthentication("Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>("Test", options => { });

            // Add authorization with proper policies and handlers
            services.AddAuthorizationBuilder()
                .AddPolicy(AuthPolicies.ViewAllUsersPolicy, policy => policy.RequireAuthenticatedUser())
                .AddPolicy(AuthPolicies.ManageAllUsersPolicy, policy => policy.RequireAuthenticatedUser())
                .AddPolicy(AuthPolicies.ViewAllRolesPolicy, policy => policy.RequireAuthenticatedUser())
                .AddPolicy(AuthPolicies.ManageAllRolesPolicy, policy => policy.RequireAuthenticatedUser())
                .AddPolicy(AuthPolicies.AssignAllowedRolesPolicy, policy => policy.RequireAuthenticatedUser())
                .AddPolicy(AuthPolicies.ViewRoleByRoleNamePolicy, policy => policy.RequireAuthenticatedUser());

            // Add authorization handlers
            services.AddSingleton<IAuthorizationHandler, QARvGut.Server.Authorization.Requirements.ViewUserAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, QARvGut.Server.Authorization.Requirements.ManageUserAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, QARvGut.Server.Authorization.Requirements.ViewRoleAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, QARvGut.Server.Authorization.Requirements.AssignRolesAuthorizationHandler>();

            // Add controllers from the main server assembly
            services.AddControllers()
                .AddApplicationPart(typeof(QARvGut.Server.Controllers.UserAccountController).Assembly)
                .AddControllersAsServices();

            // Add AutoMapper
            services.AddAutoMapper(typeof(QARvGut.Server.Program));

            // Business Services
            services.AddScoped<IUserAccountService, UserAccountService>();
            services.AddScoped<IUserRoleService, UserRoleService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IOrdersService, OrdersService>();

            // Other Services
            services.AddScoped<IEmailSender, MockEmailSender>();
            services.AddScoped<IUserIdAccessor, UserIdAccessor>();

            // Mock database seeder
            services.AddTransient<IDatabaseSeeder, MockDatabaseSeeder>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }

    public class MockEmailSender : IEmailSender
    {
        public Task<(bool success, string? errorMsg)> SendEmailAsync(string recipientName, string recipientEmail, string subject, string body, bool isHtml = true)
        {
            return Task.FromResult((true, (string?)null));
        }

        public Task<(bool success, string? errorMsg)> SendEmailAsync(string senderName, string senderEmail, string recipientName, string recipientEmail, string subject, string body, bool isHtml = true)
        {
            return Task.FromResult((true, (string?)null));
        }
    }
}