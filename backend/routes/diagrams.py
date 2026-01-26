from pathlib import Path

import yaml
from fastapi import APIRouter, HTTPException

router = APIRouter()

DIAGRAMS_DIR = Path(__file__).parent.parent / "diagrams"


@router.get("")
async def list_diagrams():
    """List all diagrams from MASTER_DIAGRAM.yaml."""
    master_path = DIAGRAMS_DIR / "MASTER_DIAGRAM.yaml"
    if not master_path.exists():
        raise HTTPException(status_code=404, detail="MASTER_DIAGRAM.yaml not found")

    with open(master_path) as f:
        master = yaml.safe_load(f)

    return master


@router.get("/{slug}")
async def get_diagram(slug: str):
    """Get a specific diagram by slug."""
    diagram_path = DIAGRAMS_DIR / f"{slug}.yaml"
    if not diagram_path.exists():
        raise HTTPException(status_code=404, detail=f"Diagram '{slug}' not found")

    with open(diagram_path) as f:
        diagram = yaml.safe_load(f)

    diagram["slug"] = slug
    return diagram
