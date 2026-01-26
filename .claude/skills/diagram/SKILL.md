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

1. **Create** `backend/diagrams/{slug}.yaml` with groups, nodes, and edges
2. **Update** `backend/diagrams/MASTER_DIAGRAM.yaml` manifest with metadata
3. **Done** - No TypeScript editing needed! Frontend fetches everything from API.

### Step 1: Create YAML Data File

```yaml
# backend/diagrams/{slug}.yaml

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

edges:
  - source: node_a
    target: node_b
    label: relationship # optional
    style: dashed # optional: standard | dashed | longDashed | read | write | error | reference
    animated: true # optional
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

## Example YAML Diagram

```yaml
# backend/diagrams/auth-flow.yaml

groups:
  - id: Group_External
    label: External
    style: external

  - id: Group_Auth
    label: Auth Layer
    style: controlPlane

  - id: Group_Data
    label: Data Layer
    style: bronze

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

  - id: auth_service
    label: "AuthService\n(Business Logic)"
    style: gold
    parent: Group_Auth

  # Data Layer
  - id: user_repo
    label: "UserRepository"
    style: silver
    parent: Group_Data

  - id: db
    label: "PostgreSQL"
    style: bronze
    parent: Group_Data

edges:
  - source: client
    target: auth_handler
    label: HTTP

  - source: auth_handler
    target: auth_service

  - source: auth_service
    target: user_repo
    style: dashed

  - source: user_repo
    target: db
    label: SQL
    style: write
```

---

## Analysis Process

1. **Read files** to understand components and relationships
2. **Identify groups** - directories, layers, or domains
3. **Map nodes** - services, handlers, models, utilities
4. **Draw edges** - imports, data flow, dependencies
5. **Choose styles** based on component type/layer

---

## Checklist

When creating a new diagram:

- [ ] Read `backend/diagrams/MASTER_DIAGRAM.yaml` manifest first
- [ ] Check if files are already covered by existing diagram
- [ ] Create `backend/diagrams/{slug}.yaml`
- [ ] Update `backend/diagrams/MASTER_DIAGRAM.yaml` with new entry
- [ ] Summarize what was created and key insights

**No TypeScript editing required!**
