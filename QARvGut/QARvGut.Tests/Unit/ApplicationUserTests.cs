using FluentAssertions;
using QARvGut.Core.Models.Account;
using QARvGut.Core.Models; // Correct using directive
using Xunit;

namespace QARvGut.Tests.Unit
{
    public class ApplicationUserTests
    {
        [Fact]
        public void ApplicationUser_Should_Implement_IAuditableEntity()
        {
            // Arrange & Act
            var user = new ApplicationUser();

            // Assert
            user.Should().BeAssignableTo<IAuditableEntity>();
        }

        [Fact]
        public void ApplicationUser_Should_Have_Default_Values()
        {
            // Arrange & Act
            var user = new ApplicationUser();

            // Assert
            user.LoginCount.Should().Be(0);
            user.IsActive.Should().BeTrue();
            user.IsEnabled.Should().BeFalse(); // Default from original model
            user.LastLoginDate.Should().BeNull();
            user.GesperrtSeit.Should().BeNull();
            user.Avatar.Should().BeNull();
        }

        [Theory]
        [InlineData("John Doe", "Manager", "Manager John Doe")]
        [InlineData("Jane Smith", null, "Jane Smith")]
        [InlineData("", "Director", "Director testuser")] // Corrected expected value
        [InlineData(null, "CEO", "CEO testuser")] // Corrected expected value
        public void FriendlyName_Should_Format_Correctly(string fullName, string jobTitle, string expected)
        {
            // Arrange
            var user = new ApplicationUser 
            { 
                UserName = "testuser",
                FullName = fullName,
                JobTitle = jobTitle
            };

            // Act
            var friendlyName = user.FriendlyName;

            // Assert
            friendlyName.Should().Be(expected);
        }

        [Fact]
        public void BusinessObjectFields_Should_Accept_Null_Values()
        {
            // Arrange & Act
            var user = new ApplicationUser
            {
                Department = null,
                Phone = null,
                ContactInfo = null,
                Preferences = null,
                LastLoginIp = null,
                Avatar = null
            };

            // Assert - Should not throw any exceptions
            user.Department.Should().BeNull();
            user.Phone.Should().BeNull();
            user.ContactInfo.Should().BeNull();
            user.Preferences.Should().BeNull();
            user.LastLoginIp.Should().BeNull();
            user.Avatar.Should().BeNull();
        }

        [Fact]
        public void BusinessObjectFields_Should_Store_Values_Correctly()
        {
            // Arrange
            var expectedDepartment = "IT Department";
            var expectedPhone = "+49 123 456789";
            var expectedContactInfo = "Additional contact information";
            var expectedPreferences = """{"theme": "dark", "language": "de"}""";
            var expectedLastLoginIp = "192.168.1.100";
            var expectedAvatar = "base64encodedimage";

            // Act
            var user = new ApplicationUser
            {
                Department = expectedDepartment,
                Phone = expectedPhone,
                ContactInfo = expectedContactInfo,
                Preferences = expectedPreferences,
                LastLoginIp = expectedLastLoginIp,
                Avatar = expectedAvatar
            };

            // Assert
            user.Department.Should().Be(expectedDepartment);
            user.Phone.Should().Be(expectedPhone);
            user.ContactInfo.Should().Be(expectedContactInfo);
            user.Preferences.Should().Be(expectedPreferences);
            user.LastLoginIp.Should().Be(expectedLastLoginIp);
            user.Avatar.Should().Be(expectedAvatar);
        }

        [Fact]
        public void LoginCount_Should_Increment()
        {
            // Arrange
            var user = new ApplicationUser();
            var initialCount = user.LoginCount;

            // Act
            user.LoginCount++;
            user.LoginCount++;

            // Assert
            user.LoginCount.Should().Be(initialCount + 2);
        }

        [Fact]
        public void LastLoginDate_Should_Accept_DateTime_Values()
        {
            // Arrange
            var user = new ApplicationUser();
            var loginDate = DateTime.UtcNow;

            // Act
            user.LastLoginDate = loginDate;

            // Assert
            user.LastLoginDate.Should().Be(loginDate);
        }

        [Fact]
        public void GesperrtSeit_Should_Represent_Lock_Timestamp()
        {
            // Arrange
            var user = new ApplicationUser();
            var lockTimestamp = DateTime.UtcNow;

            // Act
            user.GesperrtSeit = lockTimestamp;
            user.IsActive = false;

            // Assert
            user.GesperrtSeit.Should().Be(lockTimestamp);
            user.IsActive.Should().BeFalse();
        }

        [Fact]
        public void IAuditableEntity_Properties_Should_Be_Settable()
        {
            // Arrange
            var user = new ApplicationUser();
            var createdBy = "admin";
            var updatedBy = "system";
            var createdDate = DateTime.UtcNow.AddDays(-1);
            var updatedDate = DateTime.UtcNow;

            // Act
            user.CreatedBy = createdBy;
            user.UpdatedBy = updatedBy;
            user.CreatedDate = createdDate;
            user.UpdatedDate = updatedDate;

            // Assert
            user.CreatedBy.Should().Be(createdBy);
            user.UpdatedBy.Should().Be(updatedBy);
            user.CreatedDate.Should().Be(createdDate);
            user.UpdatedDate.Should().Be(updatedDate);
        }

        [Fact]
        public void Navigation_Properties_Should_Be_Initialized()
        {
            // Arrange & Act
            var user = new ApplicationUser();

            // Assert
            user.Roles.Should().NotBeNull().And.BeEmpty();
            user.Claims.Should().NotBeNull().And.BeEmpty();
            user.Orders.Should().NotBeNull().And.BeEmpty();
        }
    }
}
