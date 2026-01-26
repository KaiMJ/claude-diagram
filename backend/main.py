from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.diagrams import router as diagrams_router  # noqa: I001
from routes.layouts import router as layouts_router

app = FastAPI(title="Architecture Diagram API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diagrams_router, prefix="/diagrams", tags=["diagrams"])
app.include_router(layouts_router, prefix="/layouts", tags=["layouts"])


@app.get("/health")
async def health():
    return {"status": "ok"}
