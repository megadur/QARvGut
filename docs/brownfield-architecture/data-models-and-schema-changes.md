# Data Models and Schema Changes

### New Data Models

#### Enhanced User Profile Fields
**Purpose:** Extended user information for comprehensive administration
**Integration:** Extensions to existing ApplicationUser entity in QARvGut.Core.Models.Account

**Key Attributes:**
- Department: string (nullable) - User's department assignment
- Phone: string (nullable) - Contact phone number  
- ContactInfo: string (nullable) - Additional contact information
- Preferences: JSON field (nullable) - User preference storage
- LastLoginDate: DateTime (nullable) - Activity tracking
- LoginCount: int (default 0) - Login frequency tracking
- IsActive: bool (default true) - Account status management

**Relationships:**
- **With Existing:** Extends ApplicationUser, maintains all existing relationships with ApplicationRole, orders, etc.
- **With New:** No new entity relationships required

#### User Activity Tracking
**Purpose:** Audit trail and user activity monitoring
**Integration:** Embedded fields in User entity rather than separate table for simplicity

**Key Attributes:**
- CreatedDate: DateTime - Account creation timestamp
- ModifiedDate: DateTime - Last profile modification
- LastLoginDate: DateTime - Most recent login
- LoginCount: int - Total login attempts

**Relationships:**
- **With Existing:** Part of extended ApplicationUser entity
- **With New:** No separate relationships needed

### Schema Integration Strategy

**Database Changes Required:**
- **New Tables:** None - extending existing ApplicationUser table
- **Modified Tables:** ApplicationUser (add profile and activity fields)
- **New Indexes:** Department, IsActive, LastLoginDate for efficient searching
- **Migration Strategy:** Single additive migration with nullable fields for backward compatibility

**Backward Compatibility:**
- All new fields are nullable to support existing data
- No changes to existing fields or relationships
- Existing authentication and authorization queries unaffected
