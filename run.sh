#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Initialize ports (finds available port and writes to .ports.json + frontend/.env.local)
echo "Installing backend dependencies..."
if ! command -v uv &>/dev/null; then
    echo "uv not found. Install: curl -LsSf https://astral.sh/uv/install.sh | sh" >&2
    exit 1
fi
(cd backend && uv sync)

echo "Installing frontend dependencies..."
(
  cd frontend
  if command -v pnpm &>/dev/null; then
    pnpm install
  else
    npm install
  fi
)

python3 scripts/ports.py init

# Read the backend port
BACKEND_PORT=$(python3 scripts/ports.py get backend)
echo "Starting backend on port $BACKEND_PORT"

# Cleanup function
cleanup() {
    echo "Shutting down..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start backend
(
  cd backend
  source .venv/bin/activate
  uvicorn main:app --reload --port "$BACKEND_PORT"
) &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend..."
for i in {1..30}; do
    if curl -s "http://127.0.0.1:$BACKEND_PORT/health" > /dev/null 2>&1; then
        echo "Backend ready!"
        break
    fi
    sleep 0.5
done

# Start frontend
(
  cd frontend
  if command -v pnpm &>/dev/null; then
    pnpm dev
  else
    npm run dev
  fi
) &
FRONTEND_PID=$!

wait
