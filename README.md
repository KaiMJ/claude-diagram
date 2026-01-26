# Architecture Diagram

Generate interactive architecture diagrams from YAML using React Flow.

## Usage

### Generate Diagrams with Claude

```
/diagram <file_path_or_directory>
```

Or describe what you want:
```
/diagram "Create a diagram showing the auth flow with OAuth, sessions, and database"
```

Claude will generate the YAML and add it to the `backend/diagrams/` folder.

### Run the Viewer

```bash
# Start both backend and frontend
./run.sh
```

Or manually:
```bash
# Backend (localhost:8000)
cd backend && uvicorn main:app --reload

# Frontend (localhost:3000)
cd frontend && pnpm dev
```

## YAML Format

Create `backend/diagrams/{slug}.yaml`:

```yaml
groups:
  - id: group_a
    label: Group A
    style: bronze  # bronze | silver | gold | controlPlane | queryEngine | external

nodes:
  - id: node_1
    label: "Node 1"
    style: primary  # default | primary | gold | silver | bronze | success | warning | error
    parent: group_a

edges:
  - source: node_1
    target: node_2
    label: "connects"  # optional
    style: standard    # standard | dashed | read | write | error | reference
```

Register in `backend/diagrams/MASTER_DIAGRAM.yaml`:

```yaml
categories:
  - id: overview
    label: Overview
    icon: "🏠"

diagrams:
  - slug: my-diagram
    title: My Diagram
    category: overview
    icon: "📊"
    description: Description here
```

## Features

- **Auto Layout**: Vertical/Horizontal via Dagre
- **Interactive**: Pan, zoom, drag nodes, resize
- **Highlighting**: Click node to highlight connections
- **Multi-select**: Shift+click or drag to select multiple
- **Dark Mode**: Toggle in sidebar
- **Save Layout**: Persist custom positions
