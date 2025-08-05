# QARvGut Domain Model Implementation Plan

## Executive Summary

This document outlines the comprehensive domain model plan for the QARvGut (rvGutachten) assessment management system, based on the business objects specification and current ASP.NET Core architecture.

**Current State:** Basic user management with ApplicationUser entity extended for business object alignment  
**Target State:** Complete domain model supporting assessment workflow, document management, and messaging system  
**Implementation Strategy:** Phased approach building on existing Story 1.1 foundation

---

## Domain Model Overview

### Core Domain Architecture

```text
Assessment Management Domain
├── User Management (✅ In Progress - Story 1.1)
│   ├── ApplicationUser (Base class - IdentityUser)
│   ├── Gutachter (Assessment Expert)
│   ├── Mitarbeiter (Employee/Assistant)
│   └── Administrator (System Admin)
├── Assessment Workflow
│   ├── Auftrag (Assignment/Order)
│   ├── Gutachten (Assessment Report)
│   ├── Gutachtenstatus (Assessment Status)
│   └── Mahnung (Reminder/Notice)
├── Document Management
│   ├── Document (Core document entity)
│   ├── DocumentMetadata (File properties)
│   └── DocumentAccess (ACL permissions)
├── Contact & Address Management
│   ├── Kontakt (Contact information)
│   ├── Adresse (Address details)
│   └── Proband (Assessment subject)
├── Communication System
│   ├── Nachricht (Message)
│   └── Notiz (Note/Comment)
└── Supporting Entities
    ├── Träger (Insurance carrier)
    ├── Verfügbarkeit (Availability)
    ├── UserSetting (User preferences)
    └── LastLogin (Login tracking)
```

---

## Phase 1: Foundation (✅ Story 1.1 - In Progress)

### 1.1 Enhanced User Management System

**Status:** ✅ Partially Complete - Business Object Alignment Done

**Current Implementation:**

- ✅ ApplicationUser entity extended with business object aligned fields
- ✅ Migration created for new user profile fields
- ✅ Service layer updated for search and activity tracking
- ✅ API endpoints for profile management and user activity

**Remaining Tasks:**

- 🔄 Complete bulk operations (import/export, role assignment)
- ⏳ Authorization policy verification
- ⏳ Unit and integration testing

**Domain Entities:**

```csharp
ApplicationUser : IdentityUser, IAuditableEntity
├── Core Fields: Email, UserName, PasswordHash (IdentityUser)
├── Profile Fields: FullName, JobTitle, Department, Phone, ContactInfo
├── Business Fields: Preferences, Avatar, IsActive, GesperrtSeit
├── Activity Fields: LastLoginDate, LastLoginIp, LoginCount
└── Audit Fields: CreatedBy, UpdatedBy, CreatedDate, UpdatedDate
```

---

## Phase 2: Assessment Workflow Core (Stories 2.x)

### 2.1 Assessment Subject Management

**Priority:** High - Core business entity
**Dependencies:** Phase 1 (User Management)

**New Entities:**

```csharp
// Proband - Assessment subject/patient
public class Proband : BaseEntity
{
    public required string Vsnr { get; set; }           // Insurance number
    public required DateTime GebDatum { get; set; }     // Birth date
    public required string Name { get; set; }           // Last name
    public required string Vorname { get; set; }        // First name
    
    // Navigation Properties
    public ICollection<Kontakt> Contacts { get; } = [];
    public ICollection<Adresse> Adressen { get; } = [];
    public ICollection<Auftrag> Auftraege { get; } = [];
}
```

### 2.2 Core Assessment Entities

**Priority:** High - Central business workflow
**Dependencies:** User Management, Proband

**New Entities:**
```csharp
// Auftrag - Assessment assignment/order
public class Auftrag : BaseEntity
{
    public required string AuftragsId { get; set; }           // UUID
    public required string RvPurAuftragsId { get; set; }      // External reference
    public required DateTime AuftragsDatum { get; set; }      // Order date
    public required DateTime EingangsDatum { get; set; }      // Received date
    public DateTime? StornierungsDatum { get; set; }          // Cancellation date
    public DateTime? BereitstellungsDatum { get; set; }       // Ready date
    public DateTime? EinbestellDatum { get; set; }            // Appointment date
    public string? Kennzeichen1 { get; set; }                 // Custom identifier 1
    public string? Kennzeichen2 { get; set; }                 // Custom identifier 2
    
    // Foreign Keys
    public required string ProbandId { get; set; }
    public required string GutachterId { get; set; }
    public required string AuftraggeberId { get; set; }       // Träger
    
    // Navigation Properties
    public required Proband Proband { get; set; }
    public required ApplicationUser Gutachter { get; set; }
    public required Traeger Auftraggeber { get; set; }
    public ICollection<Gutachtenstatus> StatusHistory { get; } = [];
    public ICollection<Document> Dokumente { get; } = [];
    public ICollection<Document> Anhaenge { get; } = [];
    public ICollection<Mahnung> Mahnungen { get; } = [];
    public Gutachten? Gutachten { get; set; }
}

// Gutachten - Completed assessment report
public class Gutachten : BaseEntity
{
    public required string AuftragsId { get; set; }
    public required DateTime BegonnenAm { get; set; }
    public DateTime? FertiggestelltAm { get; set; }
    
    // Navigation Properties
    public required Auftrag Auftrag { get; set; }
    public ICollection<Document> Anhaenge { get; } = [];
    // S0080 form data would be handled as document or separate entity
}

// Gutachtenstatus - Assessment status tracking
public class Gutachtenstatus : BaseEntity
{
    public required AuftragsStatus Status { get; set; }
    public required DateTime ChangedOn { get; set; }
    public required string AuftragsId { get; set; }
    
    // Navigation Properties
    public required Auftrag Auftrag { get; set; }
}

// Status enumeration
public enum AuftragsStatus
{
    Neu,
    Einbestellt,
    InBearbeitung,
    Abgeschlossen,
    Storniert,
    StellungnahmeAngefordert
}
```

---

## Phase 3: Document Management System (Stories 3.x)

### 3.1 Core Document Infrastructure

**Priority:** High - Essential for assessment workflow
**Dependencies:** Assessment workflow core

**New Entities:**

```csharp
// Document - Core document entity
public class Document : BaseEntity
{
    public required string DocumentId { get; set; }           // UUID
    public required string Name { get; set; }                 // Display name
    public required string Filename { get; set; }             // File name
    public required string Filetype { get; set; }             // File type
    public required DateTime EingestelltAm { get; set; }      // Upload date
    public int? Filesize { get; set; }                        // Size in bytes
    public DateTime? ErstelltAm { get; set; }                 // Creation date
    public string? ErstelltVon { get; set; }                  // Creator user ID
    public DateTime? ChangedOn { get; set; }                  // Last modified
    public string? ChangedBy { get; set; }                    // Last modifier
    public required byte[] Data { get; set; }                 // Binary data
    
    // JSON fields for flexibility
    public string? Properties { get; set; }                   // Key-value properties
    public string? Tags { get; set; }                         // Document tags
    
    // Navigation Properties
    public ICollection<DocumentAccess> AccessControls { get; } = [];
}

// DocumentAccess - ACL for document permissions
public class DocumentAccess : BaseEntity
{
    public required string DocumentId { get; set; }
    public required string UserId { get; set; }
    public required DocumentPermission Permission { get; set; }
    
    // Navigation Properties
    public required Document Document { get; set; }
    public required ApplicationUser User { get; set; }
}

public enum DocumentPermission
{
    Read,
    Write,
    Delete,
    Share
}
```

---

## Phase 4: Communication & Contact System (Stories 4.x)

### 4.1 Contact & Address Management

**Priority:** Medium - Supporting infrastructure
**Dependencies:** User management

**New Entities:**
```csharp
// Kontakt - Contact information
public class Kontakt : BaseEntity
{
    public required KontaktTyp Typ { get; set; }
    public required string Wert { get; set; }                 // Phone/email value
    public required string Anmerkung { get; set; }            // Notes (primary, private, etc.)
    
    // Polymorphic relationships
    public string? UserId { get; set; }                       // For users
    public string? ProbandId { get; set; }                    // For probands
    public string? TraegerId { get; set; }                    // For carriers
    
    // Navigation Properties
    public ApplicationUser? User { get; set; }
    public Proband? Proband { get; set; }
    public Traeger? Traeger { get; set; }
}

public enum KontaktTyp
{
    Email,
    Telefon,
    Unbekannt
}

// Adresse - Address information
public class Adresse : BaseEntity
{
    public required string Strasse { get; set; }
    public string? Hausnummer { get; set; }
    public required string Plz { get; set; }
    public required string Ort { get; set; }
    public string? Adresszusatz { get; set; }
    public string? Postfach { get; set; }
    public string? Land { get; set; }
    public required AdressTyp Typ { get; set; }
    
    // Polymorphic relationships
    public string? UserId { get; set; }
    public string? ProbandId { get; set; }
    public string? TraegerId { get; set; }
    
    // Navigation Properties
    public ApplicationUser? User { get; set; }
    public Proband? Proband { get; set; }
    public Traeger? Traeger { get; set; }
}

public enum AdressTyp
{
    Wohnadresse,
    Postadresse,
    Geschaeftlich
}
```

### 4.2 Messaging System

**Priority:** Medium - Communication workflow
**Dependencies:** Contact management

**New Entities:**
```csharp
// Nachricht - Message entity
public class Nachricht : BaseEntity
{
    public required DateTime Timestamp { get; set; }
    public required string Titel { get; set; }                // Subject
    public string? Text { get; set; }                         // Message body
    public required bool Gelesen { get; set; }                // Read flag
    
    // Foreign Keys
    public required string SenderId { get; set; }
    public required string ReceiverId { get; set; }
    
    // Navigation Properties
    public required ApplicationUser Sender { get; set; }
    public required ApplicationUser Receiver { get; set; }
}

// Notiz - Notes/Comments
public class Notiz : BaseEntity
{
    public required string NotizId { get; set; }
    public string? Referenz { get; set; }                     // Reference to other entities
    public required string Inhalt { get; set; }               // Note content
    
    // Foreign Key
    public required string UserId { get; set; }
    
    // Navigation Properties
    public required ApplicationUser User { get; set; }
}
```

---

## Phase 5: Supporting Infrastructure (Stories 5.x)

### 5.1 Organizational Entities

**Priority:** Medium - Business support
**Dependencies:** Core workflow

**New Entities:**
```csharp
// Traeger - Insurance carrier
public class Traeger : BaseEntity
{
    public required string Kennung { get; set; }              // KTAN identifier
    public required string Name { get; set; }                 // Carrier name
    
    // Navigation Properties
    public ICollection<Adresse> Adressen { get; } = [];
    public ICollection<Auftrag> Auftraege { get; } = [];
    public ICollection<Administrator> Administratoren { get; } = [];
}

// Mahnung - Reminder/Notice system
public class Mahnung : BaseEntity
{
    public required DateTime GemahntAm { get; set; }
    public required int NummerDerMahnung { get; set; }        // 1-9
    public required string Inhalt { get; set; }               // XML content
    
    // Foreign Key
    public required string AuftragsId { get; set; }
    
    // Navigation Properties
    public required Auftrag Auftrag { get; set; }
}
```

### 5.2 User Specialization Extensions

**Priority:** Low - Role-specific enhancements
**Dependencies:** Complete user management

**Enhanced Entities:**
```csharp
// Gutachter-specific extensions (could be separate table or profile data)
public class GutachterProfile : BaseEntity
{
    public required string UserId { get; set; }
    public required string Efn { get; set; }                  // Unique ID number
    public DateTime? Geburtsdatum { get; set; }
    public string? Anrede { get; set; }                       // Mr./Ms.
    public string? Titel { get; set; }                        // Dr./Prof.
    public string? Namenszusatz { get; set; }                 // Name suffix
    
    // JSON fields
    public string? Fachrichtungen { get; set; }               // Specializations
    public string? Verfuegbarkeiten { get; set; }             // Availability
    public string? Zuordnungen { get; set; }                  // Carrier assignments
    
    // Navigation Properties
    public required ApplicationUser User { get; set; }
    public ICollection<Mitarbeiter> Mitarbeiter { get; } = [];
}

// Mitarbeiter - Employee relationship
public class Mitarbeiter : BaseEntity
{
    public required string UserId { get; set; }               // Employee user
    public required string GutachterId { get; set; }          // Supervisor
    
    // Navigation Properties
    public required ApplicationUser User { get; set; }
    public required ApplicationUser Gutachter { get; set; }
}
```

---

## Implementation Strategy

### Database Design Principles

1. **Inheritance Strategy:** Table-per-hierarchy for user types (all in ApplicationUser)
2. **Polymorphic Relationships:** Contact and Address entities support multiple parent types
3. **Audit Trail:** All entities inherit IAuditableEntity for change tracking
4. **Flexible Data:** JSON fields for extensible properties and settings
5. **Performance:** Strategic indexing on frequently queried fields

### Migration Strategy

```csharp
// Phase 1: ✅ Already implemented
// 20250805170500_EnhancedUserProfileFields.cs

// Phase 2: Assessment Core
// 20250806_AssessmentWorkflowCore.cs
// - Proband, Auftrag, Gutachten, Gutachtenstatus tables
// - Core foreign key relationships
// - Essential indexes

// Phase 3: Document Management
// 20250807_DocumentManagement.cs
// - Document, DocumentAccess tables
// - Binary data storage considerations
// - Document indexing

// Phase 4: Communication
// 20250808_CommunicationSystem.cs
// - Kontakt, Adresse, Nachricht, Notiz tables
// - Polymorphic relationship indexes

// Phase 5: Supporting Infrastructure
// 20250809_SupportingEntities.cs
// - Traeger, Mahnung, specialized profile tables
// - Final relationship constraints
```

### Entity Framework Configuration

```csharp
// Key configuration patterns
protected override void OnModelCreating(ModelBuilder builder)
{
    // User inheritance
    builder.Entity<ApplicationUser>()
        .HasDiscriminator<string>("UserType")
        .HasValue<ApplicationUser>("User");
    
    // Polymorphic relationships
    builder.Entity<Kontakt>()
        .HasIndex(k => new { k.UserId, k.ProbandId, k.TraegerId });
    
    // JSON field configuration
    builder.Entity<ApplicationUser>()
        .Property(u => u.Preferences)
        .HasColumnType("jsonb"); // PostgreSQL
    
    // Business constraints
    builder.Entity<Gutachtenstatus>()
        .HasIndex(gs => new { gs.AuftragsId, gs.ChangedOn });
    
    // Performance indexes
    builder.Entity<Auftrag>()
        .HasIndex(a => a.EingangsDatum);
        
    builder.Entity<Document>()
        .HasIndex(d => d.EingestelltAm);
}
```

---

## API Design Strategy

### RESTful Endpoint Structure

```http
/api/assignments           (Auftrag management)
├── GET  /api/assignments                    # List assignments
├── POST /api/assignments                    # Create assignment
├── GET  /api/assignments/{id}               # Get assignment details
├── PUT  /api/assignments/{id}               # Update assignment
├── GET  /api/assignments/{id}/documents     # Get assignment documents
├── POST /api/assignments/{id}/documents     # Upload document
└── GET  /api/assignments/{id}/status        # Get status history

/api/documents            (Document management)
├── GET  /api/documents                      # List documents
├── POST /api/documents                      # Upload document
├── GET  /api/documents/{id}                 # Download document
├── PUT  /api/documents/{id}/metadata        # Update metadata
└── DELETE /api/documents/{id}               # Delete document

/api/assessments          (Gutachten management)
├── GET  /api/assessments                    # List assessments
├── POST /api/assessments                    # Create assessment
├── GET  /api/assessments/{id}               # Get assessment
└── PUT  /api/assessments/{id}               # Update assessment

/api/messages             (Communication)
├── GET  /api/messages                       # List messages
├── POST /api/messages                       # Send message
├── PUT  /api/messages/{id}/read             # Mark as read
└── GET  /api/messages/unread                # Get unread count

/api/users                (✅ Already implemented in Story 1.1)
├── GET  /api/users                          # List users
├── POST /api/users                          # Create user
├── GET  /api/users/{id}                     # Get user details
├── PUT  /api/users/{id}/profile             # Update profile
└── GET  /api/users/{id}/activity            # Get activity
```

---

## Testing Strategy

### Unit Testing Coverage

- **Entity Models:** Validation, business rules, calculated properties
- **Repository Patterns:** CRUD operations, query logic, relationship handling
- **Service Layer:** Business logic, workflow validation, authorization
- **API Controllers:** Endpoint behavior, request/response handling

### Integration Testing

- **Database Integration:** Migration execution, relationship integrity
- **API Integration:** End-to-end workflow testing
- **Authentication:** Role-based access control verification
- **Document Handling:** File upload/download, metadata management

### Performance Testing

- **Query Performance:** Complex joins, large dataset handling
- **Document Operations:** Large file upload/download
- **Concurrent Operations:** Multi-user assessment workflows

---

## Security Considerations

### Data Protection

- **PII Handling:** Proband data encryption, access logging
- **Document Security:** File type validation, virus scanning
- **Access Control:** Role-based permissions, document ACLs

### Compliance Requirements

- **Audit Trail:** Complete change tracking for all entities
- **Data Retention:** Automated deletion based on business rules
- **Privacy Controls:** User consent management, data export

---

## Performance Optimization

### Database Optimization

```sql
-- Critical indexes for query performance
CREATE INDEX idx_auftrag_gutachter_datum ON Auftrag(GutachterId, EingangsDatum);
CREATE INDEX idx_document_type_date ON Document(Filetype, EingestelltAm);
CREATE INDEX idx_nachricht_receiver_timestamp ON Nachricht(ReceiverId, Timestamp);
CREATE INDEX idx_gutachtenstatus_auftrag_date ON Gutachtenstatus(AuftragsId, ChangedOn);

-- Composite indexes for common queries
CREATE INDEX idx_user_active_department ON ApplicationUser(IsActive, Department) WHERE IsActive = true;
CREATE INDEX idx_auftrag_status_date ON Auftrag(GutachterId) INCLUDE (AuftragsDatum, EingangsDatum);
```

### Caching Strategy

- **User Profile Caching:** Redis cache for frequently accessed user data
- **Document Metadata:** Cache document lists for assignment views
- **Status Lookups:** Cache assessment status hierarchies

---

## Deployment Considerations

### Environment Configuration

- **Development:** SQL Server LocalDB with sample data
- **Staging:** PostgreSQL with production-like data volume
- **Production:** PostgreSQL with high availability, backup strategy

### Migration Deployment

```bash
# Development migration workflow
dotnet ef migrations add <PhaseName> --context ApplicationDbContext
dotnet ef database update --context ApplicationDbContext

# Production deployment
dotnet ef script migration --from <LastMigration> --to <NewMigration> --output migration.sql
# Review and execute SQL script in production environment
```

---

## Success Metrics

### Technical Metrics

- **Query Performance:** <200ms for standard operations, <1s for complex reports
- **API Response Times:** <100ms for CRUD operations
- **Database Growth:** Efficient storage with proper normalization
- **Test Coverage:** >90% for business logic, >80% overall

### Business Metrics

- **User Adoption:** Assessment workflow completion rates
- **Document Management:** Upload/access success rates
- **Communication Efficiency:** Message delivery and read rates
- **System Reliability:** 99.9% uptime for business hours

---

## Next Steps & Recommendations

### Immediate Actions (Next Sprint)

1. **Complete Story 1.1:** Finish bulk operations and authorization verification
2. **Phase 2 Planning:** Design assessment workflow entities in detail
3. **Prototype Development:** Build core Auftrag/Proband entities
4. **Database Design Review:** Validate relationship models with stakeholders

### Long-term Roadmap

1. **Q1 2025:** Complete Phases 1-2 (User management + Assessment core)
2. **Q2 2025:** Implement Phase 3 (Document management)
3. **Q3 2025:** Develop Phase 4 (Communication system)
4. **Q4 2025:** Finish Phase 5 (Supporting infrastructure)

### Risk Mitigation

- **Data Migration:** Plan for existing data transformation
- **Performance Impact:** Monitor database growth and query performance
- **User Training:** Ensure adequate documentation and training materials
- **Integration Testing:** Extensive testing of complex entity relationships

---

*This domain model plan provides a comprehensive roadmap for implementing the QARvGut assessment management system while building on the solid foundation established in Story 1.1.*
