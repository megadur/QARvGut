# Story Naming Convention Standardization Proposal

**Document:** Story Naming Convention Standards  
**Date:** August 13, 2025  
**Purpose:** Establish consistent, scalable story naming conventions for QARvGut project  

## Current State Analysis

### 🚨 **Identified Problems**

**1. Two Conflicting Naming Patterns:**
- **Decimal Format:** `1.1`, `1.2`, `1.3` (Sequential, Epic-based)
- **Story-Prefix Format:** `story-1`, `story-2`, `story-3` (Non-Epic specific)

**2. Content Conflicts:**
- Story 1.1 (completed) vs story-1-enhanced-user-data-model.md (duplicate)
- story-3-user-management-dashboard.md contains assignment management (wrong epic)

**3. Organizational Issues:**
- Same story numbers across different epics (story-1, story-2, story-3 appear in multiple epics)
- Empty files (story-1-e2e-framework-setup.md)
- Unclear epic relationships

## 📋 **Recommended Standard: Epic.Story Format**

### **Format Pattern:**
```
{EpicNumber}.{StoryNumber}.{descriptive-title}.md
```

### **Examples:**
- `1.1.user-data-model-authentication-api.md`
- `1.2.user-registration-profile-management.md`
- `1.3.admin-user-management-interface.md`
- `2.1.e2e-framework-setup.md`
- `2.2.critical-user-journeys.md`

### **Benefits:**
✅ **Clear Epic Association** - Immediate epic identification  
✅ **Scalable Numbering** - Supports unlimited epics and stories  
✅ **Logical Sequencing** - Stories within epics are ordered  
✅ **No Duplication** - Unique identifiers across project  
✅ **Tool-Friendly** - Sortable, searchable, automatable  

## 🎯 **Proposed Epic Numbering**

| Epic # | Epic Name | Stories |
|--------|-----------|---------|
| **1** | Enhanced User Management | 1.1, 1.2, 1.3 |
| **2** | E2E Testing Framework | 2.1, 2.2, 2.3 |
| **3** | PDF Document Viewer | 3.1, 3.2, 3.3 |
| **4** | Real-time Messaging System | 4.1, 4.2, 4.3 |
| **5** | Digital Signatures Advanced Features | 5.1, 5.2, 5.3 |

## 📝 **Detailed Mapping Plan**

### **Epic 1: Enhanced User Management** ✅ **KEEP AS-IS**
- ✅ `1.1.user-data-model-authentication-api.md` (COMPLETED)
- ✅ `1.2.user-registration-profile-management.md` (COMPLETED)  
- ✅ `1.3.admin-user-management-interface.story.md` (READY)

### **Epic 2: E2E Testing Framework** 🔄 **RENAME REQUIRED**
**Current → Proposed:**
- `story-1-e2e-framework-setup.md` → `2.1.e2e-framework-setup.md`
- `story-2-critical-user-journeys.md` → `2.2.critical-user-journeys.md`
- `story-3-cross-browser-integration.md` → `2.3.cross-browser-integration.md`

### **Epic 3: PDF Document Viewer** 🆕 **CREATE NEW**
**Stories to Create:**
- `3.1.assignment-data-model-dashboard.md`
- `3.2.pdf-document-storage-viewing.md`
- `3.3.assignment-document-integration.md`

### **Epic 4: Real-time Messaging System** 🆕 **CREATE NEW**
**Stories to Create:**
- `4.1.message-data-model-threading.md`
- `4.2.realtime-communication-infrastructure.md`
- `4.3.messaging-interface-notifications.md`

### **Epic 5: Digital Signatures Advanced Features** 🆕 **CREATE NEW**
**Stories to Create:**
- `5.1.digital-signature-implementation.md`
- `5.2.assessment-upload-workflow-completion.md`
- `5.3.system-optimization-analytics-foundation.md`

## 🗂️ **Cleanup Actions Required**

### **Files to Remove/Archive:**
- ❌ `story-1-enhanced-user-data-model.md` (duplicates completed 1.1)
- ❌ `story-2-advanced-user-admin-api.md` (duplicates 1.3 scope)

### **Files to Rename:**
- 🔄 `story-1-e2e-framework-setup.md` → `2.1.e2e-framework-setup.md`
- 🔄 `story-2-critical-user-journeys.md` → `2.2.critical-user-journeys.md`
- 🔄 `story-3-cross-browser-integration.md` → `2.3.cross-browser-integration.md`

### **Content to Relocate:**
- 📦 `story-3-user-management-dashboard.md` content → Move to Epic 3 (PDF Document Viewer)
  - Rename to: `3.1.assignment-data-model-dashboard.md`

## 📋 **Implementation Standards**

### **File Naming Rules:**
1. **Format:** `{epic}.{story}.{kebab-case-title}.md`
2. **Epic Numbers:** Start at 1, increment sequentially
3. **Story Numbers:** Start at 1 within each epic, increment sequentially
4. **Titles:** Descriptive, kebab-case, 3-6 words maximum
5. **Extensions:** Always `.md` for story files

### **Epic Story Limits:**
- **Recommended:** 3-5 stories per epic (optimal for sprint planning)
- **Maximum:** 9 stories per epic (single-digit for simplicity)
- **If exceeded:** Split into multiple epics

### **File Header Requirements:**
```markdown
# Story {epic}.{story}: {Title}

## Epic
{Epic Name}

## Status
{Draft|Approved|InProgress|Review|Done}
```

### **Story Index Maintenance:**
- Update `docs/stories/index.md` with new naming convention
- Maintain epic groupings in index file
- Update cross-references in other documents

## 🔧 **Migration Steps**

### **Phase 1: Cleanup Conflicts** (Immediate)
1. Archive duplicate stories (`story-1-enhanced-user-data-model.md`, etc.)
2. Remove empty files (`story-1-e2e-framework-setup.md` if empty)
3. Document what's being removed in change log

### **Phase 2: Rename Existing Stories** (Sprint Planning)
1. Rename E2E testing framework stories to 2.x format
2. Update all internal references and links
3. Update stories index file

### **Phase 3: Create Missing Stories** (Ongoing)
1. Create Epic 3, 4, 5 stories as needed for future sprints
2. Follow established naming convention
3. Maintain epic-story mapping documentation

## 📊 **Benefits Analysis**

### **Organizational Benefits:**
- 🎯 **Clear Epic Boundaries:** No confusion about story ownership
- 📈 **Scalable Growth:** Support for unlimited future epics
- 🔍 **Easy Navigation:** File sorting and searching improved
- ⚡ **Tool Integration:** Better support for project management tools

### **Development Benefits:**
- 🚀 **Sprint Planning:** Clear story sequencing within epics
- 🔄 **Dependency Management:** Epic-level dependencies easier to track
- 📋 **Progress Tracking:** Epic completion status immediately visible
- 🛠️ **Automation:** Consistent naming enables better tooling

### **Documentation Benefits:**
- 📖 **Self-Documenting:** File names convey structure
- 🔗 **Linking:** Consistent reference patterns
- 📚 **Maintenance:** Easier to maintain story catalogs
- 🔍 **Discovery:** New team members can navigate intuitively

## ⚡ **Quick Implementation Commands**

### **Immediate Actions:**
```bash
# Archive conflicting files
mv story-1-enhanced-user-data-model.md archive/
mv story-2-advanced-user-admin-api.md archive/

# Rename E2E testing stories
mv story-1-e2e-framework-setup.md 2.1.e2e-framework-setup.md
mv story-2-critical-user-journeys.md 2.2.critical-user-journeys.md
mv story-3-cross-browser-integration.md 2.3.cross-browser-integration.md

# Move misplaced content
mv story-3-user-management-dashboard.md 3.1.assignment-data-model-dashboard.md
```

## 📈 **Success Metrics**

### **Immediate (Post-Implementation):**
- ✅ Zero duplicate story numbers across epics
- ✅ All stories clearly associated with correct epic
- ✅ File naming convention 100% consistent

### **Ongoing (Sprint Cycles):**
- ✅ New stories follow naming convention
- ✅ Story index remains current
- ✅ Cross-references stay accurate
- ✅ Development team reports improved navigation

## 🔮 **Future Considerations**

### **Potential Extensions:**
- **Sub-Stories:** `1.1.1`, `1.1.2` for complex stories (if needed)
- **Story Types:** `1.1.spike.research-task.md` for spikes
- **Status Suffixes:** `1.1.user-model.draft.md` vs `1.1.user-model.md`

### **Tool Integration Opportunities:**
- **Automated Story Creation:** Templates based on naming convention
- **Progress Dashboards:** Epic completion tracking
- **Dependency Analysis:** Cross-epic dependency mapping

---

## 🎯 **Recommendation**

**ADOPT the Epic.Story format immediately** for the following reasons:

1. **Proven Success:** Epic 1 stories (1.1, 1.2, 1.3) are well-organized and successful
2. **Minimal Disruption:** Most stories already follow this pattern
3. **Clear Benefits:** Eliminates current confusion and conflicts
4. **Industry Standard:** Aligns with common agile practices
5. **Tool Ready:** Works well with project management and development tools

This standardization will significantly improve story organization, reduce confusion, and enhance the overall development workflow efficiency.
