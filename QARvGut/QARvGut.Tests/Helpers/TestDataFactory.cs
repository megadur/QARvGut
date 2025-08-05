using System;
using System.Collections.Generic;
using QARvGut.Core.Models.Account;

namespace QARvGut.Tests.Helpers
{
    /// <summary>
    /// Test data factory for creating test instances of domain entities
    /// Used for Story 1.1 testing
    /// </summary>
    public static class TestDataFactory
    {
        public static ApplicationUser CreateTestUser(string userName = "testuser", string email = "test@example.com")
        {
            return new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = userName,
                Email = email,
                EmailConfirmed = true,
                FullName = $"Test {userName}",
                JobTitle = "Test Job",
                Department = "Test Department",
                Phone = "+49 123 456789",
                ContactInfo = "Test contact info",
                Preferences = """{"theme": "light", "language": "en"}""",
                IsActive = true,
                IsEnabled = true,
                LoginCount = 0,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                CreatedBy = "test-admin",
                UpdatedBy = "test-admin"
            };
        }

        public static List<ApplicationUser> CreateTestUsers(int count)
        {
            var users = new List<ApplicationUser>();
            for (int i = 1; i <= count; i++)
            {
                users.Add(CreateTestUser($"testuser{i}", $"test{i}@example.com"));
            }
            return users;
        }

        public static ApplicationUser CreateGutachterUser()
        {
            var user = CreateTestUser("gutachter1", "gutachter@example.com");
            user.JobTitle = "Gutachter";
            user.Department = "Assessment Department";
            user.FullName = "Dr. Max Gutachter";
            return user;
        }

        public static ApplicationUser CreateMitarbeiterUser()
        {
            var user = CreateTestUser("mitarbeiter1", "mitarbeiter@example.com");
            user.JobTitle = "Mitarbeiter";
            user.Department = "Support Department";
            user.FullName = "Anna Mitarbeiter";
            return user;
        }

        public static ApplicationUser CreateAdministratorUser()
        {
            var user = CreateTestUser("admin1", "admin@example.com");
            user.JobTitle = "Administrator";
            user.Department = "IT Department";
            user.FullName = "System Administrator";
            return user;
        }

        public static ApplicationUser CreateInactiveUser()
        {
            var user = CreateTestUser("inactive1", "inactive@example.com");
            user.IsActive = false;
            user.GesperrtSeit = DateTime.UtcNow.AddDays(-7);
            return user;
        }

        public static ApplicationUser CreateUserWithLoginHistory()
        {
            var user = CreateTestUser("loginhistory", "loginhistory@example.com");
            user.LoginCount = 15;
            user.LastLoginDate = DateTime.UtcNow.AddHours(-2);
            user.LastLoginIp = "192.168.1.100";
            return user;
        }

        /// <summary>
        /// Creates test data for business object validation
        /// Tests alignment with CSV specification
        /// </summary>
        public static ApplicationUser CreateBusinessObjectAlignedUser()
        {
            return new ApplicationUser
            {
                Id = "550e8400-e29b-41d4-a716-446655440000", // Fixed UUID format
                UserName = "business.user",
                Email = "business.user@rvgutachten.de",
                EmailConfirmed = true,
                
                // Core fields
                FullName = "Dr. Business User",
                JobTitle = "Senior Gutachter",
                
                // Business object aligned fields
                Department = "Gutachten Abteilung",
                Phone = "+49 30 12345678",
                ContactInfo = "Hauptgebäude, Raum 201",
                Preferences = """
                {
                    "notifications": {
                        "email": true,
                        "assignments": true,
                        "deadlines": true
                    },
                    "ui": {
                        "theme": "professional",
                        "language": "de",
                        "timezone": "Europe/Berlin"
                    }
                }
                """,
                
                // Status and activity fields
                IsActive = true,
                LoginCount = 42,
                LastLoginDate = DateTime.UtcNow.AddMinutes(-30),
                LastLoginIp = "10.0.1.42",
                
                // Audit fields
                CreatedDate = DateTime.UtcNow.AddMonths(-3),
                UpdatedDate = DateTime.UtcNow.AddDays(-1),
                CreatedBy = "system-import",
                UpdatedBy = "profile-update",
                
                // Profile image
                Avatar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // Truncated base64
            };
        }
    }
}
