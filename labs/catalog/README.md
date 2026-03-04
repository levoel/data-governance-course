# Catalog Lab: OpenMetadata Data Catalog

A self-contained Docker Compose environment for hands-on data catalog exercises using OpenMetadata. Practice catalog API operations, metadata tagging, PII classification, and lineage exploration against a real OpenMetadata instance with pre-populated e-commerce data.

## System Requirements

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| Docker Desktop | v24+ | Or Docker Engine + Docker Compose v2 on Linux |
| RAM allocated to Docker | **6 GB** | 8 GB total system RAM recommended |
| Free disk space | 10 GB | Docker images + volumes |
| Available ports | 15432, 18585, 19200, 18888 | Non-standard to avoid conflicts |

### Platform-Specific Setup

**macOS (Docker Desktop):**
1. Open Docker Desktop > Settings > Resources
2. Set Memory to **6 GB** (or higher)
3. Apply & Restart

**Windows (WSL2 + Docker Desktop):**
1. Create or edit `%USERPROFILE%\.wslconfig`:
   ```
   [wsl2]
   memory=6GB
   ```
2. Restart WSL: `wsl --shutdown` then reopen terminal
3. In Docker Desktop > Settings > Resources, verify memory is 6+ GB

**Linux (Docker Engine):**
- Native Docker uses host memory directly
- Verify available memory: `free -h` (need 6+ GB free)
- Check Docker: `docker info | grep "Total Memory"`

## Quick Start

```bash
# 1. Copy environment configuration
cp .env.example .env

# 2. Start all services
docker compose up -d

# 3. Wait for OpenMetadata to initialize (3-5 minutes)
#    Check progress:
docker compose logs -f openmetadata-server

# 4. Verify all services are healthy
docker compose ps
```

**Expected startup time:** 3-5 minutes for OpenMetadata to complete database migrations and initialize. The Jupyter service will not start until OpenMetadata is healthy.

## Accessing the Lab

| Service | URL | Credentials |
|---------|-----|-------------|
| OpenMetadata UI | http://localhost:18585 | admin / admin |
| Jupyter Notebooks | http://localhost:18888 | No authentication |
| PostgreSQL | localhost:15432 | lab / lab_password (database: ecommerce) |
| Elasticsearch | http://localhost:19200 | No authentication |

## Lab Exercises

The `notebooks/` directory contains 4 guided exercises:

| Notebook | Topic | Key Skills |
|----------|-------|------------|
| **01-catalog-exploration** | Navigate the catalog, add PostgreSQL connector | Server API, connector setup, table discovery |
| **02-catalog-api-basics** | CRUD operations on metadata | FQN, PATCH API, descriptions, ownership |
| **03-tagging-classification** | Tag PII columns, apply tier classification | PII tagging, tier labels, tag-based queries |
| **04-search-lineage** | Full-text search, lineage exploration | Search API, FK lineage, impact analysis |

**Recommended order:** Complete notebooks sequentially (01 -> 02 -> 03 -> 04). Each builds on the previous.

## Architecture

```
+------------------+     +------------------+     +------------------+
|   PostgreSQL     |     |  Elasticsearch   |     |    Jupyter       |
|  (port 15432)    |     |   (port 19200)   |     |  (port 18888)    |
|                  |     |                  |     |                  |
| - openmetadata_db|     | - Catalog search |     | - 4 notebooks    |
| - ecommerce db   |     |   index          |     | - REST API calls |
+--------+---------+     +--------+---------+     +--------+---------+
         |                         |                        |
         +------------+------------+                        |
                      |                                     |
              +-------+--------+                            |
              | OpenMetadata   +<---------------------------+
              |   Server       |    (API: /api/v1/*)
              | (port 18585)   |
              +----------------+
```

**Memory budget (~4-5 GB total):**
- OpenMetadata Server: ~1.2 GB (768 MB heap)
- Elasticsearch: ~800 MB (512 MB heap)
- PostgreSQL: ~250 MB
- Jupyter: ~400 MB

## Troubleshooting

### OpenMetadata not starting

**Symptoms:** UI shows 502 error, `docker compose ps` shows unhealthy.

```bash
# Check server logs
docker compose logs openmetadata-server

# Check migration logs (must complete before server starts)
docker compose logs execute-migrate-all
```

**Common causes:**
- Not enough memory allocated to Docker (need 6+ GB)
- Elasticsearch not ready yet (server depends on ES being healthy)
- Migration still running (wait 3-5 minutes)

### Elasticsearch OOM (exit code 137)

**Symptoms:** ES container keeps restarting, exit code 137.

```bash
# Check ES status
docker compose logs elasticsearch | tail -20
```

**Fix:** Increase Docker memory allocation to 6+ GB. The lab ES uses reduced heap (512 MB) but still needs headroom.

### Port conflicts

**Symptoms:** `Bind for 0.0.0.0:XXXXX failed: port already allocated`

```bash
# Check what's using the port (macOS/Linux)
lsof -i :15432
lsof -i :18585

# Change ports in .env:
POSTGRES_PORT=25432
OM_PORT=28585
ES_PORT=29200
JUPYTER_PORT=28888
```

### Stale data after changing init scripts

PostgreSQL init scripts only run on first volume initialization.

```bash
# Full reset (destroys all data and volumes)
docker compose down -v
docker compose up -d
```

### Jupyter notebooks not connecting to OpenMetadata

**Symptoms:** `ConnectionError` in notebook cells.

```bash
# Verify OpenMetadata is healthy
docker compose ps

# Check network connectivity from Jupyter container
docker compose exec jupyter curl -s http://openmetadata-server:8585/api/v1/system/version
```

## Cleanup

```bash
# Stop lab (preserves data in volumes)
docker compose down

# Full cleanup (removes data, volumes, and images)
docker compose down -v --rmi all
```

**Warning:** Do not run the catalog lab and quality lab (`labs/quality/`) simultaneously. Combined memory exceeds 8 GB. Stop one before starting the other:

```bash
# Stop catalog lab before starting quality lab
cd labs/catalog && docker compose down
cd ../quality && docker compose up -d
```

## Technical Details

- **OpenMetadata version:** 1.5.15 (from docker.getcollate.io registry)
- **Elasticsearch version:** 8.10.2 (matching OM 1.5.x requirements)
- **PostgreSQL:** OpenMetadata custom image (1.5.15) with two databases:
  - `openmetadata_db` -- OM internal metadata store
  - `ecommerce` -- Sample data for lab exercises
- **Jupyter:** minimal-notebook with requests + psycopg2-binary
- **No Airflow/ingestion container** -- students configure connectors via UI (saves ~2 GB RAM)
