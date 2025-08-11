# QARvGut Domain Model - Executive Summary

## Overview

The QARvGut (rvGutachten) assessment management system requires a comprehensive domain model to support the complete workflow from user management through assessment completion and document handling.

## Current Status ✅

**Story 1.1 - Enhanced User Management:** IN PROGRESS
- ApplicationUser entity extended with business object alignment
- 10 new profile fields added (Department, Phone, ContactInfo, etc.)
- Database migration created and ready for deployment
- Service layer enhanced with search and activity tracking
- API endpoints implemented for profile management

## Domain Model Structure

### Phase 1: Foundation (✅ Story 1.1)
**User Management System**
- Enhanced ApplicationUser with business object fields
- Role-based authorization (Gutachter, Mitarbeiter, Administrator)
- Activity tracking and profile management
- Status: 80% complete, bulk operations pending

### Phase 2: Assessment Workflow Core
**Core Business Entities**
- **Proband** (Assessment subject/patient)
- **Auftrag** (Assessment assignment/order) 
- **Gutachten** (Completed assessment report)
- **Gutachtenstatus** (Status tracking with history)

**Key Relationships:**
- Auftrag ↔ Proband (one-to-many)
- Auftrag ↔ ApplicationUser (Gutachter assignment)
- Auftrag ↔ Gutachtenstatus (status history)
- Auftrag ↔ Gutachten (one-to-one when completed)

### Phase 3: Document Management System
**Document Infrastructure**
- **Document** (Core document entity with binary data)
- **DocumentAccess** (ACL-based permissions)
- Integration with assessment workflow
- File upload/download with metadata

### Phase 4: Communication & Contact System
**Contact Management**
- **Kontakt** (Email/phone with polymorphic relationships)
- **Adresse** (Address information for all entity types)
- **Nachricht** (Messaging between users)
- **Notiz** (Notes and comments)

### Phase 5: Supporting Infrastructure
**Business Support**
- **Träger** (Insurance carriers)
- **Mahnung** (Reminder/notice system)
- **GutachterProfile** (Role-specific extensions)
- **Mitarbeiter** (Employee relationships)

## Technical Architecture

### Database Strategy
- **Inheritance:** Table-per-hierarchy for user types
- **Polymorphic:** Contact/Address support multiple parents
- **Audit Trail:** All entities implement IAuditableEntity
- **Performance:** Strategic indexing on query patterns
- **Flexibility:** JSON fields for extensible properties

### Entity Framework Patterns
```csharp
// Core inheritance pattern
ApplicationUser : IdentityUser, IAuditableEntity

// Polymorphic relationships
Kontakt → User | Proband | Träger
Adresse → User | Proband | Träger

// Business workflow
Auftrag → Proband + Gutachter + Träger + [Documents] + [StatusHistory]
```

### API Design
RESTful endpoints following established patterns:
- `/api/assignments` - Assessment workflow
- `/api/documents` - Document management
- `/api/assessments` - Completed assessments
- `/api/messages` - Communication
- `/api/users` - ✅ Already implemented

## Implementation Roadmap

### Immediate Next Steps (Current Sprint)
1. ✅ Complete Story 1.1 bulk operations and testing
2. 🔄 Deploy user management migration
3. ⏳ Begin Phase 2 planning and prototyping

### Q1 2025: Core Workflow
- Implement Proband and Auftrag entities
- Basic assessment creation and assignment
- Core status tracking functionality

### Q2 2025: Document Management
- Document upload/download infrastructure
- Integration with assessment workflow
- Basic document permissions

### Q3 2025: Communication System
- Messaging between users
- Contact and address management
- Notification system

### Q4 2025: Complete Platform
- Supporting infrastructure completion
- Advanced features and optimizations
- Full integration testing

## Business Value

### Immediate Benefits
- ✅ Enhanced user management with detailed profiles
- ✅ Business object aligned data model
- ✅ Foundation for all subsequent features

### Phase 2 Benefits
- Complete assessment workflow automation
- Clear assignment tracking and management
- Status visibility for all stakeholders

### Full Platform Benefits
- End-to-end assessment management
- Integrated document handling
- Streamlined communication workflow
- Comprehensive audit and reporting capabilities

## Risk Mitigation

### Technical Risks
- **Performance:** Proactive indexing strategy for large datasets
- **Data Migration:** Careful planning for existing data transformation
- **Integration Complexity:** Phased approach with thorough testing

### Business Risks
- **User Adoption:** Focus on intuitive UI/UX design
- **Data Security:** Comprehensive security measures for PII
- **Compliance:** Built-in audit trail and retention policies

## Success Metrics

### Technical KPIs
- Query performance <200ms for standard operations
- API response times <100ms for CRUD operations
- Test coverage >90% for business logic
- 99.9% uptime during business hours

### Business KPIs
- Assessment workflow completion rates
- Document management efficiency
- User satisfaction scores
- System adoption metrics

---

**Next Action:** Complete Story 1.1 implementation and begin detailed Phase 2 entity design based on this comprehensive domain model plan.

*See `docs/domain-model-plan.md` for complete technical specifications and implementation details.*
