#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "  PostgreSQL is unavailable ??? retrying in 2s..."
  sleep 2
done

echo "PostgreSQL is ready. Starting Uvicorn..."

exec uvicorn main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 1 \
  --no-access-log
