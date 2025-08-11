# Product Requirements Document: rvGutachten (LEGACY)

> **⚠️ DEPRECATION NOTICE**
> 
> **This document is superseded by the structured PRD in the `../prd/` folder.**
> 
> - **Current PRD:** [../prd/index.md](../prd/index.md) - Use this for all current requirements
> - **This document:** Preserved for historical reference and context only
> - **Content status:** Content has been migrated to modular structured format
> - **Maintenance:** This legacy document is no longer actively maintained
> 
> **For current requirements, please use the structured PRD:** [../prd/index.md](../prd/index.md)

---

**Document Version:** 1.0 (LEGACY)  
**Last Updated:** August 4, 2025  
**Status:** 🚫 DEPRECATED - Use structured PRD in `../prd/` folder  
**Product Manager:** [Your Name]  
**Stakeholders:** Development Team, Assessment Department, Management  

## Executive Summary

rvGutachten is a web-based platform designed for assessors to efficiently manage, read, and track assessment assignments. The application enables assessors to browse, view, and interact with a list of PDF documents associated with each assignment, as well as send and read messages related to those documents or general communications. The platform streamlines document access and communication, improving productivity and knowledge sharing among assessors. Assignment management and PDF uploads are handled by a separate administrative app, allowing rvGutachten to focus on the assessor experience.

## Business Objectives

- **Primary Goal**: Streamline assessment workflow and improve assessor productivity by 30%
- **Secondary Goals**:
  - Reduce communication delays between assessors and managers
  - Centralize document access and reduce time spent searching for files
  - Enable digital signature capabilities to reduce paper-based processes
  - Improve audit trail and compliance tracking

## Success Metrics

- **User Adoption**: 90% of assessors actively using the platform within 3 months
- **Efficiency**: 25% reduction in time spent per assessment review
- **Communication**: 50% reduction in email-based document requests
- **Digital Transformation**: 80% of assessments completed with digital signatures

## Detailed Overview

rvGutachten is a web-based platform designed for assessors to efficiently manage, read, and track assessment assignments. The application enables assessors to browse, view, and interact with a list of PDF documents associated with each assignment, as well as send and read messages related to those documents or general communications. The platform streamlines document access and communication, improving productivity and knowledge sharing among assessors. Assignment management and PDF uploads are handled by a separate administrative app, allowing rvGutachten to focus on the assessor experience.

## Core Features  

- **Assignment Listing & Tracking**: Assessors can view a list of their assigned assessments, track their status, and mark them as read or accepted.
- **PDF Document Browsing & Viewing**: For each assignment, assessors can browse and view associated PDF documents in-browser, with support for multiple documents per assignment.
- **Assessment Upload**: Assessors can upload assessments as PDF and digitally sign them.
- **Document-Related Messaging**: Assessors can send and receive messages linked to assigned assessments, facilitating discussion and clarification.
- **General Messaging**: Assessors can also send and receive messages not tied to specific assessments, supporting broader communication.
- **Notifications**: Real-time or periodic notifications for new assignments, messages, or document updates.
- **User Authentication**: Secure login for assessors, with role-based access control.

## User Experience  

- **User Personas**: Primary users are assessors who need to efficiently process and communicate about assessment assignments and documents.
- **Manager Personas**: Managers who create assessment assignments and add specific PDF documents. They can also communicate with assessors.
- **Admin Personas**: Admins manage assessors and co-workers. They can create, update, list and delete user accounts.
- **Key User Flows**:
  - Login and view dashboard of assignments
  - Select an assignment to view details and associated PDFs
  - Open a PDF document and read or annotate (if supported)
  - Send/read messages related to a document or assignment
  - Receive notifications for new assignments or messages
- **UI/UX Considerations**:
  - Clean, intuitive interface focused on document and message access
  - Responsive design for desktop and tablet use
  - Clear separation between document-related and general messages

## Functional Requirements

### Priority 1 (MVP)

- **FR-001**: User authentication with role-based access (Assessor, Manager, Admin)
- **FR-002**: Assignment dashboard displaying status, priority, and due dates
- **FR-003**: PDF document viewer with zoom, pan, and navigation controls
- **FR-004**: Document-specific messaging with thread history
- **FR-005**: Real-time notifications for new assignments and messages
- **FR-006**: Digital signature capability for assessment documents
- **FR-007**: Assignment status tracking (New, In Progress, Completed, Signed)

### Priority 2 (Future)

- **FR-008**: PDF annotation tools (highlight, notes, stamps)
- **FR-009**: Advanced search across documents and messages
- **FR-010**: Mobile-responsive design and potential mobile app
- **FR-011**: Integration with calendar systems
- **FR-012**: Analytics dashboard for performance metrics

## Non-Functional Requirements

- **Performance**: Page load times under 3 seconds, PDF rendering under 5 seconds
- **Security**: HTTPS encryption, secure authentication, role-based access control
- **Availability**: 99.5% uptime during business hours
- **Scalability**: Support for 500+ concurrent users
- **Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility**: WCAG 2.1 AA compliance

## Technical Architecture  

- **System Components**:
  - Frontend web app for assessors (rvGutachten.Web)
  - Frontend web app for managers (rvGutachten.Verw)
  - Frontend web app for admins (rvGutachten.Admin)
  - Backend API for assignment, document, and messaging data
  - Integration with a separate admin/management app for assignment and PDF uploads
  - Web API (backend)
  - Angular SPA (frontend)
  - Database (SQL Server LocalDB, Azure SQL DB, Azure Cosmos DB)
  - File storage (local or cloud, e.g., Azure Blob Storage)
- **Data Models**:
  - **Assignment**:
    - id (UUID), title (string), description (text)
    - status (enum: New, Assigned, InProgress, PendingReview, Completed, Signed)
    - priority (enum: Low, Medium, High, Critical)
    - assessorId (UUID), managerId (UUID)
    - dueDate (datetime), createdAt (datetime), updatedAt (datetime)
    - documentIds (array of UUIDs), metadata (JSON)
  - **Document**:
    - id (UUID), assignmentId (UUID), fileName (string)
    - fileUrl (string), filePath (string), fileSize (integer)
    - mimeType (string), uploadedBy (UUID), uploadedAt (datetime)
    - version (integer), isActive (boolean), metadata (JSON)
  - **Message**:
    - id (UUID), senderId (UUID), recipientId (UUID)
    - assignmentId (UUID), documentId (UUID, optional)
    - subject (string), content (text), messageType (enum)
    - isRead (boolean), timestamp (datetime), attachments (JSON)
  - **User**:
    - id (UUID), email (string), firstName (string), lastName (string)
    - role (enum: Assessor, Manager, Admin), isActive (boolean)
    - department (string), phone (string), lastLogin (datetime)
    - preferences (JSON), createdAt (datetime)
- **APIs and Integrations**:
  - REST API for assignments, documents, and messages
  - Authentication API (JWT or OAuth2)
  - WebSocket or polling for real-time notifications
- **Infrastructure Requirements**:
  - Cloud hosting for frontend and backend
  - Secure storage for PDF documents
  - Database for assignments, users, messages
- **Development Requirements**:
  - using Jasmine and Jest for frontend testing
  - using xUnit for backend tests
  - using cucumber for E2E tests
- **Deployment Requirements**:
  - github actions for CI/CD

## Development Roadmap

### Phase 1: Foundation (Weeks 1-4)

#### Sprint 1 (Weeks 1-2): Authentication & User Management

- User registration and login system
- Role-based access control (Assessor, Manager, Admin)
- Basic user profile management
- **Acceptance Criteria**: Users can register, login, and access role-appropriate features

#### Sprint 2 (Weeks 3-4): Assignment Management

- Assignment dashboard for assessors
- Assignment creation/editing for managers
- Status tracking and updates
- **Acceptance Criteria**: Assessors can view assignments, managers can create them

### Phase 2: Core Features (Weeks 5-10)

#### Sprint 3 (Weeks 5-6): Document Management

- PDF upload and storage system
- Document viewer with basic controls (zoom, pan, navigate)
- Document-assignment association
- **Acceptance Criteria**: Users can upload, view, and navigate PDF documents

#### Sprint 4 (Weeks 7-8): Messaging System

- Document-specific messaging threads
- General messaging between users
- Message history and search
- **Acceptance Criteria**: Users can send/receive messages tied to documents and assignments

#### Sprint 5 (Weeks 9-10): Notifications & Digital Signatures

- Real-time notification system
- Basic digital signature capability
- Email notifications for key events
- **Acceptance Criteria**: Users receive timely notifications and can sign documents digitally

### Phase 3: Future Enhancements (Post-MVP)

- **PDF Annotation Tools**: Highlight, notes, stamps, markup capabilities
- **Advanced Search**: Full-text search across documents and messages
- **Mobile App**: Native mobile application for iOS and Android
- **Analytics Dashboard**: Performance metrics and reporting for managers
- **Calendar Integration**: Sync with Outlook/Google Calendar
- **Advanced Security**: Two-factor authentication, audit logging

## Security Considerations

### Authentication & Authorization

- Multi-factor authentication for all user roles
- JWT tokens with appropriate expiration times
- Role-based access control with principle of least privilege
- Session management and timeout controls

### Data Protection

- Encryption at rest for all sensitive documents
- Encryption in transit (HTTPS/TLS 1.3)
- Secure file storage with access logging
- Data anonymization for analytics
- GDPR compliance for EU users

### Application Security

- Input validation and sanitization
- SQL injection prevention
- Cross-site scripting (XSS) protection
- Cross-site request forgery (CSRF) protection
- Regular security audits and penetration testing

## Testing Strategy

### Automated Testing

- Unit tests for all business logic (90% coverage target)
- Integration tests for API endpoints
- End-to-end tests for critical user journeys
- Performance testing for PDF loading and rendering

### Manual Testing

- Usability testing with actual assessors
- Accessibility testing (WCAG 2.1 AA)
- Cross-browser compatibility testing
- Mobile responsiveness testing
- Security penetration testing

## Logical Dependency Chain

- Implement user authentication and basic user model first
- Build assignment listing and tracking (requires user model)
- Add PDF document browsing/viewing (requires assignments)
- Implement messaging (requires assignments and documents)
- Add notifications (requires messaging and assignments)
- Integrate with admin/management app for assignment/document sync
- Enhance with future features as needed

## Risks and Mitigations

### Technical Risks

- **PDF Rendering Performance**: Large PDF files may cause browser performance issues
  - *Mitigation*: Implement lazy loading, chunked rendering, and PDF.js optimization
- **Cross-browser Compatibility**: PDF viewing may vary across browsers
  - *Mitigation*: Extensive testing on all supported browsers, fallback options
- **File Storage Scalability**: Growing document storage requirements
  - *Mitigation*: Implement cloud storage with CDN, file compression, archival strategy

### Business Risks

- **User Adoption**: Assessors may resist change from current workflows
  - *Mitigation*: Comprehensive training program, gradual rollout, feedback incorporation
- **Feature Creep**: Stakeholders requesting additional features during development
  - *Mitigation*: Strict change control process, MVP focus, future roadmap communication
- **Integration Complexity**: Challenges integrating with existing admin systems
  - *Mitigation*: Early API design, prototype integration, clear interface contracts

### Resource Risks

- **Development Timeline**: Limited development resources may cause delays
  - *Mitigation*: Realistic sprint planning, regular risk assessment, scope prioritization
- **Budget Constraints**: Project costs may exceed allocated budget
  - *Mitigation*: Regular cost monitoring, phased delivery approach, MVP focus

## Success Criteria & Acceptance

### MVP Launch Criteria

- All authentication and role management features functional
- Assessors can view and manage assignments
- PDF viewing works reliably across target browsers
- Basic messaging system operational
- Digital signature capability implemented
- 95% test coverage achieved
- Security audit completed with no critical findings

### Post-Launch Success Metrics (90 days)

- 90% user adoption rate among assessors
- 25% reduction in assessment processing time
- 50% reduction in document-related support tickets
- 4.5/5 average user satisfaction score
- 99.5% system uptime achieved

## Appendix

### Technical References

- **PDF.js Library**: [https://mozilla.github.io/pdf.js/](https://mozilla.github.io/pdf.js/)
- **SignalR for Real-time**: [https://docs.microsoft.com/en-us/aspnet/signalr/](https://docs.microsoft.com/en-us/aspnet/signalr/)
- **Angular Security Best Practices**: [https://angular.io/guide/security](https://angular.io/guide/security)

### Stakeholder Contacts

- **Product Owner**: [Name, Email]
- **Technical Lead**: [Name, Email]
- **UX Designer**: [Name, Email]
- **Security Team**: [Name, Email]
- **Assessment Department Head**: [Name, Email]

---

**Document Status**: Draft v1.0  
**Next Review Date**: [Date + 2 weeks]  
**Approval Required From**: Product Owner, Technical Lead, Assessment Department Head
