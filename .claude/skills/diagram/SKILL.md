---
name: architecture-diagram
description: Generates architecture diagrams for directories, modules, or files. Use when the user asks to "diagram this", "show architecture", "visualize the structure", "create a flowchart", or wants to understand how components connect.
---

You are an expert software architect specializing in codebase visualization. You create **clear, accurate, insightful diagrams** using YAML data files.

---

## FIRST: Read the Master Diagram Manifest

**Before creating any diagram, ALWAYS read `backend/diagrams/MASTER_DIAGRAM.yaml`** to understand:

1. **Existing diagrams** - What's already documented, avoid duplication
2. **Connections** - How modules relate to each other
3. **Planned diagrams** - What's on the roadmap
4. **Coverage gaps** - What files aren't covered by existing diagrams

---

## Creating a New Diagram (YAML-Only Workflow)

**LLM workflow is minimal - only YAML files:**

1. **Create** `backend/diagrams/{slug}.yaml` with groups, nodes, edges, and annotations
2. **Update** `backend/diagrams/MASTER_DIAGRAM.yaml` manifest with metadata
3. **Done** - No TypeScript editing needed! Frontend fetches everything from API.

### Step 1: Create YAML Data File

```yaml
# backend/diagrams/{slug}.yaml

# Optional: Diagram metadata for progress header
meta:
  title: "My Architecture"
  description: "High-level overview of the system"

groups:
  - id: Group_Example
    label: Example Group
    style: controlPlane # controlPlane | bronze | silver | gold | queryEngine | external
    parent: Group_Parent # optional, for nesting

nodes:
  - id: my_node
    label: "My Node\n(Description)"
    style: primary # gold | silver | bronze | default | primary | success | warning | error
    parent: Group_Example
    status: tested # NEW: not_started | in_progress | implemented | tested | blocked
    metadata: # NEW: Detail panel info
      file: "src/my_module.py"
      summary: "Handles authentication flow"
      todos:
        - "Add rate limiting"
        - "Implement refresh tokens"
      links:
        - label: "Design Doc"
          url: "#design-section"

edges:
  - source: node_a
    target: node_b
    label: relationship # optional
    style: dashed # optional: standard | dashed | longDashed | read | write | error | reference
    animated: true # optional

# NEW: Annotations for development guidance
annotations:
  - id: ann_1
    type: todo # todo | warning | idea
    message: "Implement error handling before release"
    targetId: my_node
    targetType: node
```

### Step 2: Update Manifest

Add entry to `backend/diagrams/MASTER_DIAGRAM.yaml`:

```yaml
diagrams:
  - slug: my-diagram
    title: My Diagram
    category: backend # overview | backend | frontend
    icon: "📊" # required - displayed in sidebar
    focus: What this diagram shows
    entry_points:
      - backend/src/my-module/
    core_files:
      - backend/src/my-module/*.py
    connections:
      - other-diagram # related diagrams
```

**That's it!** The frontend automatically fetches the diagram list and data from the backend API.

---

## Living Project Tracker Features

The diagram system supports **implementation progress tracking**:

### Status Badges

Each node can display a status badge in the top-right corner:

| Status         | Icon | Color  | Meaning                |
| -------------- | ---- | ------ | ---------------------- |
| `not_started`  | ○    | Gray   | Not yet touched        |
| `in_progress`  | ◐    | Blue   | Currently working      |
| `implemented`  | ◑    | Green  | Code written           |
| `tested`       | ●    | Purple | Tests passing          |
| `blocked`      | ✕    | Red    | Has issues/blockers    |

### Node Metadata (Detail Panel)

Click any node to open a slide-in detail panel showing:

- **File path** - Direct link to source code
- **Summary** - Brief description of the component
- **TODOs** - Actionable items for this component
- **Links** - Related docs, design specs, PRs

### Annotations

Add visual markers to nodes for dev guidance:

| Type      | Icon | Color  | Use For                          |
| --------- | ---- | ------ | -------------------------------- |
| `todo`    | !    | Yellow | Next steps, action items         |
| `warning` | ⚠    | Orange | Performance concerns, tech debt  |
| `idea`    | 💡   | Cyan   | Suggestions, future improvements |

### Progress Header

The diagram shows a progress header (top-left) with:
- Overall completion percentage
- Breakdown by status (tested, implemented, in progress, blocked)

---

## Available Styles

### Node Styles

| Style     | Use For                                    |
| --------- | ------------------------------------------ |
| `gold`    | Core/critical components, gold layer data  |
| `silver`  | Intermediate processing, silver layer data |
| `bronze`  | Raw inputs, bronze layer data              |
| `default` | Standard components, utilities             |
| `primary` | Entry points, APIs, main interfaces        |
| `success` | Success states, validated data             |
| `warning` | Caution points, deprecated                 |
| `error`   | Error handlers, failure paths              |

### Group Styles

| Style          | Use For                                 |
| -------------- | --------------------------------------- |
| `controlPlane` | Orchestration, scheduling, coordination |
| `bronze`       | Raw data layer                          |
| `silver`       | Cleaned/typed data layer                |
| `gold`         | Aggregated/business-ready layer         |
| `queryEngine`  | Query/read path components              |
| `external`     | External systems                        |

### Edge Styles

| Style        | Use For                    |
| ------------ | -------------------------- |
| `standard`   | Direct dependencies        |
| `dashed`     | Optional/conditional flows |
| `longDashed` | Weak dependencies          |
| `read`       | Read operations (green)    |
| `write`      | Write operations (blue)    |
| `error`      | Error flows (red)          |
| `reference`  | FK relationships           |

---

## Example: Project Tracker Diagram

```yaml
# backend/diagrams/auth-flow.yaml

meta:
  title: "Auth Module"
  description: "Authentication and authorization flow"

groups:
  - id: Group_External
    label: External
    style: external

  - id: Group_Auth
    label: Auth Layer
    style: controlPlane

nodes:
  # External
  - id: client
    label: "Client\n(Browser/App)"
    style: default
    parent: Group_External

  # Auth Layer
  - id: auth_handler
    label: "AuthHandler\n(/api/auth)"
    style: primary
    parent: Group_Auth
    status: tested
    metadata:
      file: "src/handlers/auth.py"
      summary: "HTTP endpoint for authentication requests"

  - id: auth_service
    label: "AuthService\n(Business Logic)"
    style: gold
    parent: Group_Auth
    status: implemented
    metadata:
      file: "src/services/auth.py"
      summary: "Core auth logic: login, logout, token validation"
      todos:
        - "Add MFA support"
        - "Implement password reset"

  - id: token_manager
    label: "TokenManager"
    style: silver
    parent: Group_Auth
    status: in_progress
    metadata:
      file: "src/services/token.py"
      summary: "JWT token creation and validation"

edges:
  - source: client
    target: auth_handler
    label: HTTP

  - source: auth_handler
    target: auth_service

  - source: auth_service
    target: token_manager
    style: dashed

annotations:
  - id: ann_mfa
    type: todo
    message: "MFA implementation is next priority"
    targetId: auth_service
    targetType: node

  - id: ann_perf
    type: warning
    message: "Token refresh latency needs optimization"
    targetId: token_manager
    targetType: node
```

---

## Analysis Process

1. **Read files** to understand components and relationships
2. **Identify groups** - directories, layers, or domains
3. **Map nodes** - services, handlers, models, utilities
4. **Draw edges** - imports, data flow, dependencies
5. **Choose styles** based on component type/layer
6. **Add status** - track implementation progress
7. **Add metadata** - file paths, summaries, todos
8. **Add annotations** - highlight next steps, concerns

---

## Checklist

When creating a new diagram:

- [ ] Read `backend/diagrams/MASTER_DIAGRAM.yaml` manifest first
- [ ] Check if files are already covered by existing diagram
- [ ] Create `backend/diagrams/{slug}.yaml`
- [ ] Add `meta` block with title and description
- [ ] Add `status` to nodes reflecting implementation state
- [ ] Add `metadata` (file, summary, todos) for key components
- [ ] Add `annotations` for dev guidance (todos, warnings, ideas)
- [ ] Update `backend/diagrams/MASTER_DIAGRAM.yaml` with new entry
- [ ] Summarize what was created and key insights

**No TypeScript editing required!**
