# Document Templates

**Purpose:** Standard templates for consistent documentation across the project  
**Usage:** Copy and customize templates when creating new documents  

## 📋 User Story Template

```markdown
# Story [ID]: [Title]

**Last Updated:** [Date]  
**Epic:** [Epic Name]  
**Priority:** [High/Medium/Low]  
**Status:** [📋 Draft/🔄 In Progress/✅ Complete]  
**Owner:** [Name]  

## User Story

As a [user role], I want [functionality] so that [business value].

## Acceptance Criteria

- [ ] Criterion 1 - Clear, testable requirement
- [ ] Criterion 2 - Another measurable outcome
- [ ] Criterion 3 - Edge case or validation rule

## Technical Requirements

### Backend Changes
- [API endpoints, database changes, service modifications]

### Frontend Changes  
- [UI components, user flows, integration points]

### Dependencies
- [Prerequisites, external services, other stories]

## Implementation Notes

[Guidance for developers, architectural constraints, performance considerations]

## Testing Requirements

- [ ] Unit tests for new functionality
- [ ] Integration tests for API endpoints
- [ ] E2E tests for user workflows
- [ ] Performance testing if applicable

## Definition of Done

- [ ] Code complete and peer reviewed
- [ ] All tests written and passing
- [ ] Documentation updated
- [ ] Acceptance criteria verified
- [ ] Deployed to staging environment

## Related Documentation

- [Architecture Reference](../architecture/[relevant-doc].md)
- [API Specification](../brownfield-architecture/api-design-and-endpoints.md)
- [Epic Overview](../epics/[epic-name].md)
```

## 🏗️ Architecture Document Template

```markdown
# [Component/System] Architecture

**Last Updated:** [Date]  
**Architect:** [Name]  
**Status:** [📋 Draft/✅ Approved/⚠️ Deprecated]  
**Review Date:** [Date]  

## Overview

[Brief description of what this component/system does and why it exists]

## Architecture Decisions

### Decision 1: [Title]
- **Context:** [Why this decision was needed]
- **Decision:** [What was decided]
- **Rationale:** [Why this approach was chosen]
- **Consequences:** [Implications and trade-offs]

### Decision 2: [Title]
- **Context:** [Why this decision was needed]
- **Decision:** [What was decided]
- **Rationale:** [Why this approach was chosen]
- **Consequences:** [Implications and trade-offs]

## System Interactions

[How this component integrates with other parts of the system]

### Dependencies
- [External services or components this relies on]

### Dependents
- [What depends on this component]

### Integration Points
- [APIs, events, data flows]

## Implementation Guidance

[Practical advice for developers implementing this architecture]

### Key Patterns
- [Design patterns or conventions to follow]

### Performance Considerations
- [Scalability, caching, optimization notes]

### Security Considerations
- [Authentication, authorization, data protection]

## Related Documentation

- [Related Architecture Docs](../architecture/)
- [Implementation Details](../brownfield-architecture/)
- [User Stories](../stories/)
```

## 📊 Analysis Document Template

```markdown
# [Analysis Title]

**Last Updated:** [Date]  
**Analyst:** [Name]  
**Purpose:** [Why this analysis was conducted]  
**Audience:** [Who should read this]  

## Executive Summary

[High-level findings and recommendations - 2-3 paragraphs max]

## Analysis Scope

**Included:**
- [What was analyzed]

**Excluded:**
- [What was not covered and why]

**Time Period:**
- [When analysis was conducted, data period]

## Methodology

[How the analysis was conducted, data sources, tools used]

## Key Findings

### Finding 1: [Title]
- **Observation:** [What was discovered]
- **Impact:** [Significance and implications]
- **Evidence:** [Supporting data or examples]

### Finding 2: [Title]
- **Observation:** [What was discovered]
- **Impact:** [Significance and implications]
- **Evidence:** [Supporting data or examples]

## Recommendations

### Recommendation 1: [Title]
- **Action:** [What should be done]
- **Priority:** [High/Medium/Low]
- **Timeline:** [When it should be implemented]
- **Owner:** [Who should act on this]

### Recommendation 2: [Title]
- **Action:** [What should be done]
- **Priority:** [High/Medium/Low]
- **Timeline:** [When it should be implemented]
- **Owner:** [Who should act on this]

## Next Steps

1. [Immediate actions required]
2. [Follow-up analysis or reviews needed]
3. [Monitoring or measurement plans]

## Appendices

[Supporting data, detailed charts, additional context]
```

## 🎨 Design Document Template

```markdown
# [Design Title]

**Last Updated:** [Date]  
**Designer:** [Name]  
**Status:** [📋 Draft/🔄 In Review/✅ Approved]  
**Target Release:** [Version/Date]  

## Design Overview

[Brief description of what is being designed and its purpose]

## User Experience Goals

- [Goal 1 - User need being addressed]
- [Goal 2 - Experience improvement expected]
- [Goal 3 - Business objective supported]

## User Flows

### Primary Flow: [Name]
1. [Step 1 - User action]
2. [Step 2 - System response]
3. [Step 3 - User action]
4. [Step 4 - Completion]

### Alternative Flow: [Name]
1. [Step 1]
2. [Step 2]
3. [etc.]

## Component Specifications

### Component 1: [Name]
- **Purpose:** [What it does]
- **Behavior:** [How it responds to user interaction]
- **Visual Style:** [Appearance, styling notes]
- **States:** [Default, hover, active, disabled, etc.]

### Component 2: [Name]
- **Purpose:** [What it does]
- **Behavior:** [How it responds to user interaction]
- **Visual Style:** [Appearance, styling notes]
- **States:** [Default, hover, active, disabled, etc.]

## Wireframes

[References to wireframe files or embedded wireframes]

## Accessibility Considerations

- [WCAG compliance notes]
- [Keyboard navigation requirements]
- [Screen reader compatibility]
- [Color contrast requirements]

## Implementation Notes

[Guidance for developers on implementing the design]

### Technical Constraints
- [Browser support, performance requirements]

### Design System Integration
- [How this fits with existing design patterns]

## Related Documentation

- [Wireframes](../design/wireframes/)
- [User Stories](../stories/)
- [Product Requirements](../prd/)
```

## 📋 Epic Template

```markdown
# Epic: [Epic Name]

**Last Updated:** [Date]  
**Epic Owner:** [Name]  
**Status:** [📋 Planning/🔄 In Progress/✅ Complete]  
**Target Release:** [Version/Date]  

## Epic Description

[1-2 paragraph description of what this epic accomplishes and why it's valuable]

## Business Value

**Primary Objectives:**
- [Objective 1 with success metric]
- [Objective 2 with success metric]

**Success Metrics:**
- [Measurable outcome 1]
- [Measurable outcome 2]

## User Stories

### Completed Stories
- [✅ Story 1.1: Title](../stories/story-1-1-title.md)
- [✅ Story 1.2: Title](../stories/story-1-2-title.md)

### In Progress Stories
- [🔄 Story 2.1: Title](../stories/story-2-1-title.md)

### Planned Stories
- [📋 Story 3.1: Title](../stories/story-3-1-title.md)
- [📋 Story 3.2: Title](../stories/story-3-2-title.md)

## Dependencies

**Prerequisites:**
- [Other epics or external dependencies needed first]

**Dependent Epics:**
- [Epics that depend on this one]

## Architecture Impact

[How this epic affects the system architecture]

## Risks and Mitigations

### Risk 1: [Title]
- **Description:** [What could go wrong]
- **Impact:** [Consequences if risk materializes]
- **Mitigation:** [How to prevent or address]

## Related Documentation

- [Architecture Docs](../architecture/)
- [Product Requirements](../prd/)
- [Design Specifications](../design/)
```

## 📄 General Document Template

```markdown
# [Document Title]

**Last Updated:** [Date]  
**Author:** [Name]  
**Purpose:** [Brief description of why this document exists]  
**Audience:** [Who should read this]  
**Status:** [📋 Draft/🔄 In Review/✅ Complete/⚠️ Deprecated]  

## Overview

[Brief introduction explaining what this document covers]

## [Main Section 1]

[Content organized into logical sections]

## [Main Section 2]

[Content with appropriate subsections as needed]

### [Subsection if needed]

[Detailed content]

## Related Documentation

- [Link to related doc 1](path/to/doc.md) - Brief description
- [Link to related doc 2](path/to/doc.md) - Brief description

## Maintenance Notes

[Any special considerations for keeping this document current]
```

## 🔄 Using Templates

### 📋 **Template Selection**
1. **User Story:** For feature development tasks
2. **Architecture:** For technical design decisions
3. **Analysis:** For research, audits, assessments
4. **Design:** For UI/UX specifications
5. **Epic:** For high-level feature groupings
6. **General:** For any other documentation needs

### ✏️ **Customization Guidelines**
1. **Copy template** to new document location
2. **Replace bracketed placeholders** with actual content
3. **Remove sections** that don't apply to your document
4. **Add sections** if needed for your specific use case
5. **Follow naming conventions** from documentation standards

### 🎯 **Template Maintenance**
- **Review quarterly** for improvements based on usage
- **Update based on team feedback** and evolving needs
- **Keep aligned** with documentation standards
- **Version control** template changes like other docs

---

**Note:** These templates provide starting points for consistency. Adapt them to fit specific needs while maintaining the core structure and required elements.
