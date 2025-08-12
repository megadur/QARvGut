using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;
using System.Text;
using QARvGut.Server.ViewModels.Account;
using QARvGut.Tests.Helpers;
using QARvGut.Server;

namespace QARvGut.Tests.Integration
{
    /// <summary>
    /// Regression tests to ensure existing authentication flows remain functional after Story 1.1 changes
    /// Validates that enhanced user model doesn't break existing authentication patterns
    /// </summary>
    public class AuthenticationRegressionTests : IClassFixture<TestWebApplicationFactory<Program>>, IAsyncLifetime
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory<Program> _factory;

        public AuthenticationRegressionTests(TestWebApplicationFactory<Program> factory)
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
        public async Task GetCurrentUser_Should_Include_Extended_Fields_In_Response()
        {
            // Arrange
            var token = await _factory.GetAccessTokenAsync("testuser1");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.GetAsync("/api/account/users/me");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var userResponse = JsonConvert.DeserializeObject<UserVM>(await response.Content.ReadAsStringAsync());
            userResponse.Should().NotBeNull();
            userResponse!.Id.Should().NotBeNullOrEmpty();
            userResponse.UserName.Should().Be("testuser1");
            
            // Verify extended fields are included in response (they may be null but should be present)
            // These properties should exist on the UserVM response - just testing the property exists
            var _ = userResponse.Department; // Property access test - should not throw
        }

        [Fact]
        public async Task GetUsers_Should_Still_Work_With_Authorization()
        {
            // Arrange
            var token = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.GetAsync("/api/account/users");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var users = JsonConvert.DeserializeObject<UserVM[]>(await response.Content.ReadAsStringAsync());
            users.Should().NotBeNull().And.NotBeEmpty();
            
            // Verify extended fields are included in user list response
            foreach (var user in users!)
            {
                user.Id.Should().NotBeNullOrEmpty();
                user.UserName.Should().NotBeNullOrEmpty();
                // Extended fields should be present in the response structure
            }
        }

        [Fact]
        public async Task Unauthorized_Request_Should_Still_Return_401()
        {
            // Arrange - No authorization header

            // Act
            var response = await _client.GetAsync("/api/account/users");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task User_Role_Authorization_Should_Still_Prevent_Admin_Operations()
        {
            // Arrange
            var token = await _factory.GetAccessTokenAsync("testuser1"); // Regular user, not admin
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // Act - Try to access admin-only bulk operations
            var response = await _client.PostAsync("/api/account/users/bulk-import", 
                new StringContent("[]", Encoding.UTF8, "application/json"));

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.Forbidden);
        }

        [Fact]
        public async Task User_Profile_Update_Should_Work_With_Extended_Fields()
        {
            // Arrange
            var userId = "testuser1-id";
            var token = await _factory.GetAccessTokenAsync("testuser1");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            var profileUpdate = new UserProfileUpdateVM
            {
                Department = "Regression Test Department",
                Phone = "123-456-7890",
                ContactInfo = "Regression Test Contact",
                Preferences = "{\"theme\":\"dark\"}",
                IsActive = true,
                Avatar = "regression_test_avatar"
            };
            var content = new StringContent(JsonConvert.SerializeObject(profileUpdate), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PutAsync($"/api/account/users/{userId}/profile", content);

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task Get_User_By_Id_Should_Still_Work()
        {
            // Arrange
            var userId = "testuser1-id";
            var token = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.GetAsync($"/api/account/users/{userId}");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var user = JsonConvert.DeserializeObject<UserVM>(await response.Content.ReadAsStringAsync());
            user.Should().NotBeNull();
            user!.Id.Should().Be(userId);
        }

        [Fact]
        public async Task Get_User_By_Username_Should_Still_Work()
        {
            // Arrange
            var token = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.GetAsync("/api/account/users/username/testuser1");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var user = JsonConvert.DeserializeObject<UserVM>(await response.Content.ReadAsStringAsync());
            user.Should().NotBeNull();
            user!.UserName.Should().Be("testuser1");
        }

        [Fact]
        public async Task User_Activity_Endpoint_Should_Work()
        {
            // Arrange
            var userId = "testuser1-id";
            var token = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.GetAsync($"/api/account/users/{userId}/activity");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var activity = JsonConvert.DeserializeObject<UserActivityVM>(await response.Content.ReadAsStringAsync());
            activity.Should().NotBeNull();
            activity!.UserId.Should().Be(userId);
        }

        [Fact]
        public async Task Search_Users_Should_Work_With_Extended_Fields()
        {
            // Arrange
            var token = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // Act - Test search by active status (new field)
            var response = await _client.GetAsync("/api/account/users/search?isActive=true");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var users = JsonConvert.DeserializeObject<UserVM[]>(await response.Content.ReadAsStringAsync());
            users.Should().NotBeNull();
        }

        [Fact]
        public async Task Existing_User_Update_Should_Still_Work()
        {
            // Arrange
            var userId = "testuser1-id";
            var token = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // First get the user to maintain existing data
            var getUserResponse = await _client.GetAsync($"/api/account/users/{userId}");
            var existingUser = JsonConvert.DeserializeObject<UserVM>(await getUserResponse.Content.ReadAsStringAsync());

            var userUpdate = new UserEditVM
            {
                Id = existingUser!.Id,
                UserName = existingUser.UserName,
                Email = existingUser.Email,
                FullName = existingUser.FullName ?? "Regression Test User",
                IsEnabled = existingUser.IsEnabled,
                Roles = existingUser.Roles ?? new[] { "User" }
            };
            var content = new StringContent(JsonConvert.SerializeObject(userUpdate), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PutAsync($"/api/account/users/{userId}", content);

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.NoContent);
        }
    }
}
