// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using System.ComponentModel.DataAnnotations;
using QARvGut.Core.Extensions;
using QARvGut.Server.Attributes;

namespace QARvGut.Server.ViewModels.Account
{
    public class UserVM : UserBaseVM
    {
        public bool IsLockedOut { get; set; }

        [MinimumCount(1, ErrorMessage = "Roles cannot be empty")]
        public string[]? Roles { get; set; }
    }

    public class UserEditVM : UserBaseVM
    {
        public string? CurrentPassword { get; set; }

        [MinLength(6, ErrorMessage = "New Password must be at least 6 characters")]
        public string? NewPassword { get; set; }

        [MinimumCount(1, false, ErrorMessage = "Roles cannot be empty")]
        public string[]? Roles { get; set; }
    }

    public class UserPatchVM
    {
        public string? FullName { get; set; }

        public string? JobTitle { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Configuration { get; set; }

        // Enhanced User Management Fields
        public string? Department { get; set; }

        public string? Phone { get; set; }

        public string? ContactInfo { get; set; }

        public string? Preferences { get; set; }

        public bool? IsActive { get; set; }
    }

    public abstract class UserBaseVM : ISanitizeModel
    {
        public virtual void SanitizeModel()
        {
            Id = Id.NullIfWhiteSpace();
            FullName = FullName.NullIfWhiteSpace();
            JobTitle = JobTitle.NullIfWhiteSpace();
            PhoneNumber = PhoneNumber.NullIfWhiteSpace();
            Configuration = Configuration.NullIfWhiteSpace();
            Department = Department.NullIfWhiteSpace();
            Phone = Phone.NullIfWhiteSpace();
            ContactInfo = ContactInfo.NullIfWhiteSpace();
            Preferences = Preferences.NullIfWhiteSpace();
            Avatar = Avatar.NullIfWhiteSpace();
        }

        public string? Id { get; set; }

        [Required(ErrorMessage = "Username is required"),
         StringLength(200, MinimumLength = 2, ErrorMessage = "Username must be between 2 and 200 characters")]
        public required string UserName { get; set; }

        public string? FullName { get; set; }

        [Required(ErrorMessage = "Email is required"),
         StringLength(200, ErrorMessage = "Email must be at most 200 characters"),
         EmailAddress(ErrorMessage = "Invalid email address")]
        public required string Email { get; set; }

        public string? JobTitle { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Configuration { get; set; }

        public bool IsEnabled { get; set; }

        // Business Object Aligned Fields - User entity
        public string? Department { get; set; }

        public string? Phone { get; set; }

        public string? ContactInfo { get; set; }

        public string? Preferences { get; set; }

        public DateTime? LastLoginDate { get; set; }

        public string? LastLoginIp { get; set; }

        public int LoginCount { get; set; }

        public bool IsActive { get; set; }

        public DateTime? GesperrtSeit { get; set; } // When user was locked

        public string? Avatar { get; set; } // Profile image
    }

    // Enhanced User Management ViewModels - Aligned with Business Objects
    public class UserProfileUpdateVM
    {
        public string? Department { get; set; }
        public string? Phone { get; set; }
        public string? ContactInfo { get; set; }
        public string? Preferences { get; set; }
        public bool? IsActive { get; set; }
        public string? Avatar { get; set; }
        public DateTime? GesperrtSeit { get; set; }
    }

    public class UserActivityVM
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public string? LastLoginIp { get; set; } // From LastLogin business object
        public int LoginCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime? GesperrtSeit { get; set; }
    }

    public class UserActivitySummaryVM
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? FullName { get; set; }
        public string? Department { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public int LoginCount { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserImportVM
    {
        [Required]
        public required string UserName { get; set; }
        
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        
        public string? FullName { get; set; }
        public string? Department { get; set; }
        public string? Phone { get; set; }
        public string? JobTitle { get; set; }
        public string[]? Roles { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class BulkRoleAssignmentVM
    {
        [Required]
        public required string[] UserIds { get; set; }
        
        [Required]
        public required string[] Roles { get; set; }
    }

    public class BulkActivationVM
    {
        [Required]
        public required string[] UserIds { get; set; }
        
        public bool IsActive { get; set; }
    }

    public class BulkOperationResultVM
    {
        public int SuccessCount { get; set; }
        public int FailureCount { get; set; }
        public List<string> Errors { get; set; } = new();
        public List<string> SuccessfulUserIds { get; set; } = new();
        public List<string> FailedUserIds { get; set; } = new();
    }
}
