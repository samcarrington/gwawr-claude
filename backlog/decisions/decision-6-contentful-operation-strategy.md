# Decision 6: Contentful Operation Strategy - MCP vs Node.js Direct

## Status
Accepted

## Date
2025-07-12

## Context

During the implementation of Contentful content model enhancements (tasks high.1, medium.1, medium.2), we experimented with different approaches for executing Contentful operations:

1. **MCP Server (@ivotoby/contentful-management-mcp-server)** via Task tool
2. **Node.js scripts** using Contentful Management API directly
3. **Mixed approach** switching between methods inconsistently

Initial attempts used MCP for both information gathering and complex operations, leading to:
- Inconsistent execution patterns
- Repeated failed attempts to run migrations via MCP Task calls
- Need to constantly switch approaches mid-task
- Difficulty in maintaining consistent workflow

## Decision

We will use a **hybrid approach** with clear boundaries:

### **Use Contentful MCP Server for:**
- ✅ **Atomic information gathering**
  - Checking content type structures
  - Inspecting individual entries
  - Quick field verification
  - Content discovery and analysis
  - Single-query data retrieval

### **Use Node.js Direct Scripts for:**
- ✅ **Complex migrations and bulk operations**
  - Content type field additions/modifications
  - Bulk data population across multiple entries
  - Multi-step migration processes
  - Operations requiring error handling and retry logic
  - Scripts that need to be version-controlled and reusable

### **Consistency Principles:**
1. **Pick one method per task** - Don't switch approaches mid-task
2. **Node.js scripts use environment variables** - Never hardcode credentials
3. **All scripts have .cjs extension** - For CommonJS compatibility in ES module projects
4. **Scripts follow naming pattern**: `{operation}-{contenttype}-{purpose}.cjs`
5. **Each script includes verification and error handling**

## Rationale

### **MCP Server Strengths:**
- Excellent for quick, atomic operations
- Good for analysis and discovery
- Minimal setup required
- Interactive exploration

### **MCP Server Limitations:**
- Not reliable for complex migrations
- Difficult to handle multi-step operations
- Limited error handling and retry capabilities
- Not version-controlled or reusable

### **Node.js Direct Strengths:**
- Full control over execution flow
- Robust error handling and logging
- Version-controlled and reusable
- Can handle complex multi-step operations
- Better for production-grade migrations

### **Node.js Direct Limitations:**
- More setup required
- Need to manage dependencies and configuration

## Implementation Examples

### ✅ Good MCP Usage:
```javascript
// Quick content type inspection
Task: "Check if the blogPost content type has the slug field"

// Single entry verification
Task: "Get the details of blog post entry XYZ to verify new fields"
```

### ✅ Good Node.js Direct Usage:
```javascript
// Complex migration
node scripts/migrate-project-fields.cjs

// Bulk data population
node scripts/populate-testimonial-data.cjs

// Comprehensive verification
node scripts/verify-blogpost-fields.cjs
```

### ❌ Anti-patterns to Avoid:
```javascript
// Don't use MCP for complex operations
Task: "Execute this migration script with 50 field updates"

// Don't hardcode credentials in scripts
const MANAGEMENT_TOKEN = 'CFPAT-hardcoded-token'

// Don't switch methods mid-task
// Use MCP, then Node.js, then back to MCP
```

## Consequences

### **Positive:**
- Consistent and predictable workflow
- Clear boundaries for tool usage
- Better maintainability of migration scripts
- Improved security with environment variables
- Version-controlled migration processes

### **Negative:**
- Need to maintain both MCP knowledge and Node.js scripting
- Slight overhead in script creation for complex operations
- Need to ensure environment variables are properly configured

## Compliance

This decision was implemented during:
- ✅ task-high.1 (blogPost enhancement) - Started with MCP, switched to Node.js consistency
- ✅ task-medium.1 (project enhancement) - Full Node.js direct approach
- ✅ task-medium.2 (testimonial enhancement) - Full Node.js direct approach

## Related Decisions

- [Decision 3: Use Contentful Headless CMS](decision-3-use-contentful-headless-cms.md)
- [Decision: Security guidelines for API key management](../tasks/task-37-establish-security-guidelines-for-api-key-management.md)

## Review

This decision should be reviewed if:
- MCP server capabilities significantly improve for complex operations
- Contentful introduces new migration tools or APIs
- Team workflow changes significantly
- Security requirements change

---

**Contributors:** Claude  
**Reviewed by:** _Pending review_  
**Next review date:** 2025-10-12