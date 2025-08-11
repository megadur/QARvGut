using QARvGut.Core.Infrastructure;

namespace QARvGut.Tests.Helpers
{
    public class MockDatabaseSeeder : IDatabaseSeeder
    {
        public Task SeedAsync()
        {
            // Do nothing - we handle seeding in the test factory
            return Task.CompletedTask;
        }
    }
}