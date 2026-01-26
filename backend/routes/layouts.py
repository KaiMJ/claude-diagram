import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

LAYOUTS_DIR = Path(__file__).parent.parent / "layouts"


class LayoutData(BaseModel):
    nodes: list[dict]
    edges: list[dict]


@router.get("/{slug}")
async def get_layout(slug: str):
    """Get saved layout for a diagram."""
    layout_path = LAYOUTS_DIR / f"{slug}.json"
    if not layout_path.exists():
        raise HTTPException(status_code=404, detail=f"Layout for '{slug}' not found")

    with open(layout_path) as f:
        return json.load(f)


@router.post("/{slug}")
async def save_layout(slug: str, layout: LayoutData):
    """Save layout for a diagram."""
    LAYOUTS_DIR.mkdir(parents=True, exist_ok=True)
    layout_path = LAYOUTS_DIR / f"{slug}.json"

    with open(layout_path, "w") as f:
        json.dump(layout.model_dump(), f, indent=2)

    return {"status": "saved", "slug": slug}
