# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QARvGut is a full-stack ASP.NET Core 9.0 + Angular 19 application for assessment management system (Gutachten/QA Review). It's built on a clean architecture pattern with comprehensive user management, authentication, and role-based authorization.

**Current Status:** Phase 1 Story 1.1 Complete - User Management Foundation established with comprehensive testing framework.

## Common Development Commands

### Backend (.NET)
```bash
# Build the solution
dotnet build QARvGut.sln

# Run the server (from QARvGut.Server directory)
dotnet run --project QARvGut/QARvGut.Server

# Run tests
dotnet test QARvGut/QARvGut.Tests

# Run a specific test
dotnet test QARvGut/QARvGut.Tests --filter "TestMethodName"

# Add new migration
dotnet ef migrations add MigrationName --project QARvGut/QARvGut.Server --context ApplicationDbContext

# Update database
dotnet ef database update --project QARvGut/QARvGut.Server --context ApplicationDbContext

# Restore packages (requires nuget.config setup for Azure DevOps)
dotnet restore
```

### Frontend (Angular)
```bash
# Navigate to client directory first
cd QARvGut/QARvGut.client

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Full Application
```bash
# Run both backend and frontend in development
# Backend: dotnet run --project QARvGut/QARvGut.Server
# Frontend: cd QARvGut/QARvGut.client && npm start
```

## Architecture Overview

### Solution Structure
- **QARvGut.Server**: ASP.NET Core Web API with authentication, authorization, and business logic
- **QARvGut.Core**: Data access layer with Entity Framework models, services, and infrastructure
- **QARvGut.client**: Angular 19 SPA with TypeScript, Bootstrap, and comprehensive UI components
- **QARvGut.Tests**: Comprehensive test suite with xUnit, Moq, FluentAssertions for unit and integration testing

### Key Architecture Patterns
- **Clean Architecture**: Clear separation between Core (domain/business logic), Server (API/presentation), and Client (UI)
- **Repository Pattern**: Data access abstracted through Entity Framework DbContext
- **Service Layer**: Business logic encapsulated in dedicated service classes
- **Policy-Based Authorization**: Granular access control using ASP.NET Core authorization policies
- **Dependency Injection**: Extensive use of built-in DI container for loose coupling

### Authentication & Authorization
- **OpenIddict**: OAuth2/OpenID Connect implementation with JWT tokens
- **ASP.NET Identity**: User management with ApplicationUser and ApplicationRole entities
- **Policy-Based Auth**: ViewAllUsersPolicy, ManageAllUsersPolicy, ViewAllRolesPolicy, etc.
- **Custom Claims**: Permission-based authorization with ApplicationPermissions

### Database Architecture
- **Entity Framework Core 9.0**: Code-first approach with SQL Server LocalDB (development)
- **Identity Integration**: Custom ApplicationUser with enhanced profile fields (Department, Phone, ContactInfo, etc.)
- **Audit Trail**: Automatic audit information (CreatedBy, CreatedDate, UpdatedBy, UpdatedDate) via IAuditableEntity
- **Migration Strategy**: Database schema versioning with proper migration files

## Development Guidelines

### Entity Framework Conventions
- All domain entities inherit from BaseEntity for common Id property
- Auditable entities implement IAuditableEntity for tracking changes
- Use async/await patterns for all database operations
- Migrations are stored in QARvGut.Server/Migrations with descriptive names
- Database seeding handled through IDatabaseSeeder implementation

### API Development Patterns
- Controllers inherit from BaseApiController with common functionality
- Use AutoMapper for ViewModel mappings (MappingProfile.cs)
- Apply authorization policies consistently across endpoints
- Follow RESTful conventions with proper HTTP status codes
- Support for bulk operations (bulk-import, bulk-roles, bulk-activate)

### Service Layer Conventions
- Business logic encapsulated in dedicated service classes (IUserAccountService, IUserRoleService, etc.)
- Services registered in DI container with scoped lifetime
- Exception handling through custom exception types (UserAccountException, etc.)
- Comprehensive async/await usage for scalability

### Frontend Architecture (Angular)
- **Component Structure**: Organized by feature (components/users-management, components/customers, etc.)
- **Services**: API communication through dedicated service classes (account.service.ts, auth.service.ts)
- **Models**: TypeScript interfaces for type safety (user.model.ts, role.model.ts, etc.)
- **Guards**: Route protection through auth-guard implementation
- **Utilities**: Reusable functionality in utilities.ts and animations.ts

### Testing Strategy
- **Unit Tests**: Service layer and entity validation testing with Moq and FluentAssertions
- **Integration Tests**: API endpoint testing with TestServer and in-memory database
- **Test Data**: Consistent test data generation through TestDataFactory
- **Custom Web Application Factory**: CustomWebApplicationFactory for integration test setup

## NuGet Package Setup

⚠️ **Important**: The project uses Azure DevOps package feeds which require authentication:

1. Copy `nuget.config.template` to `nuget.config`
2. Replace placeholders with your Azure DevOps credentials and Personal Access Token
3. The `nuget.config` file is gitignored for security

## Current Domain Model (Phase 1 Complete)

### User Management Entities
- **ApplicationUser**: Enhanced with business object fields (Department, Phone, ContactInfo, LastLoginDate, LastLoginIp, Preferences, GesperrtSeit)
- **ApplicationRole**: Role management with hierarchical permissions
- **ApplicationPermission**: Granular permission system

### Shop Entities (Example Domain)
- **Customer, Order, OrderDetail, Product, ProductCategory**: Demonstration domain model

### Planned Domain Model (Upcoming Phases)
- **Proband**: Assessment subjects (Phase 2)
- **Auftrag**: Assessment orders and workflow (Phase 2)
- **Assessment Templates**: Forms and workflow templates (Phase 3)
- **Document Management**: File handling and digital signatures (Phase 4)

## Configuration Files

### Backend Configuration
- **appsettings.json**: Production configuration including connection strings and OpenIddict settings
- **appsettings.Development.json**: Development overrides with local database settings
- **Program.cs**: Comprehensive service registration and middleware configuration

### Frontend Configuration
- **angular.json**: Angular CLI configuration with multiple themes support and SCSS preprocessing
- **package.json**: Dependencies including Angular 19, Bootstrap, NgBootstrap, and development tools
- **proxy.conf.js**: Development proxy configuration for API calls
- **tsconfig.json**: TypeScript configuration with strict settings

### Database Configuration
- **DefaultConnection**: Uses SQL Server LocalDB for development
- **Migrations**: Located in QARvGut.Server/Migrations with full history
- **Seeding**: Database initialization with default roles, permissions, and test data

## Key Features Implemented

### Authentication System
- JWT token-based authentication with refresh tokens
- OpenIddict integration for OAuth2/OpenID Connect compliance
- User registration, login, and profile management
- Password policies and account lockout (configurable)

### User Management
- Enhanced user profiles with business object alignment
- Bulk operations (import, role assignment, activation/deactivation)
- Advanced search and filtering (department, role, status)
- Activity tracking and audit logging

### Authorization Framework
- Policy-based authorization with granular permissions
- Role-based access control with hierarchical roles
- Custom authorization handlers for complex scenarios
- API endpoint protection with consistent policy application

### API Features
- RESTful API design with OpenAPI/Swagger documentation
- Comprehensive CORS configuration for development
- Bulk operations support for administrative efficiency
- Error handling with proper HTTP status codes and responses

### Testing Infrastructure
- Unit tests for entities, services, and business logic validation
- Integration tests for API endpoints with realistic scenarios
- Test data factory for consistent test data generation
- In-memory database testing for isolation and performance

## Security Considerations

- Sensitive configuration values use environment variables or Azure Key Vault (production)
- JWT tokens with appropriate expiration and refresh strategies
- Input validation through FluentValidation framework
- SQL injection prevention through Entity Framework parameterized queries
- CORS properly configured for production deployment
- Personal Access Tokens for package authentication (never commit to source control)

## Deployment Notes

The application is designed for deployment to:
- **Backend**: Azure App Service with SQL Server database
- **Frontend**: Static web hosting (Azure Storage Static Websites or CDN)
- **Database**: Azure SQL Database with automated migrations
- **Authentication**: Production certificates required for OpenIddict (configured in appsettings.json)