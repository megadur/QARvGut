using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace QARvGut.Tests.Helpers
{
    public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public TestAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger, UrlEncoder encoder)
            : base(options, logger, encoder)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var authorizationHeader = Request.Headers["Authorization"].FirstOrDefault();

            if (authorizationHeader != null && authorizationHeader.StartsWith("Bearer "))
            {
                var token = authorizationHeader.Substring("Bearer ".Length).Trim();
                
                try
                {
                    // For testing, we'll decode the test user information from a simple JSON structure
                    // In a real scenario, you'd validate and decode the JWT token
                    var testUser = DecodeTestToken(token);
                    
                    if (testUser != null)
                    {
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.NameIdentifier, testUser.UserId),
                            new Claim(ClaimTypes.Name, testUser.UserName),
                            new Claim(ClaimTypes.Email, testUser.Email)
                        };

                        foreach (var role in testUser.Roles)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, role));
                        }

                        foreach (var permission in testUser.Permissions)
                        {
                            claims.Add(new Claim("permission", permission));
                        }

                        var identity = new ClaimsIdentity(claims, "Test");
                        var principal = new ClaimsPrincipal(identity);
                        var ticket = new AuthenticationTicket(principal, "Test");

                        return Task.FromResult(AuthenticateResult.Success(ticket));
                    }
                }
                catch
                {
                    // Invalid token format
                }
            }

            return Task.FromResult(AuthenticateResult.Fail("Invalid token"));
        }

        private TestUser? DecodeTestToken(string token)
        {
            try
            {
                // For simplicity, we'll use base64 encoding for test tokens
                var jsonBytes = Convert.FromBase64String(token);
                var json = System.Text.Encoding.UTF8.GetString(jsonBytes);
                return JsonSerializer.Deserialize<TestUser>(json);
            }
            catch
            {
                return null;
            }
        }

        private class TestUser
        {
            public string UserId { get; set; } = "";
            public string UserName { get; set; } = "";
            public string Email { get; set; } = "";
            public List<string> Roles { get; set; } = new();
            public List<string> Permissions { get; set; } = new();
        }
    }
}