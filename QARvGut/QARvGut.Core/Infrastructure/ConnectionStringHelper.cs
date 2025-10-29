// Pseudocode / Plan:
// 1. Provide a small helper class in the Infrastructure folder to retrieve a connection string.
// 2. Expose two helpers:
//    - An extension method on ApplicationDbContext that returns the configured DB connection string.
//      * Try Database.GetConnectionString() (relational EF Core extension).
//      * Fallback to Database.GetDbConnection().ConnectionString if needed.
//    - An extension method on IConfiguration to read "ConnectionStrings:{name}" (default name: "DefaultConnection").
// 3. Keep methods null-safe and return string? so callers can handle missing configuration.
// 4. Add XML-summary comments and example usage in comments.
//
// Usage examples:
//   var csFromContext = dbContext.GetConnectionString();
//   var csFromConfig = configuration.GetConnectionString("DefaultConnection");

using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data.Common;

namespace QARvGut.Core.Infrastructure
{
    public static class ConnectionStringHelper
    {
        /// <summary>
        /// Gets the connection string from the provided <see cref="ApplicationDbContext"/>.
        /// Tries relational DatabaseFacade.GetConnectionString(); falls back to DbConnection.ConnectionString.
        /// Returns null when no connection string is available.
        /// </summary>
        public static string? GetConnectionStringContext(this ApplicationDbContext dbContext)
        {
            if (dbContext is null) throw new ArgumentNullException(nameof(dbContext));

            // Prefer relational extension when available
            try
            {
                var cs = dbContext.Database.GetConnectionString();
                if (!string.IsNullOrWhiteSpace(cs))
                    return cs;
            }
            catch
            {
                // Ignore - fallback to DbConnection
            }

            try
            {
                DbConnection? conn = dbContext.Database.GetDbConnection();
                return conn?.ConnectionString;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Gets the connection string from <see cref="IConfiguration"/> by name (default: "DefaultConnection").
        /// Returns null when not found.
        /// </summary>
        public static string? GetConnectionStringContext(this IConfiguration configuration, string name = "DefaultConnection")
        {
            if (configuration is null) throw new ArgumentNullException(nameof(configuration));
            return configuration.GetConnectionString(name);
        }
    }
}