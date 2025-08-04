# rvGutachten Document Viewer - Wireframes & Key Screen Layouts

**Document Version:** 1.0  
**Last Updated:** August 4, 2025  
**UX Expert:** Sally  
**Related:** Document Viewing & Interaction UI/UX Specification  

## Overview

This document contains the detailed wireframes and screen layouts for the rvGutachten document viewing and interaction interface. These layouts support the user flows and information architecture defined in the main UX specification.

## Primary Design Files

**Primary Design Files:** Figma workspace (to be created) - [Link will be added when design files are established]

**Design System:** Follow rvGutachten's existing Angular Material design patterns with document-specific enhancements

## Key Screen Layouts

### 1. Document Viewer - Workflow Mode

Primary layout for assessors working with documents while maintaining assignment context.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [≡] Assignment: Assessment #AR-2025-0234           [🔔] [👤] [⚙]           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Dashboard > Assignment #AR-2025-0234 > Document: Financial_Report.pdf      │
├──────────────┬──────────────────────────────────────────────┬──────────────┤
│ DOCUMENTS    │                PDF VIEWER                     │ TOOLS        │
│              │                                              │              │
│ ✓ Cover      │  ┌─────────────────────────────────────────┐ │ [🔍] Search  │
│ ● Financial  │  │                                         │ │ [✏] Annotate │
│   Report     │  │         DOCUMENT CONTENT                │ │ [💬] Messages│
│ ○ Summary    │  │                                         │ │ [📝] Notes   │
│ ○ Appendix   │  │    Lorem ipsum dolor sit amet,          │ │              │
│              │  │    consectetur adipiscing elit.         │ │ PROGRESS     │
│ Progress:    │  │    Sed do eiusmod tempor...            │ │ ██████░░░░   │
│ 2/4 Complete │  │                                         │ │ 60% Complete │
│              │  │                                         │ │              │
│ [📊] Stats   │  │                                         │ │ ASSIGNMENT   │
│ Reading: 45m │  │                                         │ │ Due: 2 days  │
│ Pages: 23/67 │  │                                         │ │ Priority: High│
│              │  └─────────────────────────────────────────┘ │              │
│              │  [◀] [▶] Page 23/67    [🔍-] 100% [🔍+]    │              │
└──────────────┴──────────────────────────────────────────────┴──────────────┘
```

**Layout Features:**
- Three-panel design: Documents list (left), PDF viewer (center), Tools (right)
- Persistent progress tracking and assignment context
- Document navigation with status indicators (✓ complete, ● current, ○ pending)
- Contextual tools panel with search, annotation, messaging, and notes
- Bottom navigation bar for document-specific controls

### 2. Document Viewer - Immersive Mode

Distraction-free reading mode for focused document review.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            [×] Exit Immersive                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │                        FULL DOCUMENT VIEW                             │  │
│  │                                                                       │  │
│  │    Lorem ipsum dolor sit amet, consectetur adipiscing elit.           │  │
│  │    Sed do eiusmod tempor incididunt ut labore et dolore magna         │  │
│  │    aliqua. Ut enim ad minim veniam, quis nostrud exercitation...      │  │
│  │                                                                       │  │
│  │                                                                       │  │
│  │                                                                       │  │
│  │                                                                       │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [◀] [▶] Page 23/67  [🔍-] 125% [🔍+]    [⚡] Tools    [💬] Messages      │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Features:**
- Full-screen document display with minimal UI
- Essential controls at bottom: navigation, zoom, quick tool access
- Clean exit mechanism to return to workflow mode
- Floating action buttons for quick access to tools without leaving immersive mode

### 3. Document Comparison Mode

Side-by-side viewing for comparing related documents.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [≡] Assignment: Assessment #AR-2025-0234   [Split] [Sync: ON] [×] Exit     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Dashboard > Assignment #AR-2025-0234 > Comparing Documents                 │
├─────────────────────────────────┬───────────────────────────────────────────┤
│ DOCUMENT A: Financial_Report.pdf│ DOCUMENT B: Audit_Summary.pdf           │
│                                │                                          │
│  ┌─────────────────────────────┐│  ┌─────────────────────────────────────┐ │
│  │                             ││  │                                     │ │
│  │   Financial Overview        ││  │   Executive Summary                 │ │
│  │                             ││  │                                     │ │
│  │   Lorem ipsum dolor sit     ││  │   Findings from the comprehensive  │ │
│  │   amet, consectetur         ││  │   review indicate...               │ │
│  │   adipiscing elit...        ││  │                                     │ │
│  │                             ││  │   Key metrics show:                 │ │
│  │   [💬] "Review this section"││  │   - Revenue: $2.4M                 │ │
│  │                             ││  │   - Growth: 15%                     │ │
│  │                             ││  │                                     │ │
│  └─────────────────────────────┘│  └─────────────────────────────────────┘ │
│                                │                                          │
│  Page 5/67    [🔍-] 100% [🔍+] │  Page 2/23    [🔍-] 100% [🔍+]        │
└─────────────────────────────────┴───────────────────────────────────────────┘
```

**Layout Features:**
- Split-screen layout with equal document panels
- Synchronized scrolling toggle for coordinated reading
- Independent zoom and navigation controls per document
- Cross-document annotation and messaging capabilities
- Document selection controls to switch comparison subjects

### 4. Mobile Document Viewer

Optimized layout for mobile and tablet devices.

```
┌─────────────────────────┐
│ [≡] AR-2025-0234   [⋮] │
├─────────────────────────┤
│ Financial_Report.pdf    │
│ 📄 2/4 docs • 23/67 pg │
├─────────────────────────┤
│                         │
│  ┌─────────────────────┐│
│  │                     ││
│  │   DOCUMENT          ││
│  │   CONTENT           ││
│  │                     ││
│  │   Lorem ipsum       ││
│  │   dolor sit amet,   ││
│  │   consectetur       ││
│  │   adipiscing...     ││
│  │                     ││
│  │                     ││
│  │                     ││
│  └─────────────────────┘│
│                         │
│ [◀] [▶]  [🔍] [💬] [✏] │
│ Page 23/67              │
└─────────────────────────┘
```

**Layout Features:**
- Single-column layout optimized for portrait orientation
- Compact header with essential assignment information
- Bottom navigation bar with touch-friendly controls
- Swipe gestures for page navigation and document switching
- Collapsible menu for advanced features

### 5. Tool Panels - Expanded States

#### Search Panel

```
┌──────────────────────────┐
│ SEARCH & FIND            │
├──────────────────────────┤
│ [Search box...]    [🔍]  │
│                          │
│ □ Current Document       │
│ ☑ All Assignment Docs    │
│ □ Case Sensitive         │
│                          │
│ RESULTS (3 found):       │
│ ─────────────────────    │
│ Page 15: "financial..."  │
│ Page 23: "revenue..."    │
│ Page 31: "audit..."      │
│                          │
│ [Clear] [Export Results] │
└──────────────────────────┘
```

#### Annotation Panel

```
┌──────────────────────────┐
│ ANNOTATIONS              │
├──────────────────────────┤
│ [✏] Highlight   [📝] Note│
│ [📌] Bookmark   [❓] Flag │
│                          │
│ RECENT ANNOTATIONS:      │
│ ─────────────────────    │
│ 📝 Page 15: "Need review"│
│ ✏ Page 23: Highlighted   │
│ 📌 Page 31: Key section  │
│                          │
│ [View All] [Export]      │
└──────────────────────────┘
```

#### Messaging Panel

```
┌──────────────────────────┐
│ MESSAGES                 │
├──────────────────────────┤
│ 💬 Document Thread (3)   │
│ 📋 Assignment Thread (7) │
│ 📢 General Messages (2)  │
│                          │
│ RECENT:                  │
│ ─────────────────────    │
│ Manager: "Review p.23"   │
│ You: "Question about..." │
│ Colleague: "Found issue" │
│                          │
│ [New Message] [View All] │
└──────────────────────────┘
```

## Responsive Design Considerations

### Breakpoints

- **Desktop Large (1200px+):** Three-panel layout with full context and tools
- **Desktop Small (992px-1199px):** Three-panel with collapsible sidebars
- **Tablet (768px-991px):** Two-panel layout, collapsible tool panel
- **Mobile Large (576px-767px):** Single-panel with bottom navigation
- **Mobile Small (320px-575px):** Optimized single-panel, minimal UI

### Touch Interactions

- **Pinch-to-zoom:** Native document scaling
- **Swipe navigation:** Horizontal swipes for page navigation
- **Tap targets:** Minimum 44px touch targets for all interactive elements
- **Long press:** Context menus for annotations and selections
- **Pull-to-refresh:** Update document content and sync annotations

## Accessibility Features

### Keyboard Navigation

- **Tab order:** Logical progression through interface elements
- **Keyboard shortcuts:** Common actions (Ctrl+F for search, Space for page down)
- **Focus management:** Clear visual indicators and logical flow
- **Escape patterns:** Consistent exit methods for modals and panels

### Screen Reader Support

- **ARIA labels:** Descriptive labels for all interactive elements
- **Document structure:** Proper heading hierarchy and landmarks
- **Content description:** Alt text for document images and diagrams
- **State announcements:** Changes in document status and progress

### Visual Accessibility

- **High contrast mode:** Enhanced visibility for text and UI elements
- **Font scaling:** Support for user font size preferences up to 200%
- **Color coding:** Never rely solely on color for information
- **Focus indicators:** High-contrast borders and backgrounds for focused elements

## Layout Specifications

### Grid System

- **Desktop:** 12-column grid with 20px gutters
- **Tablet:** 8-column grid with 16px gutters
- **Mobile:** 4-column grid with 12px gutters

### Spacing

- **Large spacing:** 32px (section separation)
- **Medium spacing:** 16px (component separation)
- **Small spacing:** 8px (element spacing)
- **Micro spacing:** 4px (tight groupings)

### Typography

- **Headings:** Material Design typography scale
- **Body text:** 16px minimum for readability
- **UI text:** 14px for interface elements
- **Caption text:** 12px for metadata and labels

## Component Specifications

### Document Status Indicators

- **✓ Complete:** Green checkmark, document fully reviewed
- **● Current:** Blue dot, currently active document
- **○ Pending:** Gray circle, not yet started
- **⚠ Flagged:** Yellow warning, requires attention
- **🔒 Locked:** Red lock, restricted access

### Progress Indicators

- **Visual bars:** 10-segment progress bars for quick scanning
- **Percentage:** Numerical completion percentage
- **Time tracking:** Reading time and estimated completion
- **Page counters:** Current page / total pages format

### Tool Button States

- **Default:** Standard Material Design button appearance
- **Active:** Elevated shadow and accent color
- **Disabled:** Reduced opacity and no interaction
- **Loading:** Spinner animation for processing states

This wireframe specification provides the complete visual foundation for implementing the rvGutachten document viewing and interaction interface, ensuring consistency across all device types and accessibility standards.
