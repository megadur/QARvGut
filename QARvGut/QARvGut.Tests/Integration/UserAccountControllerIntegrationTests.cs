using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using QARvGut.Server.ViewModels.Account;
using Newtonsoft.Json;
using System.Text;
using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using QARvGut.Core.Models.Account;
using Microsoft.AspNetCore.Identity;
using QARvGut.Core.Infrastructure;
using System;
using System.Linq;
using QARvGut.Server;
using QARvGut.Tests.Helpers;

namespace QARvGut.Tests.Integration
{
    public class UserAccountControllerIntegrationTests : IClassFixture<TestWebApplicationFactory<Program>>, IAsyncLifetime
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory<Program> _factory;

        public UserAccountControllerIntegrationTests(TestWebApplicationFactory<Program> factory)
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
        public async Task UpdateUserProfile_Should_ReturnNoContent_WhenProfileUpdated()
        {
            // Arrange
            var userId = "testuser1-id"; // Assuming a test user exists
            var token = await _factory.GetAccessTokenAsync("testuser1");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            var profileUpdate = new UserProfileUpdateVM
            {
                Department = "New Department",
                Phone = "123-456-7890",
                ContactInfo = "New Contact Info",
                Preferences = "{\"theme\":\"light\"}",
                IsActive = true,
                Avatar = "new_avatar_url"
            };
            var content = new StringContent(JsonConvert.SerializeObject(profileUpdate), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PutAsync($"/api/account/users/{userId}/profile", content);

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.NoContent);

            // Verify the update
            var updatedUser = await GetUserByIdFromService(userId);
            updatedUser.Should().NotBeNull();
            updatedUser!.Department.Should().Be(profileUpdate.Department);
            updatedUser.Phone.Should().Be(profileUpdate.Phone);
            updatedUser.ContactInfo.Should().Be(profileUpdate.ContactInfo);
            updatedUser.Preferences.Should().Be(profileUpdate.Preferences);
            updatedUser.IsActive.Should().Be(profileUpdate.IsActive.Value);
            updatedUser.Avatar.Should().Be(profileUpdate.Avatar);
        }

        [Fact]
        public async Task GetUserActivity_Should_ReturnUserActivityVM()
        {
            // Arrange
            var userId = "testuser1-id"; // Assuming a test user exists
            var token = await _factory.GetAccessTokenAsync("testuser1");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.GetAsync($"/api/account/users/{userId}/activity");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var activity = JsonConvert.DeserializeObject<UserActivityVM>(await response.Content.ReadAsStringAsync());
            activity.Should().NotBeNull();
            activity.UserId.Should().Be(userId);
            activity.UserName.Should().NotBeNullOrEmpty();
            activity.LoginCount.Should().BeGreaterOrEqualTo(0);
        }

        [Fact]
        public async Task BulkImportUsers_Should_ImportUsersSuccessfully()
        {
            // Arrange
            var adminToken = await _factory.GetAccessTokenAsync("admin"); // Assuming an admin user
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {adminToken}");

            var usersToImport = new List<UserImportVM>
            {
                new UserImportVM { UserName = "bulkuser1", Email = "bulkuser1@test.com", FullName = "Bulk User One", IsActive = true, Roles = new[] { "User" } },
                new UserImportVM { UserName = "bulkuser2", Email = "bulkuser2@test.com", FullName = "Bulk User Two", IsActive = true, Roles = new[] { "User", "Manager" } }
            };
            var content = new StringContent(JsonConvert.SerializeObject(usersToImport), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/account/users/bulk-import", content);

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var result = JsonConvert.DeserializeObject<BulkOperationResultVM>(await response.Content.ReadAsStringAsync());
            result.Should().NotBeNull();
            result.SuccessCount.Should().Be(2);
            result.FailureCount.Should().Be(0);
            result.Errors.Should().BeEmpty();

            // Verify users are created
            var user1 = await GetUserByUserNameFromService("bulkuser1");
            user1.Should().NotBeNull();
            user1.Email.Should().Be("bulkuser1@test.com");
            (await GetUserRolesFromService(user1.Id)).Should().Contain("User");

            var user2 = await GetUserByUserNameFromService("bulkuser2");
            user2.Should().NotBeNull();
            user2.Email.Should().Be("bulkuser2@test.com");
            (await GetUserRolesFromService(user2.Id)).Should().Contain("User").And.Contain("Manager");
        }

        [Fact]
        public async Task BulkAssignRoles_Should_AssignRolesSuccessfully()
        {
            // Arrange
            var adminToken = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {adminToken}");

            // Create some users first
            var user1 = new ApplicationUser { UserName = "roleuser1", Email = "roleuser1@test.com", IsActive = true };
            var user2 = new ApplicationUser { UserName = "roleuser2", Email = "roleuser2@test.com", IsActive = true };
            await CreateUserInService(user1, "P@ssword123", new[] { "User" });
            await CreateUserInService(user2, "P@ssword123", new[] { "User" });

            var bulkAssignment = new BulkRoleAssignmentVM
            {
                UserIds = new[] { user1.Id, user2.Id },
                Roles = new[] { "Manager" }
            };
            var content = new StringContent(JsonConvert.SerializeObject(bulkAssignment), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/account/users/bulk-roles", content);

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var result = JsonConvert.DeserializeObject<BulkOperationResultVM>(await response.Content.ReadAsStringAsync());
            result.Should().NotBeNull();
            result.SuccessCount.Should().Be(2);
            result.FailureCount.Should().Be(0);

            // Verify roles are assigned
            var updatedUser1 = await GetUserByIdFromService(user1.Id);
            (await GetUserRolesFromService(updatedUser1.Id)).Should().Contain("Manager");
            var updatedUser2 = await GetUserByIdFromService(user2.Id);
            (await GetUserRolesFromService(updatedUser2.Id)).Should().Contain("Manager");
        }

        [Fact]
        public async Task BulkActivateUsers_Should_UpdateActivationStatusSuccessfully()
        {
            // Arrange
            var adminToken = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {adminToken}");

            // Create some users first
            var user1 = new ApplicationUser { UserName = "activeuser1", Email = "activeuser1@test.com", IsActive = true };
            var user2 = new ApplicationUser { UserName = "activeuser2", Email = "activeuser2@test.com", IsActive = false };
            await CreateUserInService(user1, "P@ssword123", new[] { "User" });
            await CreateUserInService(user2, "P@ssword123", new[] { "User" });

            var bulkActivation = new BulkActivationVM
            {
                UserIds = new[] { user1.Id, user2.Id },
                IsActive = false // Deactivate both
            };
            var content = new StringContent(JsonConvert.SerializeObject(bulkActivation), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/account/users/bulk-activate", content);

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var result = JsonConvert.DeserializeObject<BulkOperationResultVM>(await response.Content.ReadAsStringAsync());
            result.Should().NotBeNull();
            result.SuccessCount.Should().Be(2);
            result.FailureCount.Should().Be(0);

            // Verify activation status
            var updatedUser1 = await GetUserByIdFromService(user1.Id);
            updatedUser1.IsActive.Should().BeFalse();
            var updatedUser2 = await GetUserByIdFromService(user2.Id);
            updatedUser2.IsActive.Should().BeFalse();
        }

        [Fact]
        public async Task SearchUsers_Should_ReturnFilteredUsers()
        {
            // Arrange
            var adminToken = await _factory.GetAccessTokenAsync("admin");
            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {adminToken}");

            // Ensure test data exists
            await CreateUserInService(new ApplicationUser { UserName = "searchuser1", Email = "searchuser1@test.com", Department = "HR", IsActive = true }, "P@ssword123", new[] { "User" });
            await CreateUserInService(new ApplicationUser { UserName = "searchuser2", Email = "searchuser2@test.com", Department = "IT", IsActive = true }, "P@ssword123", new[] { "Admin" });
            await CreateUserInService(new ApplicationUser { UserName = "searchuser3", Email = "searchuser3@test.com", Department = "HR", IsActive = false }, "P@ssword123", new[] { "User" });

            // Act - Search by department and active status
            var response = await _client.GetAsync("/api/account/users/search?department=HR&isActive=true");

            // Assert
            response.Should().HaveStatusCode(System.Net.HttpStatusCode.OK);
            var users = JsonConvert.DeserializeObject<List<UserVM>>(await response.Content.ReadAsStringAsync());
            users.Should().NotBeNull().And.HaveCountGreaterOrEqualTo(1);
            users.Should().Contain(u => u.UserName == "searchuser1");

            // Act - Search by role
            response = await _client.GetAsync("/api/account/users/search?role=Admin");
            users = JsonConvert.DeserializeObject<List<UserVM>>(await response.Content.ReadAsStringAsync());
            users.Should().NotBeNull().And.HaveCountGreaterOrEqualTo(1);
            users.Should().Contain(u => u.UserName == "searchuser2" || u.UserName == "admin");
        }

        private async Task<ApplicationUser?> GetUserByIdFromService(string userId)
        {
            using (var scope = _factory.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                return await userManager.FindByIdAsync(userId);
            }
        }

        private async Task<ApplicationUser?> GetUserByUserNameFromService(string userName)
        {
            using (var scope = _factory.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                return await userManager.FindByNameAsync(userName);
            }
        }

        private async Task<IList<string>> GetUserRolesFromService(string userId)
        {
            using (var scope = _factory.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var user = await userManager.FindByIdAsync(userId);
                return user != null ? await userManager.GetRolesAsync(user) : new List<string>();
            }
        }

        private async Task CreateUserInService(ApplicationUser user, string password, string[] roles)
        {
            using (var scope = _factory.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

                // Ensure roles exist
                foreach (var roleName in roles)
                {
                    if (!await roleManager.RoleExistsAsync(roleName))
                    {
                        await roleManager.CreateAsync(new ApplicationRole(roleName));
                    }
                }

                var existingUser = await userManager.FindByNameAsync(user.UserName);
                if (existingUser == null)
                {
                    var result = await userManager.CreateAsync(user, password);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRolesAsync(user, roles);
                    }
                    else
                    {
                        throw new Exception($"Failed to create user {user.UserName}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
                else
                {
                    // Update the existing user's ID to match for testing
                    user.Id = existingUser.Id;
                    
                    // If user exists, ensure roles are assigned
                    var existingRoles = await userManager.GetRolesAsync(existingUser);
                    var rolesToAdd = roles.Except(existingRoles);
                    if (rolesToAdd.Any())
                    {
                        await userManager.AddToRolesAsync(existingUser, rolesToAdd);
                    }
                    // Update existing user properties if needed
                    existingUser.Department = user.Department;
                    existingUser.IsActive = user.IsActive;
                    await userManager.UpdateAsync(existingUser);
                }
            }
        }
    }
}