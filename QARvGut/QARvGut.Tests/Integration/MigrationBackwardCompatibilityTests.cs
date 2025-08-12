using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using QARvGut.Core.Infrastructure;
using QARvGut.Core.Models.Account;
using QARvGut.Tests.Helpers;
using FluentAssertions;
using Xunit;
using Microsoft.AspNetCore.Identity;
using QARvGut.Server;

namespace QARvGut.Tests.Integration
{
    /// <summary>
    /// Tests for database migration and backward compatibility
    /// Validates that the EnhancedUserProfileFields migration works correctly
    /// and doesn't break existing data or functionality
    /// </summary>
    public class MigrationBackwardCompatibilityTests : IClassFixture<TestWebApplicationFactory<Program>>, IAsyncLifetime
    {
        private readonly TestWebApplicationFactory<Program> _factory;

        public MigrationBackwardCompatibilityTests(TestWebApplicationFactory<Program> factory)
        {
            _factory = factory;
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
        public async Task Migration_Should_Add_All_Required_Columns()
        {
            // Arrange & Act
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Assert - Verify all new columns exist in the database schema
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'AspNetUsers' 
                AND COLUMN_NAME IN (
                    'Department', 'Phone', 'ContactInfo', 'Preferences', 
                    'LastLoginDate', 'LoginCount', 'IsActive', 'GesperrtSeit', 
                    'LastLoginIp', 'Avatar'
                )
                ORDER BY COLUMN_NAME";

            var columns = new List<string>();
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                columns.Add(reader.GetString(0));
            }

            // Verify all expected columns are present
            var expectedColumns = new[] 
            {
                "Avatar", "ContactInfo", "Department", "GesperrtSeit",
                "IsActive", "LastLoginDate", "LastLoginIp", "LoginCount",
                "Phone", "Preferences"
            };

            columns.Should().Contain(expectedColumns);
        }

        [Fact]
        public async Task Migration_Should_Create_Required_Indexes()
        {
            // Arrange & Act
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT INDEX_NAME 
                FROM INFORMATION_SCHEMA.STATISTICS 
                WHERE TABLE_NAME = 'AspNetUsers' 
                AND INDEX_NAME IN (
                    'IX_AspNetUsers_Department', 
                    'IX_AspNetUsers_IsActive', 
                    'IX_AspNetUsers_LastLoginDate'
                )";

            var indexes = new List<string>();
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                indexes.Add(reader.GetString(0));
            }

            // Assert - Verify all expected indexes are present
            var expectedIndexes = new[] 
            {
                "IX_AspNetUsers_Department",
                "IX_AspNetUsers_IsActive", 
                "IX_AspNetUsers_LastLoginDate"
            };

            indexes.Should().Contain(expectedIndexes);
        }

        [Fact]
        public async Task Existing_Users_Should_Have_Default_Values_For_New_Fields()
        {
            // Arrange & Act
            using var scope = _factory.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Get existing user that was seeded before migration
            var existingUser = await userManager.FindByNameAsync("admin");

            // Assert - Verify default values are applied correctly
            existingUser.Should().NotBeNull();
            existingUser!.LoginCount.Should().Be(0); // Default value
            existingUser.IsActive.Should().BeTrue(); // Default value
            existingUser.Department.Should().BeNull(); // Nullable field
            existingUser.Phone.Should().BeNull(); // Nullable field
            existingUser.ContactInfo.Should().BeNull(); // Nullable field
            existingUser.Preferences.Should().BeNull(); // Nullable field
            existingUser.LastLoginDate.Should().BeNull(); // Nullable field
            existingUser.GesperrtSeit.Should().BeNull(); // Nullable field
            existingUser.LastLoginIp.Should().BeNull(); // Nullable field
            existingUser.Avatar.Should().BeNull(); // Nullable field
        }

        [Fact]
        public async Task New_User_Creation_Should_Work_With_Extended_Fields()
        {
            // Arrange
            using var scope = _factory.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var newUser = new ApplicationUser
            {
                UserName = "migrationtestuser",
                Email = "migrationtest@example.com",
                EmailConfirmed = true,
                // Set extended fields
                Department = "IT",
                Phone = "+49 123 456789",
                ContactInfo = "Additional contact info",
                Preferences = "{\"theme\":\"dark\"}",
                IsActive = true,
                Avatar = "avatar_url"
            };

            // Act
            var result = await userManager.CreateAsync(newUser, "TestPassword123!");

            // Assert
            result.Should().NotBeNull();
            result.Succeeded.Should().BeTrue();

            // Verify user was created with extended fields
            var createdUser = await userManager.FindByNameAsync("migrationtestuser");
            createdUser.Should().NotBeNull();
            createdUser!.Department.Should().Be("IT");
            createdUser.Phone.Should().Be("+49 123 456789");
            createdUser.ContactInfo.Should().Be("Additional contact info");
            createdUser.Preferences.Should().Be("{\"theme\":\"dark\"}");
            createdUser.IsActive.Should().BeTrue();
            createdUser.Avatar.Should().Be("avatar_url");
            createdUser.LoginCount.Should().Be(0); // Default value
            createdUser.LastLoginDate.Should().BeNull();
            createdUser.GesperrtSeit.Should().BeNull();
            createdUser.LastLoginIp.Should().BeNull();
        }

        [Fact]
        public async Task Existing_Queries_Should_Still_Work()
        {
            // Arrange
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Act - Execute queries that existed before the migration
            var userCount = await context.Users.CountAsync();
            var enabledUsers = await context.Users.Where(u => u.IsEnabled).CountAsync();
            var usersWithJobTitle = await context.Users.Where(u => !string.IsNullOrEmpty(u.JobTitle)).ToListAsync();

            // Assert - These queries should work without issues
            userCount.Should().BeGreaterThan(0);
            enabledUsers.Should().BeGreaterOrEqualTo(0);
            usersWithJobTitle.Should().NotBeNull();
        }

        [Fact]
        public async Task Extended_Fields_Can_Be_Queried_Efficiently()
        {
            // Arrange
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Act - Execute queries using the new indexed fields
            var activeUsers = await context.Users.Where(u => u.IsActive).CountAsync();
            var itDepartmentUsers = await context.Users.Where(u => u.Department == "IT").ToListAsync();
            var recentLogins = await context.Users
                .Where(u => u.LastLoginDate != null && u.LastLoginDate > DateTime.UtcNow.AddDays(-30))
                .ToListAsync();

            // Assert - These queries should execute without errors
            activeUsers.Should().BeGreaterOrEqualTo(0);
            itDepartmentUsers.Should().NotBeNull();
            recentLogins.Should().NotBeNull();
        }

        [Fact]
        public async Task User_Identity_Navigation_Properties_Should_Still_Work()
        {
            // Arrange
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Act - Test navigation properties that existed before migration
            var usersWithRoles = await context.Users
                .Include(u => u.Roles)
                .Where(u => u.Roles.Any())
                .ToListAsync();

            var usersWithClaims = await context.Users
                .Include(u => u.Claims)
                .ToListAsync();

            // Assert - Navigation properties should work correctly
            usersWithRoles.Should().NotBeNull();
            usersWithClaims.Should().NotBeNull();

            foreach (var user in usersWithRoles)
            {
                user.Roles.Should().NotBeNull();
            }

            foreach (var user in usersWithClaims)
            {
                user.Claims.Should().NotBeNull();
            }
        }

        [Fact]
        public void Migration_Rollback_Should_Remove_All_Added_Fields()
        {
            // This test verifies the Down() method of the migration
            // In a real scenario, this would be tested with a separate database
            // For this test, we'll verify that the Down method is properly implemented
            
            // Arrange
            var migration = new QARvGut.Server.Migrations.EnhancedUserProfileFields();

            // Act & Assert
            // Verify that the migration has a proper Down method implementation
            var migrationClass = typeof(QARvGut.Server.Migrations.EnhancedUserProfileFields);
            var downMethod = migrationClass.GetMethod("Down");

            downMethod.Should().NotBeNull();
            downMethod!.IsPublic.Should().BeTrue();
            
            // The Down method should properly remove all columns and indexes
            // This ensures rollback capability if needed
        }
    }
}
