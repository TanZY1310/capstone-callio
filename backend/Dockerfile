# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM python:3.12.7-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM python:3.12.7-slim AS runtime

RUN useradd --no-create-home --shell /bin/false appuser

WORKDIR /app

# libpq5: required at runtime for PostgreSQL connectivity
# postgresql-client: provides pg_isready used in entrypoint.sh
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /install /usr/local

COPY --chown=appuser:appuser . .

# Make entrypoint executable
RUN chmod +x /app/entrypoint.sh

USER appuser

EXPOSE 8000

CMD ["/app/entrypoint.sh"]
