#!/usr/bin/env bash
set -e

# Start backend
(
  cd backend
  source .venv/bin/activate
  uvicorn main:app --reload --port 8000
) &

# Start frontend (use pnpm per repo convention; fallback to npm if unavailable)
(
  cd frontend
  if command -v pnpm &>/dev/null; then
    pnpm dev
  else
    npm run dev
  fi
)

wait