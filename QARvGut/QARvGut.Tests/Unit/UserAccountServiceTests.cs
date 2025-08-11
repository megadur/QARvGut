using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using QARvGut.Core.Infrastructure;
using QARvGut.Core.Models.Account;
using QARvGut.Core.Services.Account;
using Xunit;

namespace QARvGut.Tests.Unit
{
    /// <summary>
    /// Unit tests for UserAccountService bulk operations and enhanced functionality
    /// Tests Story 1.1 implementation
    /// </summary>
    public class UserAccountServiceTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly UserAccountService _service;
        private readonly ApplicationDbContext _dbContext; // Use concrete instance for in-memory DB

        public UserAccountServiceTests()
        {
            // Create mock UserManager
            var userStore = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                userStore.Object, null, null, null, null, null, null, null, null);

            // Create in-memory database context for testing
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            // Mock the IUserIdAccessor
            var mockUserIdAccessor = new Mock<QARvGut.Core.Services.Account.IUserIdAccessor>();

            _dbContext = new ApplicationDbContext(options, mockUserIdAccessor.Object);
            _dbContext.Database.EnsureCreated(); // Ensure the in-memory database is created

            _service = new UserAccountService(_dbContext, _mockUserManager.Object);
        }

        [Fact]
        public async Task UpdateLastLoginAsync_Should_Update_User_Login_Information()
        {
            // Arrange
            var userId = "test-user-id";
            var ipAddress = "192.168.1.100";
            var user = new ApplicationUser 
            { 
                Id = userId,
                LoginCount = 5,
                LastLoginDate = DateTime.UtcNow.AddDays(-1)
            };

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                           .ReturnsAsync(user);
            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
                           .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.UpdateLastLoginAsync(userId, ipAddress);

            // Assert
            Assert.True(result.Succeeded);
            Assert.Equal(6, user.LoginCount);
            Assert.Equal(ipAddress, user.LastLoginIp);
            Assert.True(user.LastLoginDate > DateTime.UtcNow.AddMinutes(-1)); // Recently updated
        }

        [Fact]
        public async Task UpdateLastLoginAsync_Should_Return_False_For_NonExistent_User()
        {
            // Arrange
            var userId = "non-existent-user";
            var ipAddress = "192.168.1.100";

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                           .ReturnsAsync((ApplicationUser)null);

            // Act
            var result = await _service.UpdateLastLoginAsync(userId, ipAddress);

            // Assert
            Assert.False(result.Succeeded);
            Assert.Contains("User not found", result.Errors);
        }

        [Fact]
        public async Task BulkImportUsersAsync_Should_Create_Users_With_Default_Values()
        {
            // Arrange
            var users = new List<ApplicationUser>
            {
                new ApplicationUser { UserName = "user1", Email = "user1@test.com" },
                new ApplicationUser { UserName = "user2", Email = "user2@test.com" }
            };
            var defaultRoles = new[] { "User", "Employee" };

            _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>()))
                           .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(x => x.AddToRolesAsync(It.IsAny<ApplicationUser>(), It.IsAny<IEnumerable<string>>()))
                           .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.BulkImportUsersAsync(users, defaultRoles);

            // Assert
            Assert.Equal(2, result.Succeeded);
            Assert.Equal(0, result.Failed);
            Assert.Empty(result.Errors);

            // Verify that users have correct default values
            foreach (var user in users)
            {
                Assert.True(user.IsActive);
                Assert.Equal(0, user.LoginCount);
                Assert.True(user.CreatedDate > DateTime.MinValue);
                Assert.True(user.UpdatedDate > DateTime.MinValue);
            }
        }

        [Fact]
        public async Task BulkAssignRolesAsync_Should_Assign_Roles_To_Users()
        {
            // Arrange
            var userIds = new[] { "user1", "user2" };
            var roles = new[] { "Manager", "Admin" };
            
            _mockUserManager.Setup(x => x.FindByIdAsync("user1"))
                           .ReturnsAsync(new ApplicationUser { Id = "user1", UserName = "user1" });
            _mockUserManager.Setup(x => x.FindByIdAsync("user2"))
                           .ReturnsAsync(new ApplicationUser { Id = "user2", UserName = "user2" });
            _mockUserManager.Setup(x => x.AddToRolesAsync(It.IsAny<ApplicationUser>(), roles))
                           .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.BulkAssignRolesAsync(userIds, roles);

            // Assert
            Assert.Equal(2, result.Succeeded);
            Assert.Equal(0, result.Failed);
            Assert.Empty(result.Errors);
        }

        [Fact]
        public async Task BulkActivateUsersAsync_Should_Update_User_Status()
        {
            // Arrange
            var userIds = new[] { "user1", "user2" };
            var user1 = new ApplicationUser { Id = "user1", UserName = "user1", IsActive = true };
            var user2 = new ApplicationUser { Id = "user2", UserName = "user2", IsActive = true };

            _mockUserManager.Setup(x => x.FindByIdAsync("user1")).ReturnsAsync(user1);
            _mockUserManager.Setup(x => x.FindByIdAsync("user2")).ReturnsAsync(user2);
            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
                           .ReturnsAsync(IdentityResult.Success);

            // Act - Deactivate users
            var result = await _service.BulkActivateUsersAsync(userIds, false);

            // Assert
            Assert.Equal(2, result.Succeeded);
            Assert.Equal(0, result.Failed);
            Assert.False(user1.IsActive);
            Assert.False(user2.IsActive);
            Assert.NotNull(user1.GesperrtSeit);
            Assert.NotNull(user2.GesperrtSeit);
        }

        [Fact]
        public async Task BulkActivateUsersAsync_Should_Clear_Lock_Timestamp_When_Reactivating()
        {
            // Arrange
            var userIds = new[] { "user1" };
            var user1 = new ApplicationUser 
            { 
                Id = "user1", 
                UserName = "user1", 
                IsActive = false,
                GesperrtSeit = DateTime.UtcNow.AddDays(-1)
            };

            _mockUserManager.Setup(x => x.FindByIdAsync("user1")).ReturnsAsync(user1);
            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
                           .ReturnsAsync(IdentityResult.Success);

            // Act - Reactivate user
            var result = await _service.BulkActivateUsersAsync(userIds, true);

            // Assert
            Assert.Equal(1, result.Succeeded);
            Assert.Equal(0, result.Failed);
            Assert.True(user1.IsActive);
            Assert.Null(user1.GesperrtSeit); // Should be cleared when reactivating
        }

        [Fact]
        public async Task BulkOperations_Should_Handle_Partial_Failures()
        {
            // Arrange
            var userIds = new[] { "user1", "non-existent-user", "user3" };
            var user1 = new ApplicationUser { Id = "user1", UserName = "user1" };
            var user3 = new ApplicationUser { Id = "user3", UserName = "user3" };

            _mockUserManager.Setup(x => x.FindByIdAsync("user1")).ReturnsAsync(user1);
            _mockUserManager.Setup(x => x.FindByIdAsync("non-existent-user")).ReturnsAsync((ApplicationUser)null);
            _mockUserManager.Setup(x => x.FindByIdAsync("user3")).ReturnsAsync(user3);
            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
                           .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.BulkActivateUsersAsync(userIds, true);

            // Assert
            Assert.Equal(2, result.Succeeded);
            Assert.Equal(1, result.Failed);
            Assert.Single(result.Errors);
            Assert.Contains("non-existent-user", result.Errors[0]);
        }
    }
}
