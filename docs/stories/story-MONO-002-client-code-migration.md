# User Story: Client Code Migration

**Story ID:** STORY-MONO-002  
**Epic:** EPIC-MONOREPO-001  
**Story Title:** As a developer, I want existing client code migrated to gutachter-app  
**Story Owner:** Product Owner (Sarah)  
**Created:** August 13, 2025  
**Status:** Ready for Development  
**Priority:** High  
**Story Points:** 8  

## User Story

**As a** frontend developer  
**I want** the existing QARvGut.client code migrated to the new gutachter-app structure  
**So that** current functionality is preserved while enabling the new monorepo architecture  

## Acceptance Criteria

### AC1: Code Migration
- [ ] All source code from `QARvGut.client/src` moved to `apps/gutachter-app/src`
- [ ] Angular configuration files properly migrated
- [ ] Package.json dependencies integrated into workspace
- [ ] Environment configurations preserved

### AC2: Functionality Preservation  
- [ ] All existing routes work identically
- [ ] User authentication flows remain unchanged
- [ ] Profile management features work as before
- [ ] Document viewing capabilities preserved

### AC3: Build and Serve
- [ ] `nx serve gutachter-app` launches the application successfully
- [ ] HTTPS configuration with ASP.NET Core certificates works
- [ ] Proxy configuration for backend API calls maintained
- [ ] Production build generates identical output structure

### AC4: Testing Migration
- [ ] All existing unit tests migrated and passing
- [ ] Jest configuration updated for Nx workspace
- [ ] Testing scripts work with `nx test gutachter-app`
- [ ] Code coverage reports generate correctly

## Technical Implementation Details

### Migration Checklist
1. **File Structure Migration**
   ```
   QARvGut.client/src/ → frontend/apps/gutachter-app/src/
   ├── app/ → app/
   ├── environments/ → environments/
   ├── assets/ → assets/
   └── styles.scss → styles.scss
   ```

2. **Configuration Updates**
   - Update `angular.json` project references
   - Migrate `tsconfig.json` settings
   - Update import paths if needed
   - Configure Nx project.json

3. **Dependency Management**
   - Merge package.json dependencies into workspace
   - Ensure version compatibility
   - Update import statements for shared libraries

### Critical Dependencies to Preserve
- `@angular/animations: ^19.0.1`
- `@ng-bootstrap/ng-bootstrap: ^17.0.1`
- `@ngx-translate/core: ^16.0.3`
- `bootstrap: ^5.3.3`
- `font-awesome: ^4.7.0`

## Testing Strategy

### Functional Testing
- [ ] Login/logout workflows
- [ ] User profile management
- [ ] Document viewing and interaction
- [ ] Navigation and routing
- [ ] Form submissions and validations

### Technical Testing  
- [ ] API integration with backend
- [ ] HTTPS certificate handling
- [ ] Environment variable usage
- [ ] Build optimization and bundling

## Definition of Done
- [ ] All existing functionality works identically
- [ ] No regression in user experience
- [ ] All tests passing
- [ ] Build and deployment scripts updated
- [ ] Performance benchmarks maintained
- [ ] Code review completed

## Risks and Mitigations
- **Risk:** Import path changes break functionality
  - **Mitigation:** Systematic testing of all features
- **Risk:** Configuration issues with Nx workspace
  - **Mitigation:** Incremental migration with rollback plan
- **Risk:** HTTPS setup complications
  - **Mitigation:** Document and test certificate configuration

## Notes
- Maintain backward compatibility with existing backend APIs
- Preserve all existing user preferences and settings
- Ensure no breaking changes for current users
- Document any configuration changes needed for deployment
