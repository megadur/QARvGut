# Existing Project Analysis

**Current Project State:**
- **Primary Purpose:** Assessment management system (rvGutachten) for managing assessors, assignments, and document workflows
- **Current Tech Stack:** Angular 19 frontend, ASP.NET Core 9.0 Web API, PostgreSQL with Entity Framework Core, OAuth2/OpenIDConnect authentication
- **Architecture Style:** Clean Architecture with layered separation (Core/Server/Client), Repository pattern via DbContext
- **Deployment Method:** Development setup with Angular CLI and ASP.NET Core development server

**Available Documentation:**
- README.md files in client and server projects
- Comprehensive PRD document (rvGutachten_prd.md) 
- User story documentation for Enhanced User Management epic
- Existing controller patterns and service layer structure

**Identified Constraints:**
- Must maintain backward compatibility with existing authentication system
- Current user management is basic - only supports CRUD operations via UserAccountController
- Existing role-based authorization must be preserved
- Angular component patterns established in controls folder must be followed
