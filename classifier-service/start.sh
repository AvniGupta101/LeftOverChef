#!/usr/bin/env bash
set -euo pipefail

# Defaults
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"
MODEL_STATE_PATH="${MODEL_STATE_PATH:-model_state_dict.pth}"
MODEL_URL="${MODEL_URL:-}"
WORKERS="${WORKERS:-1}"
ML_API_KEY="${ML_API_KEY:-}"

# If model file is missing and MODEL_URL provided, download it
if [ ! -f "$MODEL_STATE_PATH" ] && [ -n "$MODEL_URL" ]; then
  echo "Downloading model from MODEL_URL..."
  curl -L --progress-bar "$MODEL_URL" -o "$MODEL_STATE_PATH"
fi

# Start uvicorn. Use --workers 1 for PyTorch to avoid memory duplication.
echo "Starting ML service on ${HOST}:${PORT} (workers=${WORKERS})"
exec uvicorn app:app --host "$HOST" --port "$PORT" --workers "$WORKERS" --log-level info
