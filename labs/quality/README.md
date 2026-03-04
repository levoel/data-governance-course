# Quality Lab - Great Expectations Data Quality Environment

A self-contained Docker Compose lab for hands-on data quality exercises using Great Expectations 1.x. Students practice data profiling, writing expectations, building expectation suites, running checkpoints, generating Data Docs, and data remediation against an intentionally dirty dataset with documented quality issues.

## System Requirements

- **Docker Desktop** with at least 4 GB RAM allocated (this lab is lightweight)
- **5 GB free disk space** (for Docker images and build cache)
- **Ports 25432 and 28888 available** (check with `lsof -i :25432` / `lsof -i :28888`)

**Total memory usage:** ~1-1.5 GB (PostgreSQL + JupyterLab with GE)

## Quick Start

```bash
# 1. Copy environment config
cp .env.example .env

# 2. Start the lab (first run builds the Jupyter image -- may take 2-3 minutes)
docker compose up -d --build

# 3. Check status
docker compose ps

# 4. Open JupyterLab
open http://localhost:28888
```

## Accessing the Lab

| Service | URL / Connection | Credentials |
|---------|-----------------|-------------|
| JupyterLab | http://localhost:28888 | No authentication required |
| PostgreSQL | `localhost:25432` | User: `lab`, Password: `lab_password`, Database: `quality_lab` |

**Direct PostgreSQL connection (from host):**
```bash
psql -h localhost -p 25432 -U lab -d quality_lab
```

## Notebook Exercises

| # | Notebook | Description |
|---|----------|-------------|
| 1 | `01-data-profiling.ipynb` | Explore dirty data with SQL, identify quality issues manually |
| 2 | `02-expectation-basics.ipynb` | Write individual GE 1.x expectations, understand pass/fail results |
| 3 | `03-expectation-suite.ipynb` | Build expectation suites, run checkpoints, analyze aggregated results |
| 4 | `04-data-docs-remediation.ipynb` | Generate Data Docs reports, practice data remediation with SQL |

Complete the notebooks in order. Each builds on concepts from the previous one.

## Dirty Dataset

The PostgreSQL database contains two intentionally dirty tables:

**`dirty_customers`** (42 rows): NULL emails, NULL names, duplicate IDs, invalid email formats, future registration dates, temporal inconsistencies, empty strings, oversized phone numbers.

**`dirty_orders`** (41 rows): Orphan customer IDs (referential integrity violations), delivery before order date, invalid status values, negative amounts, zero amounts, duplicate order IDs, NULL dates, future dates.

Every quality issue is documented with SQL comments in `init/01-create-dirty-dataset.sql`.

## Great Expectations Version Note

This lab uses **Great Expectations 1.x API** (version 1.13.0). The lesson content (M04, Lesson 06) references 0.18.x patterns for pedagogical context. The 1.x API is the current standard -- use it for all new projects.

**Key API differences:**

| 0.x Pattern (in lessons) | 1.x Pattern (in lab notebooks) |
|--------------------------|-------------------------------|
| `context.sources.add_pandas()` | `context.data_sources.add_postgres()` |
| `validator.expect_column_values_to_be_unique("col")` | `gx.expectations.ExpectColumnValuesToBeUnique(column="col")` |
| `context.add_expectation_suite("name")` | `gx.ExpectationSuite(name="name")` |
| `context.add_or_update_checkpoint()` | `gx.Checkpoint(name=..., validation_definitions=[...])` |

## Troubleshooting

**Jupyter image build fails:**
- Check Docker has enough disk space: `docker system df`
- Clear build cache: `docker builder prune`
- Rebuild: `docker compose build --no-cache jupyter`

**GE import errors in notebooks:**
- Rebuild the Jupyter image: `docker compose build --no-cache jupyter && docker compose up -d`
- Verify GE version in notebook: `import great_expectations as gx; print(gx.__version__)`

**Port conflicts (25432 or 28888 already in use):**
- Edit `.env` to change ports: `POSTGRES_PORT=35432` and `JUPYTER_PORT=38888`
- Restart: `docker compose down && docker compose up -d`

**Stale data after editing init scripts:**
- PostgreSQL init scripts only run on first volume creation
- Reset: `docker compose down -v && docker compose up -d --build`

**Cannot connect to PostgreSQL from notebooks:**
- Use hostname `postgresql` (not `localhost`) -- notebooks run inside Docker network
- Use port `5432` (internal), not `25432` (host-mapped)

## Cleanup

```bash
# Stop containers (preserves data volume)
docker compose down

# Stop containers AND delete data (full reset)
docker compose down -v
```

## Important

Do not run the quality lab and catalog lab simultaneously. Their combined memory usage may exceed the 8 GB budget for machines with limited RAM. Stop one lab before starting the other:

```bash
# Stop catalog lab first
cd ../catalog && docker compose down

# Then start quality lab
cd ../quality && docker compose up -d --build
```
