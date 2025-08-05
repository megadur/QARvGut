// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QARvGut.Core.Infrastructure;
using QARvGut.Core.Models.Account;

namespace QARvGut.Core.Services.Account
{
    public class UserAccountService : IUserAccountService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserAccountService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<ApplicationUser?> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<ApplicationUser?> GetUserByUserNameAsync(string userName)
        {
            return await _userManager.FindByNameAsync(userName);
        }

        public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<IList<string>> GetUserRolesAsync(ApplicationUser user)
        {
            return await _userManager.GetRolesAsync(user);
        }

        public async Task<(ApplicationUser User, string[] Roles)?> GetUserAndRolesAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Roles)
                .Where(u => u.Id == userId)
                .SingleOrDefaultAsync();

            if (user == null)
                return null;

            var userRoleIds = user.Roles.Select(r => r.RoleId).ToList();

            var roles = await _context.Roles
                .Where(r => userRoleIds.Contains(r.Id))
                .Select(r => r.Name!)
                .ToArrayAsync();

            return (user, roles);
        }

        public async Task<List<(ApplicationUser User, string[] Roles)>> GetUsersAndRolesAsync(int page, int pageSize)
        {
            IQueryable<ApplicationUser> usersQuery = _context.Users
                .Include(u => u.Roles)
                .OrderBy(u => u.UserName);

            if (page != -1)
                usersQuery = usersQuery.Skip((page - 1) * pageSize);

            if (pageSize != -1)
                usersQuery = usersQuery.Take(pageSize);

            var users = await usersQuery.ToListAsync();

            var userRoleIds = users.SelectMany(u => u.Roles.Select(r => r.RoleId)).ToList();

            var roles = await _context.Roles
                .Where(r => userRoleIds.Contains(r.Id))
                .ToArrayAsync();

            return users
                .Select(u => (u, roles.Where(r => u.Roles.Select(ur => ur.RoleId).Contains(r.Id)).Select(r => r.Name!)
                    .ToArray()))
                .ToList();
        }

        public async Task<(bool Succeeded, string[] Errors)> CreateUserAsync(ApplicationUser user,
            IEnumerable<string> roles, string password)
        {
            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return (false, result.Errors.Select(e => e.Description).ToArray());

            user = (await _userManager.FindByNameAsync(user.UserName!))!;

            try
            {
                result = await _userManager.AddToRolesAsync(user, roles.Distinct());
            }
            catch
            {
                await DeleteUserAsync(user);
                throw;
            }

            if (!result.Succeeded)
            {
                await DeleteUserAsync(user);
                return (false, result.Errors.Select(e => e.Description).ToArray());
            }

            return (true, []);
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdateUserAsync(ApplicationUser user)
        {
            return await UpdateUserAsync(user, null);
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdateUserAsync(ApplicationUser user,
            IEnumerable<string>? roles)
        {
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return (false, result.Errors.Select(e => e.Description).ToArray());

            if (roles != null)
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var rolesToRemove = userRoles.Except(roles).ToArray();
                var rolesToAdd = roles.Except(userRoles).Distinct().ToArray();

                if (rolesToRemove.Length != 0)
                {
                    result = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                    if (!result.Succeeded)
                        return (false, result.Errors.Select(e => e.Description).ToArray());
                }

                if (rolesToAdd.Length != 0)
                {
                    result = await _userManager.AddToRolesAsync(user, rolesToAdd);
                    if (!result.Succeeded)
                        return (false, result.Errors.Select(e => e.Description).ToArray());
                }
            }

            return (true, []);
        }

        public async Task<(bool Succeeded, string[] Errors)> ResetPasswordAsync(ApplicationUser user,
            string newPassword)
        {
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            var result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);
            return (result.Succeeded, result.Errors.Select(e => e.Description).ToArray());
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdatePasswordAsync(ApplicationUser user,
            string currentPassword, string newPassword)
        {
            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (!result.Succeeded)
                return (false, result.Errors.Select(e => e.Description).ToArray());

            return (true, []);
        }

        public async Task<bool> CheckPasswordAsync(ApplicationUser user, string password)
        {
            if (!await _userManager.CheckPasswordAsync(user, password))
            {
                if (!_userManager.SupportsUserLockout)
                    await _userManager.AccessFailedAsync(user);

                return false;
            }

            return true;
        }

        public async Task<(bool Success, string[] Errors)> TestCanDeleteUserAsync(string userId)
        {
            var errors = new List<string>();

            if (await _context.Orders.Where(o => o.CashierId == userId).AnyAsync())
                errors.Add("User has associated orders");

            //canDelete = !await ; //Do other tests...

            return (errors.Count == 0, errors.ToArray());
        }

        public async Task<(bool Succeeded, string[] Errors)> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
                return await DeleteUserAsync(user);

            return (true, []);
        }

        public async Task<(bool Succeeded, string[] Errors)> DeleteUserAsync(ApplicationUser user)
        {
            var result = await _userManager.DeleteAsync(user);
            return (result.Succeeded, result.Errors.Select(e => e.Description).ToArray());
        }

        // Enhanced User Management - Business Object Aligned Methods
        public async Task<List<(ApplicationUser User, string[] Roles)>> SearchUsersAsync(string? department, string? role, bool? isActive, int page, int pageSize)
        {
            var query = _context.Users.Include(u => u.Roles).AsQueryable();

            // Apply filters based on business object requirements
            if (!string.IsNullOrEmpty(department))
                query = query.Where(u => u.Department == department);

            if (isActive.HasValue)
                query = query.Where(u => u.IsActive == isActive.Value);

            // Apply pagination
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new List<(ApplicationUser User, string[] Roles)>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                
                // Filter by role if specified
                if (!string.IsNullOrEmpty(role) && !roles.Contains(role))
                    continue;
                    
                result.Add((user, roles.ToArray()));
            }

            return result;
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdateLastLoginAsync(string userId, string ipAddress)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return (false, new[] { "User not found" });

            // Update LastLogin information as per business object specification
            user.LastLoginDate = DateTime.UtcNow;
            user.LastLoginIp = ipAddress;
            user.LoginCount++;

            var result = await _userManager.UpdateAsync(user);
            return (result.Succeeded, result.Errors.Select(e => e.Description).ToArray());
        }

        public async Task<(int Succeeded, int Failed, string[] Errors)> BulkImportUsersAsync(IEnumerable<ApplicationUser> users, IEnumerable<string> defaultRoles)
        {
            var succeeded = 0;
            var failed = 0;
            var errors = new List<string>();

            foreach (var user in users)
            {
                try
                {
                    // Set default values for business object fields
                    user.IsActive = true;
                    user.LoginCount = 0;
                    user.CreatedDate = DateTime.UtcNow;
                    user.UpdatedDate = DateTime.UtcNow;

                    var result = await _userManager.CreateAsync(user);
                    if (result.Succeeded)
                    {
                        // Assign default roles
                        if (defaultRoles.Any())
                        {
                            await _userManager.AddToRolesAsync(user, defaultRoles);
                        }
                        succeeded++;
                    }
                    else
                    {
                        failed++;
                        errors.AddRange(result.Errors.Select(e => $"User {user.UserName}: {e.Description}"));
                    }
                }
                catch (Exception ex)
                {
                    failed++;
                    errors.Add($"User {user.UserName}: {ex.Message}");
                }
            }

            return (succeeded, failed, errors.ToArray());
        }

        public async Task<(int Succeeded, int Failed, string[] Errors)> BulkAssignRolesAsync(string[] userIds, string[] roles)
        {
            var succeeded = 0;
            var failed = 0;
            var errors = new List<string>();

            foreach (var userId in userIds)
            {
                try
                {
                    var user = await _userManager.FindByIdAsync(userId);
                    if (user == null)
                    {
                        failed++;
                        errors.Add($"User {userId}: User not found");
                        continue;
                    }

                    var result = await _userManager.AddToRolesAsync(user, roles);
                    if (result.Succeeded)
                    {
                        succeeded++;
                    }
                    else
                    {
                        failed++;
                        errors.AddRange(result.Errors.Select(e => $"User {user.UserName}: {e.Description}"));
                    }
                }
                catch (Exception ex)
                {
                    failed++;
                    errors.Add($"User {userId}: {ex.Message}");
                }
            }

            return (succeeded, failed, errors.ToArray());
        }

        public async Task<(int Succeeded, int Failed, string[] Errors)> BulkActivateUsersAsync(string[] userIds, bool isActive)
        {
            var succeeded = 0;
            var failed = 0;
            var errors = new List<string>();

            foreach (var userId in userIds)
            {
                try
                {
                    var user = await _userManager.FindByIdAsync(userId);
                    if (user == null)
                    {
                        failed++;
                        errors.Add($"User {userId}: User not found");
                        continue;
                    }

                    // Update IsActive status and related fields
                    user.IsActive = isActive;
                    user.UpdatedDate = DateTime.UtcNow;
                    
                    // If deactivating, set GesperrtSeit timestamp
                    if (!isActive && !user.GesperrtSeit.HasValue)
                    {
                        user.GesperrtSeit = DateTime.UtcNow;
                    }
                    else if (isActive)
                    {
                        user.GesperrtSeit = null; // Clear lock timestamp when reactivating
                    }

                    var result = await _userManager.UpdateAsync(user);
                    if (result.Succeeded)
                    {
                        succeeded++;
                    }
                    else
                    {
                        failed++;
                        errors.AddRange(result.Errors.Select(e => $"User {user.UserName}: {e.Description}"));
                    }
                }
                catch (Exception ex)
                {
                    failed++;
                    errors.Add($"User {userId}: {ex.Message}");
                }
            }

            return (succeeded, failed, errors.ToArray());
        }
    }
}
