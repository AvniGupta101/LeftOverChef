#!/usr/bin/env bash
set -e
HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}
MODEL_STATE_PATH=${MODEL_STATE_PATH:-model_state_dict.pth}
MODEL_URL=${MODEL_URL:-""}
WORKERS=${WORKERS:-1}

# Download model if not present and MODEL_URL provided
if [ ! -f "$MODEL_STATE_PATH" ] && [ -n "$MODEL_URL" ]; then
  echo "Downloading model from MODEL_URL..."
  curl -L --progress-bar "$MODEL_URL" -o "$MODEL_STATE_PATH"
fi

# Start uvicorn. Use --lifespan off if you hit startup issues.
exec uvicorn app:app --host "$HOST" --port "$PORT" --workers "$WORKERS"
