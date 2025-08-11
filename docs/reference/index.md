# Reference Documentation

**Last Updated:** August 11, 2025  
**Purpose:** Reference materials and legacy documentation  

## Overview

This folder contains reference materials that support development but are not part of the active project documentation. This includes business object specifications, legacy documents, and other supporting materials that provide context and historical information.

## Contents

### 📊 **Business Specifications**

**[business-objects.csv](business-objects.csv)**

- **Type:** Data specification file
- **Purpose:** Comprehensive business object definitions and relationships
- **Format:** CSV (Comma Separated Values)
- **Usage:** Entity modeling, database design, business rule implementation
- **Audience:** Backend developers, database architects, business analysts

**Key Information:**
- Entity definitions and properties
- Business rules and constraints  
- Relationship specifications
- Data validation requirements

### 📋 **Legacy Documentation**

**[legacy-prd.md](legacy-prd.md)** ⚠️ **DEPRECATED**

- **Original name:** rvGutachten_prd.md
- **Type:** Legacy Product Requirements Document
- **Status:** 🚫 SUPERSEDED by structured PRD in `../prd/` folder
- **Purpose:** Historical reference and context only
- **Current PRD:** Use `../prd/index.md` for all active requirements

**Why it's preserved:**
- Historical context for architectural decisions
- Reference for understanding requirement evolution
- Comparison with current structured PRD
- Compliance with documentation retention policies

**⚠️ Important:** This document is no longer maintained. For current requirements, always use the structured PRD in `../prd/` folder.

## Usage Guide

### 🎯 **Business Objects CSV**

**For Database Architects:**

```sql
-- Use business-objects.csv to inform:
-- - Table structure design
-- - Column specifications
-- - Constraint definitions
-- - Index planning
```

**For Backend Developers:**

```csharp
// Reference for:
// - Entity class properties
// - Validation rules
// - Business logic implementation
// - API model definitions
```

**For Business Analysts:**

- Validate business rules against current requirements
- Ensure domain model alignment with business needs
- Cross-reference with user stories for completeness

### 📖 **Legacy PRD Usage**

**When to reference:**

- **Requirements gaps:** If current PRD seems incomplete
- **Historical context:** Understanding how requirements evolved
- **Architectural decisions:** Why certain technical choices were made
- **Stakeholder alignment:** Original vision vs. current direction

**Comparison workflow:**

1. Start with current PRD in `../prd/`
2. Use legacy PRD to fill gaps or provide context
3. Document any significant differences or evolution
4. Update current documentation based on insights

## Integration with Active Documentation

### 🔗 **Cross-References**

**From Business Objects:**

- **Domain Model:** `../architecture/domain-model-plan.md` - Implements business objects
- **Database Design:** `../brownfield-architecture/data-models-and-schema-changes.md` - Technical implementation
- **User Stories:** `../stories/` - Feature implementations based on business objects

**From Legacy PRD:**

- **Current PRD:** `../prd/` - Evolution and current state
- **Architecture:** `../architecture/` - Architectural decisions based on original requirements  
- **Epics:** `../epics/` - Feature groupings derived from original requirements

### 📊 **Data Flow**

```text
business-objects.csv
    ↓
../architecture/domain-model-plan.md
    ↓
../brownfield-architecture/data-models-and-schema-changes.md
    ↓
../stories/1.1.user-data-model-authentication-api.md
```

## Maintenance Guidelines

### 📋 **Business Objects CSV**

**Update triggers:**
- New business requirements that change entity definitions
- Database schema changes that affect business objects
- Business rule modifications
- Validation requirement changes

**Version control:**
- Maintain change history for business object evolution
- Document reasons for changes
- Coordinate updates with domain model documentation

### 📖 **Legacy Documents**

**Preservation policy:**
- Keep for historical reference
- Do not modify (preserve original state)
- Add notes/metadata about superseding documents
- Maintain cross-references to current documentation

**Access guidelines:**
- Use primarily for reference and context
- Prefer current documentation for active development
- Clearly communicate legacy status to team members
- Regular review to ensure continued relevance

## Quality Assurance

### ✅ **Reference Integrity**

- Validate business objects against current domain model
- Ensure legacy documents are properly superseded
- Check cross-references remain accurate
- Verify data formats and accessibility

### 🔄 **Regular Reviews**

- **Quarterly:** Review relevance and accuracy of reference materials
- **On major releases:** Validate business objects against implemented system
- **During requirements changes:** Check impact on reference materials
- **Architecture updates:** Ensure business objects remain aligned

## Related Documentation

- **Current PRD:** `../prd/` - Active product requirements
- **Domain Model:** `../architecture/domain-model-plan.md` - Technical implementation of business objects
- **Database Design:** `../brownfield-architecture/data-models-and-schema-changes.md` - Data model implementation
- **User Stories:** `../stories/` - Feature development based on business requirements
