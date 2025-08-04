# rvGutachten Document Viewing & Interaction UI/UX Specification

**Document Version:** 1.0  
**Last Updated:** August 4, 2025  
**UX Expert:** Sally  
**Project Focus:** Document viewing and interaction experience for assessors  

## Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for rvGutachten's document viewing and interaction interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience specifically focused on how assessors interact with PDF documents within their assessment workflow.

## Overall UX Goals & Principles

### Target User Personas

- **Assessment Reviewer:** Professional assessors who need to efficiently read, annotate, and process multiple PDF documents per assignment
- **Detail-Oriented Auditor:** Users who need precise navigation, search capabilities, and reference tools within documents  
- **Multi-tasking Assessor:** Users juggling multiple assignments who need quick context switching and progress tracking

### Usability Goals

- **Fast Document Access:** Assessors can open any PDF within 2 seconds and navigate between documents seamlessly
- **Efficient Reading Experience:** Support for various reading preferences (zoom levels, layout modes, annotation tools)
- **Context Preservation:** Users never lose their place when switching between documents or assignments
- **Multi-document Workflow:** Easy comparison and reference between related documents

### Design Principles

1. **Reading First** - Document content is the primary focus; minimize UI distractions during reading
2. **Contextual Tools** - Show relevant actions (annotate, search, navigate) only when needed
3. **Seamless Transitions** - Moving between documents, assignments, and related tasks feels fluid
4. **Progress Transparency** - Users always know their reading progress and completion status
5. **Flexible Layouts** - Support different screen sizes and reading preferences

## Information Architecture

### Document-Focused Site Map

```mermaid
graph TD
    A[Dashboard] --> B[Assignment List]
    B --> C[Assignment Details]
    C --> D[Document Viewer]
    D --> D1[Document Navigation Panel]
    D --> D2[Main Document View]
    D --> D3[Document Tools Panel]
    
    D1 --> D1a[Document List]
    D1 --> D1b[Progress Tracker]
    D1 --> D1c[Assignment Context]
    
    D2 --> D2a[PDF Reader]
    D2 --> D2b[Page Navigation]
    D2 --> D2c[Zoom Controls]
    
    D3 --> D3a[Annotation Tools]
    D3 --> D3b[Search & Find]
    D3 --> D3c[Messaging Panel]
    D3 --> D3d[Notes & Comments]
    
    C --> E[Messaging Center]
    A --> F[Notifications]
    
    style D fill:#e1f5fe
    style D2 fill:#f3e5f5
```

### Navigation Structure

**Primary Navigation:** Assignment-focused breadcrumb (Dashboard > Assignment > Document)

**Secondary Navigation:** Document-specific tools panel (collapsible sidebar)

**Contextual Navigation:** In-document navigation (page jumps, bookmarks, search results)

**Quick Actions:** Floating action buttons for common tasks (annotate, message, mark complete)

### Document Viewer Layout Modes

- **Immersive Mode:** Full-screen document reading with minimal UI
- **Workflow Mode:** Document viewer with assignment context panel and tools
- **Comparison Mode:** Side-by-side document viewing for related files
- **Mobile Mode:** Optimized single-column layout with swipe navigation

## User Flows

### Primary Document Interaction Flow

**User Goal:** Review and process PDF documents within an assignment efficiently

**Entry Points:**

- Assignment details page → "View Documents" button
- Dashboard notification → Direct document link
- Document list within assignment → Individual document selection

**Success Criteria:**

- User can navigate between all assignment documents seamlessly
- Reading progress is tracked and preserved
- User can complete assessment tasks without leaving document context

```mermaid
graph TD
    A[Assignment Selected] --> B[Document List View]
    B --> C{Multiple Documents?}
    C -->|Yes| D[Select First/Priority Document]
    C -->|No| E[Open Single Document]
    D --> F[Document Viewer Opens]
    E --> F
    F --> G[Reading Mode Active]
    G --> H{Need Tools?}
    H -->|No| I[Continue Reading]
    H -->|Yes| J[Reveal Tool Panel]
    J --> K{Tool Type?}
    K -->|Annotate| L[Annotation Mode]
    K -->|Search| M[Search Panel]
    K -->|Message| N[Messaging Sidebar]
    K -->|Navigate| O[Document Navigation]
    L --> P[Save Annotation]
    M --> Q[Jump to Results]
    N --> R[Send/Receive Messages]
    O --> S[Jump to Section/Page]
    P --> I
    Q --> I
    R --> I
    S --> I
    I --> T{Document Complete?}
    T -->|No| H
    T -->|Yes| U[Mark Document Done]
    U --> V{More Documents?}
    V -->|Yes| W[Next Document]
    V -->|No| X[Assignment Complete]
    W --> F
```

### Document Comparison Flow

**User Goal:** Compare information across multiple related documents

**Entry Points:**

- Document viewer → "Compare" button
- Assignment overview → "Compare Documents" action

**Success Criteria:**

- Side-by-side viewing of related documents
- Synchronized scrolling option available
- Easy switching between comparison and single-document modes

```mermaid
graph TD
    A[Comparison Initiated] --> B[Select Documents to Compare]
    B --> C[Split-Screen Layout]
    C --> D[Document A Left Panel]
    C --> E[Document B Right Panel]
    D --> F{Sync Scrolling?}
    E --> F
    F -->|Yes| G[Synchronized Navigation]
    F -->|No| H[Independent Navigation]
    G --> I[Cross-Reference Reading]
    H --> I
    I --> J{Switch Documents?}
    J -->|Yes| K[Document Selection Menu]
    J -->|No| L[Continue Comparison]
    K --> M[Replace Panel Document]
    M --> I
    L --> N{Add Annotation?}
    N -->|Yes| O[Cross-Document Note]
    N -->|No| P[Continue Reading]
    O --> Q[Link Documents in Note]
    Q --> P
    P --> R{Comparison Complete?}
    R -->|No| I
    R -->|Yes| S[Return to Single View]
```

### Edge Cases & Error Handling

- **Document loading failures** → Retry mechanism with offline indicator
- **Large document performance** → Progressive loading with page chunking
- **Session timeout** → Auto-save reading position and annotations
- **Network interruption** → Offline reading mode with sync on reconnection
- **Annotation conflicts** → Version control with merge options
