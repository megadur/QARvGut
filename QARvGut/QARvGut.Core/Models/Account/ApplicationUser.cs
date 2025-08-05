// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.AspNetCore.Identity;
using QARvGut.Core.Models.Shop;

namespace QARvGut.Core.Models.Account
{
    public class ApplicationUser : IdentityUser, IAuditableEntity
    {
        public virtual string? FriendlyName
        {
            get
            {
                var friendlyName = string.IsNullOrWhiteSpace(FullName) ? UserName : FullName;

                if (!string.IsNullOrWhiteSpace(JobTitle))
                    friendlyName = $"{JobTitle} {friendlyName}";

                return friendlyName;
            }
        }

        public string? JobTitle { get; set; }
        public string? FullName { get; set; }
        public string? Configuration { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsLockedOut => LockoutEnabled && LockoutEnd >= DateTimeOffset.UtcNow;

        // Business Object Aligned Fields - User entity
        public string? Department { get; set; }
        public string? Phone { get; set; }
        public string? ContactInfo { get; set; }
        public string? Preferences { get; set; } // JSON field for user preferences (UserSetting)
        public DateTime? LastLoginDate { get; set; }
        public string? LastLoginIp { get; set; } // IP address from LastLogin object
        public int LoginCount { get; set; } = 0;
        public bool IsActive { get; set; } = true; // Corresponds to status field
        public DateTime? GesperrtSeit { get; set; } // When user was locked/blocked
        public string? Avatar { get; set; } // Profile image as base64 or URL

        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        /// <summary>
        /// Navigation property for the roles this user belongs to.
        /// </summary>
        public ICollection<IdentityUserRole<string>> Roles { get; } = [];

        /// <summary>
        /// Navigation property for the claims this user possesses.
        /// </summary>
        public ICollection<IdentityUserClaim<string>> Claims { get; } = [];

        /// <summary>
        /// Demo Navigation property for orders this user has processed
        /// </summary>
        public ICollection<Order> Orders { get; } = [];
    }
}
