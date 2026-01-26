# Architecture Diagram

A standalone, minimal project for generating interactive architecture diagrams using YAML configuration and React Flow.

## Quick Start

```bash
./run.sh
```

### 1. Start the Backend at http://localhost:8000

```bash
# use uv or pip install
uvicorn main:app --reload
```

### 2. Start the Frontend at http://localhost:3000

```bash
cd frontend
npm install
npm run dev
```

## Creating Diagrams

### 1. Add to Master Manifest

Edit `backend/diagrams/MASTER_DIAGRAM.yaml`:

```yaml
categories:
  - id: my-category
    label: My Category
    icon: "📁"

diagrams:
  - slug: my-diagram
    title: My Diagram
    category: my-category
    icon: "📊"
    description: Description of the diagram
```

### 2. Create Diagram YAML

Create `backend/diagrams/my-diagram.yaml`:

```yaml
groups:
  - id: group_a
    label: Group A
    style: bronze # bronze | silver | gold | controlPlane | queryEngine | external

nodes:
  - id: node_1
    label: Node 1
    style: default # default | gold | silver | bronze | primary | success | warning | error
    parent: group_a

  - id: node_2
    label: Node 2
    style: primary
    parent: group_a

edges:
  - source: node_1
    target: node_2
    label: connects # optional
    style: standard # standard | dashed | longDashed | read | write | error | reference
    animated: false # optional
```

## YAML Schema Reference

### Groups

| Field    | Type   | Description                 |
| -------- | ------ | --------------------------- |
| `id`     | string | Unique identifier           |
| `label`  | string | Display label               |
| `style`  | string | Visual style (see below)    |
| `parent` | string | Parent group ID for nesting |

**Group Styles:** `controlPlane`, `bronze`, `silver`, `gold`, `queryEngine`, `external`

### Nodes

| Field    | Type   | Description              |
| -------- | ------ | ------------------------ |
| `id`     | string | Unique identifier        |
| `label`  | string | Display label            |
| `style`  | string | Visual style (see below) |
| `parent` | string | Parent group ID          |

**Node Styles:** `default`, `gold`, `silver`, `bronze`, `primary`, `success`, `warning`, `error`

### Edges

| Field      | Type    | Description                 |
| ---------- | ------- | --------------------------- |
| `source`   | string  | Source node ID              |
| `target`   | string  | Target node ID              |
| `label`    | string  | Edge label (optional)       |
| `style`    | string  | Visual style (see below)    |
| `animated` | boolean | Animate the edge (optional) |

**Edge Styles:** `standard`, `dashed`, `longDashed`, `read`, `write`, `error`, `reference`

## Features

- **Interactive Canvas**: Pan, zoom, and navigate diagrams
- **Resizable Nodes**: Select and drag handles to resize
- **Drag & Drop**: Reposition nodes freely
- **Auto Layout**: Vertical (TB) and Horizontal (LR) layouts via Dagre
- **Fit View**: Center and fit diagram in viewport
- **Save Layout**: Persist custom positions to backend
- **Reset**: Re-apply auto layout

## Project Structure

```
architecture-diagram/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── routes/
│   │   ├── diagrams.py      # Diagram CRUD
│   │   └── layouts.py       # Layout persistence
│   ├── diagrams/            # YAML diagram files
│   └── layouts/             # Saved layout JSON files
│
├── frontend/
│   └── src/
│       ├── app/             # Next.js app
│       ├── components/      # React components
│       └── lib/             # Utilities, API, styles
│
└── README.md
```

## API Endpoints

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | `/diagrams`        | List all diagrams |
| GET    | `/diagrams/{slug}` | Get diagram data  |
| GET    | `/layouts/{slug}`  | Get saved layout  |
| POST   | `/layouts/{slug}`  | Save layout       |

## License

MIT
