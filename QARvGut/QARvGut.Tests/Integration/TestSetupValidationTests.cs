using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using QARvGut.Core.Models.Account;
using Microsoft.AspNetCore.Identity;
using QARvGut.Server;
using QARvGut.Tests.Helpers;

namespace QARvGut.Tests.Integration
{
    public class TestSetupValidationTests : IClassFixture<TestWebApplicationFactory<Program>>, IAsyncLifetime
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory<Program> _factory;

        public TestSetupValidationTests(TestWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        public async Task InitializeAsync()
        {
            await _factory.InitializeAsync();
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task TestDatabaseConnection_Should_Work()
        {
            // Arrange & Act
            using var scope = _factory.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            
            // Assert
            userManager.Should().NotBeNull();
            
            // Verify test users exist
            var adminUser = await userManager.FindByNameAsync("admin");
            adminUser.Should().NotBeNull();
            adminUser!.Email.Should().Be("admin@test.com");
        }

        [Fact]
        public async Task TestAuthentication_Should_GenerateValidToken()
        {
            // Arrange & Act
            var token = await _factory.GetAccessTokenAsync("admin");
            
            // Assert
            token.Should().NotBeNullOrEmpty();
            
            // Test that the token works with an authenticated endpoint
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            
            // This should not fail due to authentication (might fail for other reasons)
            var response = await _client.GetAsync("/api/account/users/search");
            response.StatusCode.Should().NotBe(System.Net.HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task UnauthenticatedRequest_Should_ReturnUnauthorized()
        {
            // Arrange
            _client.DefaultRequestHeaders.Clear();
            
            // Act
            var response = await _client.GetAsync("/api/account/users/search");
            
            // Assert
            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
        }
    }
}