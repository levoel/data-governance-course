# Code Challenge Catalog -- Data Governance Course

**Total Challenges:** 45
**Modules Covered:** M01-M10 (all except M00 Orientation)
**Last Updated:** 2026-03-04

## Purpose

This catalog pre-defines every code challenge in the Data Governance course. Each entry specifies the exact runner, input/output format, validation approach, and determinism justification. Authoring new challenges outside this catalog is not permitted without updating this document first (prevents ad-hoc challenge creation per MODERATE-07).

All challenges use the five existing platform runners. No new dependencies are required.

## Runner Distribution

| Runner | Language | Engine | Target Count | Actual Count |
|--------|----------|--------|-------------|-------------|
| Python (Pyodide) | Python | pyodide | 12-15 | 15 |
| SQL (sql.js) | SQL | sql.js | 5-7 | 5 |
| JSON validation | JSON | json-validator | 8-10 | 12 |
| YAML validation | YAML | yaml-validator | 8-10 | 11 |
| JavaScript | JavaScript | js-sandbox | 2-3 | 2 |
| **Total** | | | **36-44** | **45** |

## Bloom Level Distribution

| Level | Target | Actual | Percentage |
|-------|--------|--------|------------|
| Apply | max 20% (max 9) | 9 | 20.0% |
| Analyze | min 50% (min 22) | 24 | 53.3% |
| Evaluate | remainder | 12 | 26.7% |

## Determinism Rules

Every challenge in this catalog is provably deterministic:

1. **Fixed inputs only** -- no random data generation, no network calls, no time-dependent logic, no environment variables
2. **Exact expected output** -- JSON/YAML challenges validate exact structure; Python/JS/SQL challenges validate exact stdout
3. **Pre-loaded datasets** -- SQL challenges use pre-loaded SQLite tables via sql.js (datasets defined per challenge)
4. **Pattern matching only** -- classifiers use fixed rule sets, not ML models or probabilistic approaches
5. **Test cases** -- each challenge has 2-3 visible test cases + 1-2 hidden test cases
6. **Time limit** -- every challenge is completable in 5-15 minutes

## Challenge ID Convention

Format: `DG-CC-{NN}` where `{NN}` is a zero-padded sequential number (01-45).

When implemented as quiz entries, the code challenge question ID follows: `dg-m{MM}-{LL}-code-{N}` (per quiz ID convention from 28-01).

---

## M01: Foundations (Основы Data Governance) -- 4 Challenges

### DG-CC-01: Governance Maturity Scorer

**Module:** M01 (Основы Data Governance)
**Target Lesson:** Governance maturity models
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that accepts a dictionary of governance dimension scores (data quality, metadata, security, privacy, stewardship) rated 1-5 and returns the overall maturity level (1-5) with a breakdown of which dimensions are below the target level.

**Input:**
```json
{
  "data_quality": 3,
  "metadata_management": 1,
  "security": 4,
  "privacy": 2,
  "stewardship": 2
}
```

**Expected Output:**
```
Overall Maturity: Level 2 (Managed)
Below target (Level 3):
  - metadata_management: 1 (gap: 2)
  - privacy: 2 (gap: 1)
  - stewardship: 2 (gap: 1)
Dimensions at/above target: 2/5
```

**Validation:** exact-match
**Test Cases:** 3 visible + 2 hidden

**Why Deterministic:** Fixed scoring algorithm (average with floor), fixed threshold mapping. Same input always produces same maturity level and gap analysis.

---

### DG-CC-02: Data Domain Classifier

**Module:** M01 (Основы Data Governance)
**Target Lesson:** Data domains and ownership
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that classifies a list of table names into data domains (customer, product, financial, operational, analytics) based on naming patterns and prefixes. Tables that do not match any domain are classified as "unclassified".

**Input:**
```json
[
  "customers", "customer_addresses", "orders", "order_items",
  "products", "product_categories", "inventory",
  "gl_accounts", "invoices", "payments",
  "etl_logs", "job_schedules", "system_config",
  "report_daily_sales", "dim_customer", "fact_orders"
]
```

**Expected Output:**
```json
{
  "customer": ["customers", "customer_addresses", "dim_customer"],
  "product": ["products", "product_categories", "inventory"],
  "financial": ["gl_accounts", "invoices", "payments"],
  "operational": ["etl_logs", "job_schedules", "system_config"],
  "analytics": ["report_daily_sales", "fact_orders"],
  "unclassified": ["orders", "order_items"]
}
```

**Validation:** json-structure
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Classification uses fixed pattern-matching rules (prefix and keyword lists). No ML, no probabilistic matching. Same table names always map to the same domains.

---

### DG-CC-03: Governance Policy Template Validator

**Module:** M01 (Основы Data Governance)
**Target Lesson:** Governance policies and standards
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Apply

**Description:** Create a valid governance policy JSON document that includes all required sections: policy_id, title, version, effective_date, owner, scope, definitions, rules (at least 3), enforcement, and review_schedule.

**Input:** (student writes JSON from scratch)

**Expected Output:**
```json
{
  "policy_id": "DG-POL-001",
  "title": "Data Classification Policy",
  "version": "1.0",
  "effective_date": "2025-01-01",
  "owner": "Chief Data Officer",
  "scope": "All data assets in production systems",
  "definitions": [
    {"term": "Confidential", "meaning": "Data restricted to authorized personnel only"},
    {"term": "Internal", "meaning": "Data available to all employees"},
    {"term": "Public", "meaning": "Data available without restrictions"}
  ],
  "rules": [
    {"id": "R1", "description": "All datasets must be classified within 30 days of creation", "severity": "high"},
    {"id": "R2", "description": "Confidential data must be encrypted at rest and in transit", "severity": "critical"},
    {"id": "R3", "description": "Classification must be reviewed annually", "severity": "medium"}
  ],
  "enforcement": "Automated policy checks via data catalog integration",
  "review_schedule": "annual"
}
```

**Validation:** json-structure (validates required keys, array lengths, nested structure)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** JSON schema validation checks structural completeness. Required fields and minimum array lengths are fixed rules.

---

### DG-CC-04: Stakeholder RACI Generator

**Module:** M01 (Основы Data Governance)
**Target Lesson:** Roles and responsibilities in governance
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that takes a list of governance activities and roles, then generates a RACI matrix. The function must enforce RACI rules: exactly one Accountable per activity, at least one Responsible, and no role can be both Responsible and Accountable for the same activity.

**Input:**
```json
{
  "activities": [
    "Define data classification",
    "Approve access requests",
    "Monitor data quality",
    "Investigate data breaches"
  ],
  "roles": ["CDO", "Data Steward", "Data Engineer", "Legal"],
  "assignments": {
    "Define data classification": {"CDO": "A", "Data Steward": "R", "Data Engineer": "C", "Legal": "I"},
    "Approve access requests": {"CDO": "A", "Data Steward": "R", "Data Engineer": "I", "Legal": "C"},
    "Monitor data quality": {"CDO": "I", "Data Steward": "A", "Data Engineer": "R", "Legal": ""},
    "Investigate data breaches": {"CDO": "I", "Data Steward": "C", "Data Engineer": "R", "Legal": "A"}
  }
}
```

**Expected Output:**
```
RACI Matrix Validation: PASSED

| Activity                   | CDO | Data Steward | Data Engineer | Legal |
|----------------------------|-----|-------------|---------------|-------|
| Define data classification | A   | R           | C             | I     |
| Approve access requests    | A   | R           | I             | C     |
| Monitor data quality       | I   | A           | R             |       |
| Investigate data breaches  | I   | C           | R             | A     |

Summary:
  Activities: 4
  Accountable assignments: 4 (1 per activity)
  Responsible assignments: 4 (at least 1 per activity)
  Violations: 0
```

**Validation:** exact-match
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** RACI validation rules are fixed (exactly one A, at least one R). Formatting is deterministic for given input assignments.

---

## M02: Architecture (Архитектура и Моделирование Данных) -- 7 Challenges

### DG-CC-05: Schema Quality Inspector

**Module:** M02 (Архитектура и Моделирование Данных)
**Target Lesson:** Data modeling best practices
**Language:** SQL
**Runner:** sql.js
**Bloom Level:** Analyze

**Description:** Write SQL queries against the information_schema of a pre-loaded database to identify schema quality issues: tables without primary keys, columns without NOT NULL constraints on required fields, inconsistent naming conventions (mixed camelCase and snake_case), and tables without any indexes.

**Input:** Pre-loaded SQLite database with 8 tables, some with quality issues.

**Expected Output:**
```
Tables without primary key: audit_log, temp_data
Columns missing NOT NULL: users.middle_name, orders.discount_amount
Naming violations: userProfile (camelCase in snake_case schema)
Tables without indexes: audit_log, temp_data, staging_imports
Total issues: 7
```

**Validation:** output-contains (each issue line must appear)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Schema metadata is pre-loaded and fixed. Query results against static schema always return the same quality issues.

---

### DG-CC-06: Naming Convention Checker

**Module:** M02 (Архитектура и Моделирование Данных)
**Target Lesson:** Naming standards and conventions
**Language:** SQL
**Runner:** sql.js
**Bloom Level:** Analyze

**Description:** Write a SQL query that checks all table and column names in a pre-loaded database against a snake_case naming convention. Report violations categorized by type: camelCase, UPPER_CASE, contains-hyphens, starts-with-number, too-short (less than 3 characters).

**Input:** Pre-loaded SQLite database with 10 tables containing various naming convention violations.

**Expected Output:**
```
Naming Convention Report:
  camelCase violations: 4 (userName, orderDate, productId, firstName)
  UPPER_CASE violations: 2 (STATUS_CODE, ERROR_LOG)
  Hyphen violations: 1 (customer-type)
  Numeric prefix violations: 1 (2nd_address)
  Too short violations: 2 (id, tp)
  Total violations: 10 / 45 names checked
  Compliance rate: 77.8%
```

**Validation:** exact-match
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Fixed database schema, fixed naming rules. Same schema always produces identical violation report.

---

### DG-CC-07: Data Model Documentation Generator

**Module:** M02 (Архитектура и Моделирование Данных)
**Target Lesson:** Documentation as governance artifact
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Apply

**Description:** Create a YAML data model documentation file that describes a customer data entity with all required governance metadata: entity name, owner, classification level, retention period, source systems, column definitions (name, type, description, PII flag, nullable), and relationships.

**Input:** (student writes YAML from scratch based on requirements)

**Expected Output:**
```yaml
entity:
  name: customer
  owner: CRM Team
  classification: confidential
  retention_days: 2555
  source_systems:
    - name: crm_postgresql
      sync_frequency: daily
    - name: web_analytics
      sync_frequency: hourly
  columns:
    - name: customer_id
      type: bigint
      description: Unique customer identifier
      pii: false
      nullable: false
    - name: email
      type: varchar
      description: Customer email address
      pii: true
      nullable: false
    - name: full_name
      type: varchar
      description: Customer full name
      pii: true
      nullable: false
    - name: created_at
      type: timestamp
      description: Account creation timestamp
      pii: false
      nullable: false
  relationships:
    - target: orders
      type: one-to-many
      join_key: customer_id
```

**Validation:** json-structure (YAML parsed and validated for required keys and nested structure)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** YAML structure validation checks required keys, nesting depth, and data types. Fixed schema rules.

---

### DG-CC-08: Data Lineage YAML Descriptor

**Module:** M02 (Архитектура и Моделирование Данных)
**Target Lesson:** Data lineage and traceability
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Analyze

**Description:** Create a YAML lineage descriptor that traces a `monthly_revenue` metric from raw source tables through transformation stages to the final dashboard. Must include source tables, transformations (with SQL logic references), intermediate datasets, data quality checks at each stage, and the final output with SLA.

**Input:** (student writes YAML based on provided scenario)

**Expected Output:**
```yaml
lineage:
  metric: monthly_revenue
  owner: Finance Analytics
  sla:
    freshness_hours: 24
    quality_threshold: 0.99

  stages:
    - name: raw_ingestion
      sources:
        - table: payments_raw
          system: postgresql_prod
          classification: confidential
        - table: refunds_raw
          system: postgresql_prod
          classification: confidential
      outputs:
        - table: stg_payments
      quality_checks:
        - type: row_count
          threshold: "> 0"
        - type: freshness
          max_delay_hours: 6

    - name: transformation
      inputs:
        - table: stg_payments
      logic: "dbt model: int_payments_enriched"
      outputs:
        - table: int_payments_enriched
      quality_checks:
        - type: not_null
          columns: [payment_id, amount, currency]
        - type: accepted_values
          column: currency
          values: [RUB, USD, EUR]

    - name: aggregation
      inputs:
        - table: int_payments_enriched
      logic: "dbt model: mart_monthly_revenue"
      outputs:
        - table: mart_monthly_revenue
      quality_checks:
        - type: unique
          columns: [month, currency]
        - type: value_range
          column: revenue
          min: 0

  consumers:
    - name: Revenue Dashboard
      tool: metabase
      refresh: daily
    - name: CFO Monthly Report
      tool: google_sheets
      refresh: monthly
```

**Validation:** json-structure (YAML parsed, validates lineage stages, quality checks at each stage)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Structure validation with fixed required keys. The scenario provides fixed context so only one valid lineage structure satisfies all requirements.

---

### DG-CC-43: Minimal ODCS Data Contract

**Module:** M02 (Архитектура и Моделирование Данных)
**Target Lesson:** ODCS specification
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Apply

**Description:** Write a minimal ODCS v3.1.0 data contract with all 5 required fields (`apiVersion`, `kind`, `id`, `version`, `status`) plus the `fundamentals` section (`name`, `domain`, `description` with `purpose`, `limitations`, `usage`) for DataTech's customer data product.

**Validation:** JSON.stringify of parsed YAML (exact match per Debezium pattern). NOT descriptive strings.

**Input:** (student writes YAML from scratch based on requirements)

**Expected Output:**
```yaml
apiVersion: v3.1.0
kind: DataContract
id: dt-customer-001
version: 1.0.0
status: active
name: customer_data_product
domain: crm
description:
  purpose: Customer master data for CRM and analytics
  limitations: No financial transaction data included
  usage: Use for customer segmentation and retention analysis
```

Test expectedOutput (JSON.stringify of parsed YAML):
```
{"apiVersion":"v3.1.0","kind":"DataContract","id":"dt-customer-001","version":"1.0.0","status":"active","name":"customer_data_product","domain":"crm","description":{"purpose":"Customer master data for CRM and analytics","limitations":"No financial transaction data included","usage":"Use for customer segmentation and retention analysis"}}
```

**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Fixed required fields, fixed values specified in requirements. Student must produce exact YAML structure with specified field values.

---

### DG-CC-44: Complete ODCS Contract with Schema and Quality

**Module:** M02 (Архитектура и Моделирование Данных)
**Target Lesson:** ODCS specification
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Analyze

**Description:** Write a complete ODCS v3.1.0 data contract for DataTech's `customer_data_product` including: required fields, schema section (customers table with 4 columns: `customer_id`, `email`, `full_name`, `created_at` with `logicalType`, `physicalType`, `required`, `classification`, and quality rules on email), `slaProperties` (latency 1d, retention 7y, availability 99.5), and `team` section.

**Validation:** JSON.stringify of parsed YAML (exact match per Debezium pattern). NOT descriptive strings.

**Input:** (student writes YAML based on detailed requirements)

**Expected Output:**
```yaml
apiVersion: v3.1.0
kind: DataContract
id: dt-customer-001
version: 1.0.0
status: active
name: customer_data_product
domain: crm
tenant: DataTech
description:
  purpose: Customer master data for CRM and analytics
  limitations: No financial transaction data included
  usage: Use for customer segmentation and retention analysis
schema:
  - name: customers
    physicalName: customers
    physicalType: table
    description: Customer master data
    properties:
      - name: customer_id
        logicalType: integer
        physicalType: bigint
        required: true
        unique: true
        primaryKey: true
        classification: public
      - name: email
        logicalType: string
        physicalType: varchar
        required: true
        classification: restricted
        quality:
          - metric: nullValues
            mustBe: 0
            type: library
            dimension: completeness
      - name: full_name
        logicalType: string
        physicalType: varchar
        required: true
        classification: restricted
      - name: created_at
        logicalType: timestamp
        physicalType: timestamp
        required: true
        classification: public
slaProperties:
  - property: latency
    value: 1
    unit: d
  - property: retention
    value: 7
    unit: y
  - property: availability
    value: 99.5
team:
  name: CRM Domain Team
  members:
    - username: aivanov
      role: Data Steward
      dateIn: "2025-01-15"
    - username: mpetrov
      role: Data Engineer
      dateIn: "2025-01-15"
```

Test expectedOutput: JSON.stringify of parsed YAML (exact match).

**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** All field values specified in the challenge requirements. Student must produce exact YAML structure with specified column definitions, quality rules, SLA values, and team members.

---

### DG-CC-45: ODCS Quality Rules Definition

**Module:** M02 (Архитектура и Моделирование Данных)
**Target Lesson:** ODCS specification
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Analyze

**Description:** Write ODCS quality rules for DataTech's orders table: `rowCount` > 1000, `nullValues` = 0 for `order_id`, `duplicateValues` = 0 for `order_id`, a SQL-based email format validation, and a freshness check. Include severity levels and scheduling.

**Validation:** JSON.stringify of parsed YAML (exact match per Debezium pattern). NOT descriptive strings.

**Input:** (student writes YAML based on detailed requirements)

**Expected Output:**
```yaml
quality:
  - metric: rowCount
    mustBeGreaterThan: 1000
    type: library
    dimension: completeness
    severity: error
    scheduler: cron
    schedule: "0 20 * * *"
  - metric: nullValues
    mustBe: 0
    type: library
    dimension: completeness
    severity: error
    arguments:
      properties:
        - order_id
  - metric: duplicateValues
    mustBe: 0
    type: library
    dimension: uniqueness
    severity: warning
    arguments:
      properties:
        - order_id
  - type: sql
    query: "SELECT COUNT(*) FROM orders WHERE email NOT LIKE '%@%.%'"
    mustBe: 0
    dimension: conformity
    description: Email format validation
    severity: error
  - type: library
    metric: freshness
    mustBeLessThan: 24
    unit: hours
    dimension: timeliness
    severity: warning
```

Test expectedOutput: JSON.stringify of parsed YAML (exact match).

**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Fixed quality rule structure, fixed metric values, fixed SQL query text. All field values are specified in the challenge requirements.

---

## M03: Metadata & Catalogs (Метаданные и Каталоги Данных) -- 4 Challenges

### DG-CC-09: Data Catalog Entry Creator

**Module:** M03 (Метаданные и Каталоги Данных)
**Target Lesson:** Building a data catalog
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Apply

**Description:** Create a JSON data catalog entry for an `orders` table that includes all required metadata: table name, schema, database, description, owner, tags, classification, columns (with types and descriptions), freshness SLA, and quality score.

**Input:** (student writes JSON from provided requirements)

**Expected Output:**
```json
{
  "table": "orders",
  "schema": "public",
  "database": "production_postgresql",
  "description": "Customer orders with payment and shipping status",
  "owner": "order_management_team",
  "tags": ["transactional", "customer-facing", "pci-relevant"],
  "classification": "confidential",
  "columns": [
    {"name": "order_id", "type": "bigint", "description": "Unique order identifier", "pii": false},
    {"name": "customer_id", "type": "bigint", "description": "Reference to customer", "pii": false},
    {"name": "email", "type": "varchar", "description": "Customer email for order", "pii": true},
    {"name": "total_amount", "type": "decimal", "description": "Order total in RUB", "pii": false},
    {"name": "status", "type": "varchar", "description": "Order status", "pii": false},
    {"name": "created_at", "type": "timestamp", "description": "Order creation time", "pii": false}
  ],
  "freshness_sla_hours": 1,
  "quality_score": 0.94
}
```

**Validation:** json-structure (validates required keys, column array structure, classification enum)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** JSON schema validation against fixed required fields and structure. No dynamic data.

---

### DG-CC-10: Metadata Lineage Graph Builder

**Module:** M03 (Метаданные и Каталоги Данных)
**Target Lesson:** Data lineage and metadata relationships
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Analyze

**Description:** Given a set of dbt model definitions (sources, models, and their dependencies), construct a JSON lineage graph with nodes (tables/models) and edges (dependencies). Identify root nodes (no upstream), leaf nodes (no downstream), and calculate the longest path (pipeline depth).

**Input:**
```json
{
  "sources": ["raw_customers", "raw_orders", "raw_payments"],
  "models": {
    "stg_customers": ["raw_customers"],
    "stg_orders": ["raw_orders"],
    "stg_payments": ["raw_payments"],
    "int_orders_enriched": ["stg_orders", "stg_payments"],
    "mart_customer_orders": ["stg_customers", "int_orders_enriched"],
    "report_revenue": ["mart_customer_orders"]
  }
}
```

**Expected Output:**
```json
{
  "nodes": [
    {"id": "raw_customers", "type": "source", "depth": 0},
    {"id": "raw_orders", "type": "source", "depth": 0},
    {"id": "raw_payments", "type": "source", "depth": 0},
    {"id": "stg_customers", "type": "staging", "depth": 1},
    {"id": "stg_orders", "type": "staging", "depth": 1},
    {"id": "stg_payments", "type": "staging", "depth": 1},
    {"id": "int_orders_enriched", "type": "intermediate", "depth": 2},
    {"id": "mart_customer_orders", "type": "mart", "depth": 3},
    {"id": "report_revenue", "type": "report", "depth": 4}
  ],
  "edges": [
    {"from": "raw_customers", "to": "stg_customers"},
    {"from": "raw_orders", "to": "stg_orders"},
    {"from": "raw_payments", "to": "stg_payments"},
    {"from": "stg_orders", "to": "int_orders_enriched"},
    {"from": "stg_payments", "to": "int_orders_enriched"},
    {"from": "stg_customers", "to": "mart_customer_orders"},
    {"from": "int_orders_enriched", "to": "mart_customer_orders"},
    {"from": "mart_customer_orders", "to": "report_revenue"}
  ],
  "root_nodes": ["raw_customers", "raw_orders", "raw_payments"],
  "leaf_nodes": ["report_revenue"],
  "max_depth": 4,
  "total_nodes": 9,
  "total_edges": 8
}
```

**Validation:** json-structure (validates node/edge arrays, depth calculations, root/leaf identification)
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Graph construction from fixed dependency definitions. Depth calculation is a deterministic DAG traversal. Same dependency input always produces the same graph.

---

### DG-CC-11: Metadata Schema Validator

**Module:** M03 (Метаданные и Каталоги Данных)
**Target Lesson:** Metadata standards and schemas
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Evaluate

**Description:** Given a metadata schema (JSON Schema format) and a set of catalog entries, validate each entry against the schema and produce a detailed compliance report. Identify missing required fields, type mismatches, and enum violations per entry.

**Input:**
```json
{
  "schema": {
    "required": ["table", "owner", "classification", "columns"],
    "properties": {
      "table": {"type": "string"},
      "owner": {"type": "string"},
      "classification": {"type": "string", "enum": ["public", "internal", "confidential", "restricted"]},
      "columns": {"type": "array", "minItems": 1}
    }
  },
  "entries": [
    {"table": "users", "owner": "identity_team", "classification": "confidential", "columns": [{"name": "id"}]},
    {"table": "logs", "classification": "internal", "columns": []},
    {"table": "payments", "owner": "finance", "classification": "secret", "columns": [{"name": "id"}]},
    {"owner": "hr_team", "classification": "restricted", "columns": [{"name": "id"}]}
  ]
}
```

**Expected Output:**
```json
{
  "total_entries": 4,
  "valid": 1,
  "invalid": 3,
  "results": [
    {"entry": "users", "status": "valid", "errors": []},
    {"entry": "logs", "status": "invalid", "errors": ["missing required field: owner", "columns: minItems violation (0 < 1)"]},
    {"entry": "payments", "status": "invalid", "errors": ["classification: 'secret' not in enum [public, internal, confidential, restricted]"]},
    {"entry": "entry_4", "status": "invalid", "errors": ["missing required field: table"]}
  ],
  "compliance_rate": 0.25
}
```

**Validation:** json-structure
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Schema validation rules are fixed. Same schema + entries always produce the same validation report with the same errors.

---

### DG-CC-12: Tag Classifier

**Module:** M03 (Метаданные и Каталоги Данных)
**Target Lesson:** Tagging and classification systems
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that automatically suggests governance tags for database tables based on column names, table names, and existing metadata. Tags include: pii-detected, financial-data, health-data, audit-required, retention-critical, gdpr-relevant, publicly-available.

**Input:**
```json
{
  "tables": [
    {"name": "customers", "columns": ["id", "email", "phone", "inn", "address", "created_at"]},
    {"name": "transactions", "columns": ["id", "customer_id", "amount", "currency", "merchant", "timestamp"]},
    {"name": "patient_records", "columns": ["id", "diagnosis_code", "treatment", "doctor_id", "blood_type"]},
    {"name": "public_products", "columns": ["id", "name", "price", "category", "description"]},
    {"name": "audit_events", "columns": ["id", "user_id", "action", "resource", "timestamp", "ip_address"]}
  ]
}
```

**Expected Output:**
```json
{
  "customers": ["pii-detected", "gdpr-relevant", "retention-critical"],
  "transactions": ["financial-data", "audit-required", "retention-critical"],
  "patient_records": ["pii-detected", "health-data", "gdpr-relevant", "retention-critical"],
  "public_products": ["publicly-available"],
  "audit_events": ["pii-detected", "audit-required", "retention-critical"]
}
```

**Validation:** json-structure
**Test Cases:** 3 visible + 2 hidden

**Why Deterministic:** Tag assignment uses fixed keyword-to-tag mapping rules. Column name patterns (email, phone, inn -> PII; amount, currency -> financial; diagnosis, blood_type -> health) produce consistent tags.

---

## M04: Data Quality (Качество Данных и Observability) -- 7 Challenges

### DG-CC-13: Data Quality Dimension Scorer

**Module:** M04 (Качество Данных и Observability)
**Target Lesson:** Data quality dimensions
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that accepts a dataset (list of dictionaries) and evaluates it across six quality dimensions: completeness, uniqueness, validity, accuracy, consistency, and timeliness. Return a per-dimension score (0.0-1.0) and an overall weighted score.

**Input:**
```json
{
  "data": [
    {"id": 1, "email": "user1@example.com", "age": 25, "country": "RU", "updated": "2025-12-01"},
    {"id": 2, "email": "user2@example.com", "age": 150, "country": "RU", "updated": "2025-12-01"},
    {"id": 3, "email": null, "age": 30, "country": "XX", "updated": "2020-01-01"},
    {"id": 3, "email": "user3@example.com", "age": -5, "country": "US", "updated": "2025-12-01"},
    {"id": 4, "email": "invalid-email", "age": 40, "country": "DE", "updated": "2025-12-01"}
  ],
  "rules": {
    "email": {"type": "email", "required": true},
    "age": {"type": "integer", "min": 0, "max": 120},
    "country": {"type": "iso_country_code"},
    "updated": {"type": "date", "max_age_days": 365}
  },
  "reference_date": "2025-12-15"
}
```

**Expected Output:**
```
Quality Report:
  Completeness: 0.90 (18/20 fields non-null)
  Uniqueness:   0.80 (4/5 unique IDs)
  Validity:     0.65 (13/20 pass format rules)
  Accuracy:     0.80 (age: 3/5 in range, country: 4/5 valid ISO)
  Consistency:  0.80 (4/5 records internally consistent)
  Timeliness:   0.80 (4/5 updated within SLA)

  Overall Score: 0.79 (weighted average)
```

**Validation:** exact-match
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Quality rules are fixed, dataset is fixed, reference date is fixed. Same data with same rules always produces the same dimensional scores.

---

### DG-CC-14: Completeness Calculator

**Module:** M04 (Качество Данных и Observability)
**Target Lesson:** Measuring data completeness
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Apply

**Description:** Write a function that calculates completeness metrics for a dataset: field-level completeness (percentage of non-null values per column), row-level completeness (percentage of rows with all required fields filled), and overall completeness score.

**Input:**
```json
{
  "data": [
    {"name": "Alice", "email": "alice@test.com", "phone": "+79001234567", "department": "Engineering"},
    {"name": "Bob", "email": null, "phone": "+79007654321", "department": "Sales"},
    {"name": "Charlie", "email": "charlie@test.com", "phone": null, "department": null},
    {"name": null, "email": "dave@test.com", "phone": "+79001111111", "department": "HR"},
    {"name": "Eve", "email": "eve@test.com", "phone": "+79002222222", "department": "Engineering"}
  ],
  "required_fields": ["name", "email"]
}
```

**Expected Output:**
```json
{
  "field_completeness": {
    "name": 0.80,
    "email": 0.80,
    "phone": 0.80,
    "department": 0.80
  },
  "row_completeness": 0.60,
  "overall_completeness": 0.80,
  "total_cells": 20,
  "null_cells": 4,
  "rows_with_all_required": 3
}
```

**Validation:** json-structure
**Test Cases:** 3 visible + 1 hidden

**Why Deterministic:** Counting nulls in a fixed dataset. Mathematical operations on fixed data produce fixed results.

---

### DG-CC-15: Freshness Checker

**Module:** M04 (Качество Данных и Observability)
**Target Lesson:** Data observability and freshness SLAs
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that checks table freshness against defined SLAs. Given a list of tables with their last_updated timestamps and SLA definitions, determine which tables are fresh, stale, or critical (exceeded SLA by more than 2x).

**Input:**
```json
{
  "reference_time": "2025-12-15T12:00:00Z",
  "tables": [
    {"name": "orders", "last_updated": "2025-12-15T11:30:00Z", "sla_hours": 1},
    {"name": "customers", "last_updated": "2025-12-15T06:00:00Z", "sla_hours": 24},
    {"name": "inventory", "last_updated": "2025-12-14T00:00:00Z", "sla_hours": 12},
    {"name": "analytics_daily", "last_updated": "2025-12-13T00:00:00Z", "sla_hours": 24},
    {"name": "audit_log", "last_updated": "2025-12-10T00:00:00Z", "sla_hours": 48}
  ]
}
```

**Expected Output:**
```json
{
  "results": [
    {"table": "orders", "status": "fresh", "age_hours": 0.5, "sla_hours": 1, "sla_ratio": 0.5},
    {"table": "customers", "status": "fresh", "age_hours": 6.0, "sla_hours": 24, "sla_ratio": 0.25},
    {"table": "inventory", "status": "stale", "age_hours": 36.0, "sla_hours": 12, "sla_ratio": 3.0},
    {"table": "analytics_daily", "status": "stale", "age_hours": 60.0, "sla_hours": 24, "sla_ratio": 2.5},
    {"table": "audit_log", "status": "critical", "age_hours": 132.0, "sla_hours": 48, "sla_ratio": 2.75}
  ],
  "summary": {
    "fresh": 2,
    "stale": 2,
    "critical": 1,
    "overall_freshness": 0.40
  }
}
```

**Validation:** json-structure
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Reference time is fixed (not system clock). Time difference calculations on fixed timestamps produce fixed results. SLA thresholds are fixed rules.

---

### DG-CC-16: Quality Violation Finder

**Module:** M04 (Качество Данных и Observability)
**Target Lesson:** Identifying quality issues in databases
**Language:** SQL
**Runner:** sql.js
**Bloom Level:** Analyze

**Description:** Write SQL queries against a pre-loaded `orders` table to find quality violations: null values in required columns, duplicate order IDs, orders with negative amounts, orders where created_at > updated_at, and orders with invalid status values.

**Input:** Pre-loaded SQLite database with `orders` table (100 rows, ~15 with violations).

**Expected Output:**
```
Null violations (required fields): 3 rows
  - order_id 45: customer_id is NULL
  - order_id 67: status is NULL
  - order_id 89: amount is NULL
Duplicate order_ids: 2 duplicates (order_id 23, order_id 78)
Negative amounts: 1 row (order_id 34: amount = -150.00)
Temporal violations: 2 rows (created_at > updated_at)
Invalid status values: 1 row (order_id 56: status = 'DELETED')
Total violations: 9
```

**Validation:** output-contains
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Pre-loaded static dataset. Same SQL queries against same data always find the same violations.

---

### DG-CC-17: Duplicate Detector

**Module:** M04 (Качество Данных и Observability)
**Target Lesson:** Deduplication strategies
**Language:** SQL
**Runner:** sql.js
**Bloom Level:** Analyze

**Description:** Write SQL queries to detect and classify duplicates in a `customers` table: exact duplicates (all fields match), fuzzy duplicates (same email, different name spelling), and potential duplicates (same phone with different email). Rank duplicate groups by confidence score.

**Input:** Pre-loaded SQLite database with `customers` table (50 rows, ~10 duplicate pairs).

**Expected Output:**
```
Duplicate Report:
  Exact duplicates: 2 groups (4 rows)
    Group 1: customer_id 12, 45 (exact match on email + name + phone)
    Group 2: customer_id 23, 67 (exact match on email + name + phone)
  Same email, different name: 3 groups (6 rows)
    Group 3: customer_id 5, 34 (email: ivan@mail.ru)
    Group 4: customer_id 8, 41 (email: maria@gmail.com)
    Group 5: customer_id 15, 48 (email: alex@yandex.ru)
  Same phone, different email: 2 groups (4 rows)
    Group 6: customer_id 3, 29 (phone: +79001234567)
    Group 7: customer_id 11, 38 (phone: +79007654321)
Total duplicate groups: 7
Total affected rows: 14
```

**Validation:** output-contains
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Fixed dataset, fixed matching rules. Same data always produces the same duplicate groups.

---

### DG-CC-18: dbt Test Generator

**Module:** M04 (Качество Данных и Observability)
**Target Lesson:** Data quality testing with dbt
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Apply

**Description:** Create a dbt schema.yml file that defines data quality tests for an `orders` model: not_null tests on required columns, unique test on order_id, accepted_values on status, relationships test to customers table, and a custom test for amount range validation.

**Input:** (student writes YAML from provided requirements)

**Expected Output:**
```yaml
version: 2

models:
  - name: orders
    description: "Customer orders with payment and delivery status"
    columns:
      - name: order_id
        description: "Unique order identifier"
        tests:
          - unique
          - not_null
      - name: customer_id
        description: "Reference to customers table"
        tests:
          - not_null
          - relationships:
              to: ref('customers')
              field: customer_id
      - name: amount
        description: "Order total amount in RUB"
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: ">= 0"
      - name: status
        description: "Order fulfillment status"
        tests:
          - not_null
          - accepted_values:
              values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
      - name: created_at
        description: "Order creation timestamp"
        tests:
          - not_null
```

**Validation:** json-structure (YAML parsed, validates test structure and required test types)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** YAML structure validation against fixed required test types and model structure.

---

### DG-CC-19: Great Expectations Suite Builder

**Module:** M04 (Качество Данных и Observability)
**Target Lesson:** Data quality with Great Expectations
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Analyze

**Description:** Create a YAML representation of a Great Expectations expectation suite for a `payments` dataset. Include expectations for column presence, type checks, value ranges, null percentages, uniqueness, and cross-column consistency (payment_date <= settlement_date).

**Input:** (student writes YAML based on requirements)

**Expected Output:**
```yaml
expectation_suite:
  name: payments_quality_suite
  dataset: payments
  expectations:
    - type: expect_table_columns_to_match_set
      columns:
        - payment_id
        - order_id
        - amount
        - currency
        - payment_date
        - settlement_date
        - status
        - method

    - type: expect_column_values_to_be_unique
      column: payment_id

    - type: expect_column_values_to_not_be_null
      columns:
        - payment_id
        - order_id
        - amount
        - currency
        - payment_date
        - status

    - type: expect_column_values_to_be_in_set
      column: currency
      value_set: [RUB, USD, EUR]

    - type: expect_column_values_to_be_in_set
      column: status
      value_set: [pending, completed, failed, refunded]

    - type: expect_column_values_to_be_in_set
      column: method
      value_set: [card, bank_transfer, e-wallet, cash]

    - type: expect_column_values_to_be_between
      column: amount
      min_value: 0.01
      max_value: 10000000

    - type: expect_column_pair_values_a_to_be_less_than_or_equal_to_b
      column_a: payment_date
      column_b: settlement_date

    - type: expect_column_proportion_of_null_values_to_be_less_than
      column: settlement_date
      max_proportion: 0.3
```

**Validation:** json-structure (YAML parsed, validates expectation types and required parameters)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Structure validation against fixed expectation type definitions. Required parameters per expectation type are fixed rules.

---

## M05: Privacy (Приватность и Compliance) -- 5 Challenges

### DG-CC-20: PII Column Classifier

**Module:** M05 (Приватность и Compliance)
**Target Lesson:** PII detection and data classification
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that classifies database columns as PII or non-PII based on column names and sample values. PII categories include: direct identifiers (name, email, phone, passport, INN, SNILS), quasi-identifiers (birth_date, zip_code, gender), and sensitive (salary, diagnosis, religion). Return a classification report with confidence levels.

**Input:**
```json
{
  "columns": [
    {"name": "user_id", "sample_values": [1001, 1002, 1003]},
    {"name": "full_name", "sample_values": ["Иванов Иван", "Петрова Мария", "Сидоров Алексей"]},
    {"name": "email", "sample_values": ["ivan@mail.ru", "maria@gmail.com", "alex@yandex.ru"]},
    {"name": "phone_number", "sample_values": ["+79001234567", "+79007654321", "+79001111111"]},
    {"name": "inn", "sample_values": ["7707083893", "7719402047", "7842349892"]},
    {"name": "birth_date", "sample_values": ["1990-05-15", "1985-11-23", "2000-01-01"]},
    {"name": "department", "sample_values": ["Engineering", "Sales", "HR"]},
    {"name": "salary", "sample_values": [150000, 120000, 200000]},
    {"name": "created_at", "sample_values": ["2025-01-01", "2025-02-15", "2025-03-20"]}
  ]
}
```

**Expected Output:**
```json
{
  "classifications": [
    {"column": "user_id", "pii_category": "none", "confidence": "high"},
    {"column": "full_name", "pii_category": "direct_identifier", "confidence": "high"},
    {"column": "email", "pii_category": "direct_identifier", "confidence": "high"},
    {"column": "phone_number", "pii_category": "direct_identifier", "confidence": "high"},
    {"column": "inn", "pii_category": "direct_identifier", "confidence": "high"},
    {"column": "birth_date", "pii_category": "quasi_identifier", "confidence": "high"},
    {"column": "department", "pii_category": "none", "confidence": "medium"},
    {"column": "salary", "pii_category": "sensitive", "confidence": "high"},
    {"column": "created_at", "pii_category": "none", "confidence": "high"}
  ],
  "summary": {
    "direct_identifiers": 4,
    "quasi_identifiers": 1,
    "sensitive": 1,
    "non_pii": 3,
    "total_pii_columns": 6
  }
}
```

**Validation:** json-structure
**Test Cases:** 3 visible + 2 hidden

**Why Deterministic:** Classification uses fixed keyword-to-category mapping (column name patterns) and fixed value format detection (phone regex, INN format). No ML, no probabilistic matching.

---

### DG-CC-21: Consent Validator

**Module:** M05 (Приватность и Compliance)
**Target Lesson:** Consent management and 152-FZ
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Evaluate

**Description:** Write a function that validates whether data processing activities comply with user consent records. Given a set of processing purposes and user consent records, determine which activities are authorized, which lack consent, and which have expired consent.

**Input:**
```json
{
  "reference_date": "2025-12-15",
  "processing_activities": [
    {"id": "PA-01", "purpose": "order_fulfillment", "data_categories": ["name", "address", "email"]},
    {"id": "PA-02", "purpose": "marketing_emails", "data_categories": ["email", "name"]},
    {"id": "PA-03", "purpose": "analytics", "data_categories": ["purchase_history", "browsing"]},
    {"id": "PA-04", "purpose": "credit_scoring", "data_categories": ["income", "payment_history"]}
  ],
  "user_consents": [
    {"purpose": "order_fulfillment", "granted": true, "date": "2025-01-01", "expires": "2026-01-01"},
    {"purpose": "marketing_emails", "granted": true, "date": "2024-06-01", "expires": "2025-06-01"},
    {"purpose": "analytics", "granted": false, "date": "2025-01-01", "expires": null},
    {"purpose": "third_party_sharing", "granted": true, "date": "2025-01-01", "expires": "2026-01-01"}
  ]
}
```

**Expected Output:**
```json
{
  "results": [
    {"activity_id": "PA-01", "purpose": "order_fulfillment", "status": "authorized", "consent_valid_until": "2026-01-01"},
    {"activity_id": "PA-02", "purpose": "marketing_emails", "status": "expired", "consent_expired": "2025-06-01"},
    {"activity_id": "PA-03", "purpose": "analytics", "status": "denied", "reason": "consent explicitly denied"},
    {"activity_id": "PA-04", "purpose": "credit_scoring", "status": "no_consent", "reason": "no consent record found"}
  ],
  "summary": {
    "authorized": 1,
    "expired": 1,
    "denied": 1,
    "no_consent": 1,
    "compliance_rate": 0.25
  }
}
```

**Validation:** json-structure
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Reference date is fixed (not system clock). Consent expiry comparison is deterministic. Same consents and activities always produce the same authorization decisions.

---

### DG-CC-22: Data Masking Function

**Module:** M05 (Приватность и Compliance)
**Target Lesson:** Data anonymization and masking techniques
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that applies appropriate masking to PII fields based on their type: email (show first char + domain), phone (show last 4 digits), name (first initial + asterisks), INN (show first 2 + last 2 digits), and credit card (show last 4 digits). Return the masked dataset with a masking audit log.

**Input:**
```json
{
  "records": [
    {"name": "Иванов Иван Иванович", "email": "ivan.ivanov@mail.ru", "phone": "+79001234567", "inn": "7707083893"},
    {"name": "Петрова Мария Сергеевна", "email": "maria.petrova@gmail.com", "phone": "+79007654321", "inn": "7719402047"},
    {"name": "Сидоров Алексей Петрович", "email": "alex@yandex.ru", "phone": "+79001111111", "inn": "7842349892"}
  ],
  "masking_rules": {
    "name": "first_initial",
    "email": "partial_domain",
    "phone": "last_four",
    "inn": "bookend"
  }
}
```

**Expected Output:**
```json
{
  "masked_records": [
    {"name": "И*******", "email": "i***@mail.ru", "phone": "***4567", "inn": "77****93"},
    {"name": "П*******", "email": "m***@gmail.com", "phone": "***4321", "inn": "77****47"},
    {"name": "С*******", "email": "a***@yandex.ru", "phone": "***1111", "inn": "78****92"}
  ],
  "audit": {
    "records_processed": 3,
    "fields_masked": 12,
    "masking_applied": {
      "first_initial": 3,
      "partial_domain": 3,
      "last_four": 3,
      "bookend": 3
    }
  }
}
```

**Validation:** json-structure
**Test Cases:** 3 visible + 1 hidden

**Why Deterministic:** Masking rules are fixed string transformations (not hashing with random salts). Same input strings with same masking rules always produce the same masked output.

---

### DG-CC-23: DPIA Template Builder

**Module:** M05 (Приватность и Compliance)
**Target Lesson:** Data Protection Impact Assessment
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Evaluate

**Description:** Create a JSON Data Protection Impact Assessment (DPIA) document for a scenario where DataTech Solutions wants to implement a customer recommendation system using purchase history. Must include: processing description, necessity assessment, risk identification (at least 4 risks), risk mitigation measures, and DPO consultation record.

**Input:** (student writes JSON based on provided scenario)

**Expected Output:**
```json
{
  "dpia": {
    "id": "DPIA-2025-001",
    "project": "Customer Recommendation System",
    "organization": "DataTech Solutions",
    "assessor": "Data Protection Officer",
    "date": "2025-12-01",
    "status": "draft",

    "processing_description": {
      "purpose": "Generate personalized product recommendations based on purchase history",
      "data_subjects": "Registered customers (~500,000)",
      "data_categories": ["purchase_history", "browsing_behavior", "product_preferences"],
      "legal_basis": "legitimate_interest",
      "retention_period_days": 730,
      "third_party_sharing": false
    },

    "necessity_assessment": {
      "is_necessary": true,
      "proportionality": "Processing limited to purchase data only; no sensitive categories",
      "alternatives_considered": ["Manual curation", "Non-personalized popular items"],
      "why_chosen": "Automated recommendations improve customer experience while using minimum necessary data"
    },

    "risks": [
      {
        "id": "R1",
        "description": "Re-identification from purchase patterns",
        "likelihood": "medium",
        "severity": "high",
        "risk_level": "high"
      },
      {
        "id": "R2",
        "description": "Unauthorized access to recommendation model training data",
        "likelihood": "low",
        "severity": "high",
        "risk_level": "medium"
      },
      {
        "id": "R3",
        "description": "Profiling leading to discriminatory pricing",
        "likelihood": "medium",
        "severity": "high",
        "risk_level": "high"
      },
      {
        "id": "R4",
        "description": "Data retention beyond necessary period",
        "likelihood": "medium",
        "severity": "medium",
        "risk_level": "medium"
      }
    ],

    "mitigations": [
      {"risk_id": "R1", "measure": "Aggregate purchase data before model training; minimum k-anonymity of 5", "residual_risk": "low"},
      {"risk_id": "R2", "measure": "RBAC on training data; encryption at rest; audit logging", "residual_risk": "low"},
      {"risk_id": "R3", "measure": "Fairness testing on recommendations; no price differentiation based on profiles", "residual_risk": "low"},
      {"risk_id": "R4", "measure": "Automated data deletion pipeline with 730-day TTL", "residual_risk": "low"}
    ],

    "dpo_consultation": {
      "consulted": true,
      "date": "2025-12-05",
      "recommendation": "Proceed with implementation after mitigations are in place",
      "conditions": ["Implement k-anonymity before launch", "Quarterly fairness audit"]
    }
  }
}
```

**Validation:** json-structure (validates DPIA sections, risk count >= 4, mitigation per risk, DPO record)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** JSON structure validation checks required sections, minimum risk count, risk-mitigation pairing, and DPO consultation record presence. Fixed structural rules.

---

### DG-CC-24: Data Classification Policy

**Module:** M05 (Приватность и Compliance)
**Target Lesson:** Data classification frameworks
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Apply

**Description:** Create a JSON data classification policy that defines four classification levels (public, internal, confidential, restricted), each with handling rules for storage, transmission, access, retention, and disposal.

**Input:** (student writes JSON from requirements)

**Expected Output:**
```json
{
  "policy": {
    "name": "Data Classification Policy",
    "version": "1.0",
    "levels": [
      {
        "level": "public",
        "description": "Data intended for public access",
        "examples": ["Product catalog", "Published reports", "Public API documentation"],
        "handling": {
          "storage": "No special requirements",
          "transmission": "No encryption required",
          "access": "No restrictions",
          "retention_days": 0,
          "disposal": "Standard deletion"
        }
      },
      {
        "level": "internal",
        "description": "Data for internal use only",
        "examples": ["Employee directory", "Internal wikis", "Meeting notes"],
        "handling": {
          "storage": "Company-managed systems only",
          "transmission": "TLS required for external transfer",
          "access": "All employees with valid account",
          "retention_days": 1095,
          "disposal": "Standard deletion with confirmation"
        }
      },
      {
        "level": "confidential",
        "description": "Sensitive business or personal data",
        "examples": ["Customer PII", "Financial records", "Contracts"],
        "handling": {
          "storage": "Encrypted at rest (AES-256)",
          "transmission": "TLS 1.2+ required; no email attachments",
          "access": "Role-based; manager approval required",
          "retention_days": 2555,
          "disposal": "Secure deletion with audit trail"
        }
      },
      {
        "level": "restricted",
        "description": "Highest sensitivity data with regulatory requirements",
        "examples": ["Payment card data (PCI)", "Medical records", "Authentication credentials"],
        "handling": {
          "storage": "Encrypted at rest; dedicated secure zone",
          "transmission": "End-to-end encryption; approved channels only",
          "access": "Named individuals only; MFA required; logged",
          "retention_days": 365,
          "disposal": "Cryptographic erasure with compliance certificate"
        }
      }
    ]
  }
}
```

**Validation:** json-structure (validates 4 levels, each with handling rules for all 5 categories)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Structure validation checks exactly 4 levels with required handling sub-fields. Fixed schema rules.

---

## M06: Security (Безопасность и Контроль Доступа) -- 5 Challenges

### DG-CC-25: Access Decision Engine

**Module:** M06 (Безопасность и Контроль Доступа)
**Target Lesson:** RBAC implementation
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Evaluate

**Description:** Write a function that implements an RBAC access decision engine. Given a user with roles, a set of role-permission mappings, and a requested action on a resource, determine whether access is granted or denied. Handle role inheritance (admin inherits from editor, editor inherits from viewer).

**Input:**
```json
{
  "roles_hierarchy": {
    "admin": ["editor"],
    "editor": ["viewer"],
    "viewer": [],
    "auditor": []
  },
  "role_permissions": {
    "viewer": [{"resource": "reports", "actions": ["read"]}, {"resource": "dashboards", "actions": ["read"]}],
    "editor": [{"resource": "reports", "actions": ["write", "delete"]}, {"resource": "datasets", "actions": ["read", "write"]}],
    "admin": [{"resource": "users", "actions": ["read", "write", "delete"]}, {"resource": "settings", "actions": ["read", "write"]}],
    "auditor": [{"resource": "audit_log", "actions": ["read"]}, {"resource": "reports", "actions": ["read"]}]
  },
  "access_requests": [
    {"user": "alice", "roles": ["editor"], "resource": "reports", "action": "read"},
    {"user": "alice", "roles": ["editor"], "resource": "reports", "action": "delete"},
    {"user": "bob", "roles": ["viewer"], "resource": "datasets", "action": "write"},
    {"user": "charlie", "roles": ["admin"], "resource": "dashboards", "action": "read"},
    {"user": "dave", "roles": ["auditor"], "resource": "users", "action": "read"},
    {"user": "eve", "roles": ["editor", "auditor"], "resource": "audit_log", "action": "read"}
  ]
}
```

**Expected Output:**
```json
{
  "decisions": [
    {"user": "alice", "resource": "reports", "action": "read", "decision": "ALLOW", "reason": "inherited from viewer via editor"},
    {"user": "alice", "resource": "reports", "action": "delete", "decision": "ALLOW", "reason": "direct permission on editor role"},
    {"user": "bob", "resource": "datasets", "action": "write", "decision": "DENY", "reason": "viewer role has no write permission on datasets"},
    {"user": "charlie", "resource": "dashboards", "action": "read", "decision": "ALLOW", "reason": "inherited from viewer via editor via admin"},
    {"user": "dave", "resource": "users", "action": "read", "decision": "DENY", "reason": "auditor role has no permission on users"},
    {"user": "eve", "resource": "audit_log", "action": "read", "decision": "ALLOW", "reason": "direct permission on auditor role"}
  ],
  "summary": {
    "total_requests": 6,
    "allowed": 4,
    "denied": 2
  }
}
```

**Validation:** json-structure
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Role hierarchy and permission mappings are fixed. Access decision algorithm (resolve inherited roles, check permissions) is deterministic. Same user/role/resource/action always produces the same decision.

---

### DG-CC-26: Audit Log Query Builder

**Module:** M06 (Безопасность и Контроль Доступа)
**Target Lesson:** Audit trails and compliance logging
**Language:** SQL
**Runner:** sql.js
**Bloom Level:** Analyze

**Description:** Write SQL queries against a pre-loaded `audit_log` table to answer compliance questions: who accessed restricted data in the last 30 days, which users have the most denied access attempts, what are the most accessed resources, and identify potential security incidents (more than 5 denied attempts from one user in one hour).

**Input:** Pre-loaded SQLite database with `audit_log` table (500 rows over 30 days).

**Expected Output:**
```
1. Restricted data access (last 30 days):
   user_id 5: 12 accesses to restricted resources
   user_id 8: 7 accesses to restricted resources
   user_id 3: 3 accesses to restricted resources

2. Top denied access attempts:
   user_id 15: 23 denied attempts
   user_id 22: 18 denied attempts
   user_id 9: 11 denied attempts

3. Most accessed resources:
   customers: 145 accesses
   orders: 132 accesses
   reports: 89 accesses

4. Security incidents (>5 denials/hour):
   user_id 15 at 2025-12-10 14:00: 8 denials
   user_id 22 at 2025-12-12 09:00: 6 denials
```

**Validation:** output-contains
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Pre-loaded static audit log data. Same SQL queries against fixed data always return the same results.

---

### DG-CC-27: RBAC Policy Validator

**Module:** M06 (Безопасность и Контроль Доступа)
**Target Lesson:** Policy validation and testing
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Evaluate

**Description:** Create a JSON RBAC policy for a data warehouse that defines roles (data_analyst, data_engineer, data_steward, admin), permissions per role per schema (raw, staging, mart, sensitive), and validates that the policy follows least-privilege principle (analysts cannot write to raw/staging, engineers cannot access sensitive without steward approval).

**Input:** (student writes JSON policy from requirements)

**Expected Output:**
```json
{
  "rbac_policy": {
    "name": "Data Warehouse Access Policy",
    "version": "1.0",
    "schemas": ["raw", "staging", "mart", "sensitive"],
    "roles": [
      {
        "name": "data_analyst",
        "permissions": [
          {"schema": "mart", "actions": ["SELECT"]},
          {"schema": "staging", "actions": ["SELECT"]},
          {"schema": "raw", "actions": []},
          {"schema": "sensitive", "actions": []}
        ]
      },
      {
        "name": "data_engineer",
        "permissions": [
          {"schema": "raw", "actions": ["SELECT", "INSERT", "UPDATE"]},
          {"schema": "staging", "actions": ["SELECT", "INSERT", "UPDATE", "DELETE"]},
          {"schema": "mart", "actions": ["SELECT", "INSERT", "UPDATE"]},
          {"schema": "sensitive", "actions": []}
        ]
      },
      {
        "name": "data_steward",
        "permissions": [
          {"schema": "raw", "actions": ["SELECT"]},
          {"schema": "staging", "actions": ["SELECT"]},
          {"schema": "mart", "actions": ["SELECT"]},
          {"schema": "sensitive", "actions": ["SELECT", "UPDATE"]}
        ]
      },
      {
        "name": "admin",
        "permissions": [
          {"schema": "raw", "actions": ["SELECT", "INSERT", "UPDATE", "DELETE"]},
          {"schema": "staging", "actions": ["SELECT", "INSERT", "UPDATE", "DELETE"]},
          {"schema": "mart", "actions": ["SELECT", "INSERT", "UPDATE", "DELETE"]},
          {"schema": "sensitive", "actions": ["SELECT", "INSERT", "UPDATE", "DELETE"]}
        ]
      }
    ],
    "constraints": [
      {"rule": "data_analyst cannot write to raw or staging", "enforced": true},
      {"rule": "data_engineer cannot access sensitive schema", "enforced": true},
      {"rule": "only admin and data_steward can access sensitive schema", "enforced": true}
    ]
  }
}
```

**Validation:** json-structure (validates role/schema coverage, least-privilege constraints)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** JSON structure validation against fixed role/schema combinations and constraint rules.

---

### DG-CC-28: ABAC Policy Builder

**Module:** M06 (Безопасность и Контроль Доступа)
**Target Lesson:** Attribute-based access control
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Analyze

**Description:** Create a JSON ABAC policy that defines access rules based on user attributes (department, clearance_level, location), resource attributes (classification, owner_department), and environmental attributes (time_of_day, network_type). Include at least 5 policy rules with conditions.

**Input:** (student writes JSON based on requirements)

**Expected Output:**
```json
{
  "abac_policy": {
    "name": "Attribute-Based Access Control Policy",
    "version": "1.0",
    "rules": [
      {
        "id": "ABAC-01",
        "description": "Same department can access internal data",
        "effect": "allow",
        "conditions": {
          "user.department": {"equals": "resource.owner_department"},
          "resource.classification": {"in": ["public", "internal"]}
        }
      },
      {
        "id": "ABAC-02",
        "description": "High clearance can access confidential data",
        "effect": "allow",
        "conditions": {
          "user.clearance_level": {"gte": 3},
          "resource.classification": {"in": ["public", "internal", "confidential"]}
        }
      },
      {
        "id": "ABAC-03",
        "description": "Restricted data only from corporate network during business hours",
        "effect": "allow",
        "conditions": {
          "user.clearance_level": {"gte": 4},
          "resource.classification": {"equals": "restricted"},
          "environment.network_type": {"equals": "corporate"},
          "environment.time_of_day": {"between": [9, 18]}
        }
      },
      {
        "id": "ABAC-04",
        "description": "Deny access from public networks to confidential+ data",
        "effect": "deny",
        "conditions": {
          "environment.network_type": {"equals": "public"},
          "resource.classification": {"in": ["confidential", "restricted"]}
        }
      },
      {
        "id": "ABAC-05",
        "description": "Public data accessible by all authenticated users",
        "effect": "allow",
        "conditions": {
          "user.authenticated": {"equals": true},
          "resource.classification": {"equals": "public"}
        }
      }
    ],
    "default_effect": "deny",
    "evaluation_order": "deny-overrides"
  }
}
```

**Validation:** json-structure (validates rule count >= 5, each rule has conditions and effect, both allow and deny effects present)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** JSON structure validation against fixed rule structure requirements. Minimum rule count and required field presence are fixed rules.

---

### DG-CC-29: Access Control Decision Function

**Module:** M06 (Безопасность и Контроль Доступа)
**Target Lesson:** Policy enforcement in code
**Language:** JavaScript
**Runner:** js-sandbox
**Bloom Level:** Evaluate

**Description:** Write a JavaScript function that evaluates an ABAC policy against an access request. The function takes a policy (rules array), user attributes, resource attributes, and environment attributes, and returns an access decision with the matching rule chain.

**Input:**
```json
{
  "policy": {
    "rules": [
      {"id": "R1", "effect": "deny", "conditions": {"env.network": "public", "resource.classification": "restricted"}},
      {"id": "R2", "effect": "allow", "conditions": {"user.clearance": ">=4", "resource.classification": "restricted"}},
      {"id": "R3", "effect": "allow", "conditions": {"user.department": "resource.owner", "resource.classification": "internal"}},
      {"id": "R4", "effect": "allow", "conditions": {"resource.classification": "public"}}
    ],
    "default": "deny",
    "strategy": "deny-overrides"
  },
  "requests": [
    {"user": {"clearance": 5, "department": "finance"}, "resource": {"classification": "restricted", "owner": "finance"}, "env": {"network": "corporate"}},
    {"user": {"clearance": 5, "department": "finance"}, "resource": {"classification": "restricted", "owner": "finance"}, "env": {"network": "public"}},
    {"user": {"clearance": 2, "department": "engineering"}, "resource": {"classification": "internal", "owner": "engineering"}, "env": {"network": "corporate"}},
    {"user": {"clearance": 1, "department": "marketing"}, "resource": {"classification": "internal", "owner": "engineering"}, "env": {"network": "corporate"}}
  ]
}
```

**Expected Output:**
```json
{
  "decisions": [
    {"request": 1, "decision": "ALLOW", "matched_rule": "R2", "reason": "User clearance 5 >= 4 for restricted resource"},
    {"request": 2, "decision": "DENY", "matched_rule": "R1", "reason": "Deny override: public network + restricted resource"},
    {"request": 3, "decision": "ALLOW", "matched_rule": "R3", "reason": "Same department access to internal resource"},
    {"request": 4, "decision": "DENY", "matched_rule": "default", "reason": "No matching allow rule; department mismatch"}
  ]
}
```

**Validation:** json-structure
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Fixed policy rules, fixed attributes, fixed evaluation strategy (deny-overrides). Same request against same policy always produces the same decision.

---

## M07: Implementation (Внедрение Программы Governance) -- 4 Challenges

### DG-CC-30: RACI Matrix Validator

**Module:** M07 (Внедрение Программы Governance)
**Target Lesson:** Governance roles and responsibilities
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Analyze

**Description:** Create a JSON RACI matrix for governance implementation activities and validate it follows RACI rules: exactly one Accountable per activity, at least one Responsible, no empty activities, and every role appears in at least one activity.

**Input:** (student writes JSON from requirements)

**Expected Output:**
```json
{
  "raci_matrix": {
    "title": "Data Governance Implementation RACI",
    "roles": ["CDO", "Data Steward", "Data Engineer", "DPO", "Business Analyst"],
    "activities": [
      {
        "name": "Define data classification policy",
        "assignments": {"CDO": "A", "Data Steward": "R", "Data Engineer": "C", "DPO": "C", "Business Analyst": "I"}
      },
      {
        "name": "Implement data catalog",
        "assignments": {"CDO": "I", "Data Steward": "A", "Data Engineer": "R", "DPO": "I", "Business Analyst": "C"}
      },
      {
        "name": "Configure quality checks",
        "assignments": {"CDO": "I", "Data Steward": "C", "Data Engineer": "R", "DPO": "I", "Business Analyst": "A"}
      },
      {
        "name": "Conduct privacy impact assessment",
        "assignments": {"CDO": "I", "Data Steward": "C", "Data Engineer": "C", "DPO": "A", "Business Analyst": "R"}
      },
      {
        "name": "Define data access policies",
        "assignments": {"CDO": "A", "Data Steward": "R", "Data Engineer": "C", "DPO": "R", "Business Analyst": "I"}
      }
    ]
  },
  "validation": {
    "single_accountable_per_activity": true,
    "at_least_one_responsible_per_activity": true,
    "all_roles_assigned": true,
    "no_empty_activities": true,
    "is_valid": true
  }
}
```

**Validation:** json-structure (validates RACI constraints: one A per activity, at least one R, all roles used)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** RACI validation rules are fixed mathematical constraints. Same matrix always passes or fails the same checks.

---

### DG-CC-31: Governance Charter Structure

**Module:** M07 (Внедрение Программы Governance)
**Target Lesson:** Creating a governance charter
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Apply

**Description:** Create a JSON governance charter document for DataTech Solutions that includes all required sections: mission, scope, principles, organizational structure, decision rights, escalation process, metrics, and review schedule.

**Input:** (student writes JSON from requirements)

**Expected Output:**
```json
{
  "charter": {
    "organization": "DataTech Solutions",
    "version": "1.0",
    "effective_date": "2025-01-01",
    "mission": "Establish enterprise-wide data governance to ensure data quality, security, and compliance while enabling data-driven decision making",
    "scope": {
      "in_scope": ["All production databases", "Analytics warehouse", "ML model training data", "Customer-facing data"],
      "out_of_scope": ["Development/sandbox environments", "Third-party SaaS data"]
    },
    "principles": [
      "Data is a shared organizational asset",
      "Data quality is everyone's responsibility",
      "Privacy by design in all data systems",
      "Minimum necessary access principle",
      "Transparency in data usage and lineage"
    ],
    "organizational_structure": {
      "governance_council": {"chair": "CDO", "members": ["VP Engineering", "VP Analytics", "Legal Counsel", "DPO"]},
      "data_stewards": {"reporting_to": "CDO", "embedded_in": ["Engineering", "Analytics", "Marketing"]},
      "meeting_cadence": "monthly"
    },
    "decision_rights": [
      {"domain": "Data classification", "decision_maker": "Data Steward", "approver": "CDO"},
      {"domain": "Access requests", "decision_maker": "Data Steward", "approver": "DPO"},
      {"domain": "Quality thresholds", "decision_maker": "Data Engineer", "approver": "Data Steward"},
      {"domain": "Policy changes", "decision_maker": "CDO", "approver": "Governance Council"}
    ],
    "escalation_process": {
      "levels": [
        {"level": 1, "handler": "Data Steward", "sla_hours": 24},
        {"level": 2, "handler": "CDO", "sla_hours": 48},
        {"level": 3, "handler": "Governance Council", "sla_hours": 168}
      ]
    },
    "metrics": [
      {"name": "Data quality score", "target": ">= 0.95", "frequency": "weekly"},
      {"name": "Policy compliance rate", "target": ">= 0.90", "frequency": "monthly"},
      {"name": "Catalog coverage", "target": ">= 0.80", "frequency": "quarterly"},
      {"name": "Incident response time", "target": "<= 24 hours", "frequency": "per-incident"}
    ],
    "review_schedule": "annual"
  }
}
```

**Validation:** json-structure (validates all charter sections present, minimum metrics count, escalation levels)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Structure validation against fixed required sections and minimum content rules.

---

### DG-CC-32: Implementation Roadmap Timeline

**Module:** M07 (Внедрение Программы Governance)
**Target Lesson:** Governance implementation planning
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Analyze

**Description:** Create a YAML governance implementation roadmap with 4 phases (Foundation, Core, Advanced, Optimization), each with milestones, deliverables, dependencies, responsible roles, and success criteria. Validate that phases are sequential, dependencies reference existing milestones, and each phase has at least 2 milestones.

**Input:** (student writes YAML from requirements)

**Expected Output:**
```yaml
roadmap:
  organization: DataTech Solutions
  start_date: "2025-Q1"
  end_date: "2026-Q2"

  phases:
    - name: Foundation
      quarter: "2025-Q1"
      milestones:
        - id: F1
          name: Governance charter approved
          deliverables:
            - Charter document
            - RACI matrix
          responsible: CDO
          success_criteria: "Charter signed by all council members"
        - id: F2
          name: Data steward roles assigned
          deliverables:
            - Role descriptions
            - Steward training plan
          responsible: CDO
          success_criteria: "3+ stewards assigned and trained"
          depends_on: [F1]

    - name: Core
      quarter: "2025-Q2"
      milestones:
        - id: C1
          name: Data catalog launched
          deliverables:
            - Catalog platform deployed
            - Top 50 datasets cataloged
          responsible: Data Steward
          success_criteria: "50+ datasets with complete metadata"
          depends_on: [F2]
        - id: C2
          name: Quality monitoring active
          deliverables:
            - Quality checks on critical pipelines
            - Alert configuration
          responsible: Data Engineer
          success_criteria: "95%+ quality on critical datasets"
          depends_on: [C1]

    - name: Advanced
      quarter: "2025-Q3"
      milestones:
        - id: A1
          name: Privacy compliance verified
          deliverables:
            - PII inventory complete
            - Consent management active
          responsible: DPO
          success_criteria: "152-FZ audit passed"
          depends_on: [C1, C2]
        - id: A2
          name: Access control automated
          deliverables:
            - RBAC policies in production
            - Audit logging active
          responsible: Data Engineer
          success_criteria: "Zero unauthorized access incidents"
          depends_on: [A1]

    - name: Optimization
      quarter: "2026-Q1"
      milestones:
        - id: O1
          name: Governance metrics dashboard
          deliverables:
            - KPI dashboard live
            - Monthly reporting automated
          responsible: Business Analyst
          success_criteria: "All 4 charter KPIs tracked automatically"
          depends_on: [A2]
        - id: O2
          name: Program maturity assessment
          deliverables:
            - Maturity model self-assessment
            - Improvement plan for Level 3
          responsible: CDO
          success_criteria: "Level 2 achieved; Level 3 plan approved"
          depends_on: [O1]
```

**Validation:** json-structure (YAML parsed, validates phase sequence, dependency references, minimum milestones per phase)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Structure validation with fixed rules for phases, milestones, dependency reference validity, and minimum counts.

---

### DG-CC-33: Governance KPI Definitions

**Module:** M07 (Внедрение Программы Governance)
**Target Lesson:** Measuring governance effectiveness
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Evaluate

**Description:** Create a YAML file defining governance KPIs with measurement methodology, data source, formula, target, threshold levels (red/amber/green), responsible owner, and reporting frequency. Include at least 6 KPIs covering quality, privacy, security, and catalog coverage.

**Input:** (student writes YAML from requirements)

**Expected Output:**
```yaml
governance_kpis:
  version: "1.0"
  review_cycle: quarterly

  kpis:
    - id: KPI-01
      name: Data Quality Score
      category: quality
      description: "Weighted average of quality dimension scores across critical datasets"
      formula: "sum(dimension_score * weight) / sum(weights)"
      data_source: "Great Expectations validation results"
      target: 0.95
      thresholds:
        green: ">= 0.95"
        amber: ">= 0.85"
        red: "< 0.85"
      owner: Data Steward
      frequency: weekly

    - id: KPI-02
      name: Catalog Coverage
      category: metadata
      description: "Percentage of production datasets registered in data catalog with complete metadata"
      formula: "cataloged_datasets / total_production_datasets"
      data_source: "OpenMetadata API + infrastructure inventory"
      target: 0.90
      thresholds:
        green: ">= 0.90"
        amber: ">= 0.70"
        red: "< 0.70"
      owner: Data Steward
      frequency: monthly

    - id: KPI-03
      name: PII Inventory Completeness
      category: privacy
      description: "Percentage of data assets containing PII that are identified and classified"
      formula: "classified_pii_assets / total_pii_assets"
      data_source: "Data catalog PII scan results"
      target: 1.00
      thresholds:
        green: ">= 0.95"
        amber: ">= 0.80"
        red: "< 0.80"
      owner: DPO
      frequency: monthly

    - id: KPI-04
      name: Access Review Compliance
      category: security
      description: "Percentage of access reviews completed on schedule"
      formula: "completed_reviews / scheduled_reviews"
      data_source: "Access management system audit log"
      target: 1.00
      thresholds:
        green: ">= 0.95"
        amber: ">= 0.80"
        red: "< 0.80"
      owner: Security Team
      frequency: quarterly

    - id: KPI-05
      name: Incident Response Time
      category: security
      description: "Average time from data incident detection to resolution"
      formula: "avg(resolution_time - detection_time)"
      data_source: "Incident management system"
      target: 24
      unit: hours
      thresholds:
        green: "<= 24"
        amber: "<= 48"
        red: "> 48"
      owner: CDO
      frequency: per-incident

    - id: KPI-06
      name: Policy Compliance Rate
      category: governance
      description: "Percentage of data processes that comply with published governance policies"
      formula: "compliant_processes / audited_processes"
      data_source: "Governance audit results"
      target: 0.90
      thresholds:
        green: ">= 0.90"
        amber: ">= 0.75"
        red: "< 0.75"
      owner: CDO
      frequency: quarterly
```

**Validation:** json-structure (YAML parsed, validates KPI count >= 6, each KPI has all required fields, thresholds have all 3 levels)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Structure validation against fixed required fields per KPI, minimum KPI count, and threshold level completeness.

---

## M08: AI Governance (AI Governance) -- 4 Challenges

### DG-CC-34: Bias Metric Calculator

**Module:** M08 (AI Governance)
**Target Lesson:** Fairness and bias in ML models
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that calculates bias metrics for a binary classification model across a protected attribute (e.g., gender). Compute: demographic parity difference, equalized odds difference, and disparate impact ratio. Flag any metric that exceeds fairness thresholds.

**Input:**
```json
{
  "predictions": [
    {"id": 1, "group": "A", "actual": 1, "predicted": 1},
    {"id": 2, "group": "A", "actual": 1, "predicted": 1},
    {"id": 3, "group": "A", "actual": 0, "predicted": 0},
    {"id": 4, "group": "A", "actual": 0, "predicted": 1},
    {"id": 5, "group": "A", "actual": 1, "predicted": 0},
    {"id": 6, "group": "B", "actual": 1, "predicted": 1},
    {"id": 7, "group": "B", "actual": 1, "predicted": 0},
    {"id": 8, "group": "B", "actual": 0, "predicted": 0},
    {"id": 9, "group": "B", "actual": 0, "predicted": 0},
    {"id": 10, "group": "B", "actual": 1, "predicted": 0}
  ],
  "thresholds": {
    "demographic_parity_max": 0.1,
    "equalized_odds_max": 0.1,
    "disparate_impact_min": 0.8
  }
}
```

**Expected Output:**
```json
{
  "group_stats": {
    "A": {"total": 5, "positive_rate": 0.60, "tpr": 0.67, "fpr": 0.50},
    "B": {"total": 5, "positive_rate": 0.20, "tpr": 0.33, "fpr": 0.00}
  },
  "metrics": {
    "demographic_parity_difference": 0.40,
    "equalized_odds_difference": 0.34,
    "disparate_impact_ratio": 0.33
  },
  "fairness_flags": [
    {"metric": "demographic_parity_difference", "value": 0.40, "threshold": 0.1, "status": "FAIL"},
    {"metric": "equalized_odds_difference", "value": 0.34, "threshold": 0.1, "status": "FAIL"},
    {"metric": "disparate_impact_ratio", "value": 0.33, "threshold": 0.8, "status": "FAIL"}
  ],
  "overall_fairness": "FAIL"
}
```

**Validation:** json-structure
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Fixed prediction data, fixed mathematical formulas for each metric. Same predictions always produce the same bias metric values.

---

### DG-CC-35: Model Card Generator

**Module:** M08 (AI Governance)
**Target Lesson:** AI model documentation
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Analyze

**Description:** Write a function that generates a structured model card from model metadata. Given training details, performance metrics, and governance information, produce a formatted model card with all required sections per the model cards framework.

**Input:**
```json
{
  "model_name": "Customer Churn Predictor",
  "version": "2.1",
  "type": "binary_classification",
  "training": {
    "dataset": "customer_activity_2024",
    "rows": 150000,
    "features": 23,
    "train_split": 0.8,
    "algorithm": "gradient_boosting",
    "training_date": "2025-11-01"
  },
  "performance": {
    "accuracy": 0.87,
    "precision": 0.82,
    "recall": 0.79,
    "f1": 0.80,
    "auc_roc": 0.91
  },
  "fairness": {
    "protected_attribute": "age_group",
    "demographic_parity_diff": 0.05,
    "equalized_odds_diff": 0.08
  },
  "governance": {
    "owner": "ML Team",
    "approved_by": "Model Risk Committee",
    "review_date": "2025-11-15",
    "next_review": "2026-05-15",
    "data_classification": "confidential",
    "intended_use": "Predict customer churn probability for retention campaigns",
    "limitations": ["Not validated for B2B customers", "Performance degrades for accounts < 30 days old"]
  }
}
```

**Expected Output:**
```
=== MODEL CARD ===

Model: Customer Churn Predictor v2.1
Type: binary_classification
Owner: ML Team

--- Training Details ---
Dataset: customer_activity_2024
Records: 150,000 | Features: 23 | Split: 80/20
Algorithm: gradient_boosting
Training Date: 2025-11-01

--- Performance Metrics ---
Accuracy:  0.870
Precision: 0.820
Recall:    0.790
F1 Score:  0.800
AUC-ROC:   0.910

--- Fairness Assessment ---
Protected Attribute: age_group
Demographic Parity Difference: 0.050 [PASS: < 0.10]
Equalized Odds Difference:     0.080 [PASS: < 0.10]

--- Governance ---
Approved By: Model Risk Committee
Review Date: 2025-11-15
Next Review: 2026-05-15
Data Classification: confidential

--- Intended Use ---
Predict customer churn probability for retention campaigns

--- Limitations ---
1. Not validated for B2B customers
2. Performance degrades for accounts < 30 days old

=== END MODEL CARD ===
```

**Validation:** exact-match
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Fixed input metadata, fixed formatting template. Same model metadata always produces the same formatted model card.

---

### DG-CC-36: AI Risk Assessment Template

**Module:** M08 (AI Governance)
**Target Lesson:** AI risk management
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Evaluate

**Description:** Create a JSON AI risk assessment for a credit scoring model at FinSecure Bank. Must include: model purpose, risk category (per EU AI Act classification), identified risks (at least 5), impact assessment per risk, mitigation controls, monitoring requirements, and human oversight provisions.

**Input:** (student writes JSON from scenario requirements)

**Expected Output:**
```json
{
  "ai_risk_assessment": {
    "model": "Credit Scoring Model v3.0",
    "organization": "FinSecure Bank",
    "assessment_date": "2025-12-01",
    "risk_category": "high",
    "classification_basis": "EU AI Act Article 6 - credit scoring is high-risk AI system",

    "model_purpose": {
      "description": "Automated credit limit determination for retail banking customers",
      "data_subjects": "Individual loan applicants",
      "decision_impact": "Determines credit limit (0 to 5,000,000 RUB)",
      "automation_level": "semi-automated (human review for limits > 1,000,000 RUB)"
    },

    "risks": [
      {"id": "AIR-01", "category": "bias", "description": "Discriminatory outcomes based on age, gender, or ethnicity proxies", "likelihood": "medium", "impact": "high"},
      {"id": "AIR-02", "category": "transparency", "description": "Black-box model prevents explanation of credit decisions", "likelihood": "high", "impact": "high"},
      {"id": "AIR-03", "category": "data_quality", "description": "Training data contains historical bias from manual decisions", "likelihood": "high", "impact": "medium"},
      {"id": "AIR-04", "category": "privacy", "description": "Model uses sensitive personal data without explicit consent", "likelihood": "medium", "impact": "high"},
      {"id": "AIR-05", "category": "robustness", "description": "Model performance degrades with distribution shift in economic conditions", "likelihood": "medium", "impact": "medium"}
    ],

    "mitigations": [
      {"risk_id": "AIR-01", "control": "Quarterly bias audits using demographic parity and equalized odds metrics", "status": "implemented"},
      {"risk_id": "AIR-02", "control": "SHAP explanations generated for every decision; plain-language explanation provided to applicants", "status": "planned"},
      {"risk_id": "AIR-03", "control": "Training data audit for proxy variables; resampling to balance underrepresented groups", "status": "implemented"},
      {"risk_id": "AIR-04", "control": "Explicit consent collection for credit scoring purpose; data minimization review", "status": "implemented"},
      {"risk_id": "AIR-05", "control": "Monthly model performance monitoring with automatic retraining trigger at AUC < 0.80", "status": "planned"}
    ],

    "human_oversight": {
      "review_threshold": "All decisions with credit limit > 1,000,000 RUB",
      "appeal_process": "Applicants can request manual review within 30 days",
      "override_authority": "Credit committee can override model decisions"
    },

    "monitoring": {
      "performance_metrics": ["AUC-ROC", "precision", "recall", "default_rate"],
      "fairness_metrics": ["demographic_parity", "equalized_odds", "disparate_impact"],
      "monitoring_frequency": "monthly",
      "retraining_trigger": "AUC-ROC < 0.80 or disparate_impact < 0.80"
    }
  }
}
```

**Validation:** json-structure (validates risk count >= 5, mitigation per risk, human oversight section, monitoring section)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** JSON structure validation against fixed requirements for section presence, risk count minimums, and risk-mitigation pairing.

---

### DG-CC-37: Fairness Scoring Function

**Module:** M08 (AI Governance)
**Target Lesson:** Implementing fairness checks
**Language:** JavaScript
**Runner:** js-sandbox
**Bloom Level:** Evaluate

**Description:** Write a JavaScript function that computes a composite fairness score for a model based on multiple metrics. The function accepts metric values and weights, normalizes each metric to a 0-1 scale (where 1 is perfectly fair), computes the weighted average, and returns a pass/fail determination with a detailed breakdown.

**Input:**
```json
{
  "metrics": {
    "demographic_parity_diff": {"value": 0.08, "ideal": 0, "max_acceptable": 0.10, "weight": 0.3},
    "equalized_odds_diff": {"value": 0.12, "ideal": 0, "max_acceptable": 0.10, "weight": 0.3},
    "disparate_impact_ratio": {"value": 0.85, "ideal": 1, "max_acceptable": 0.80, "weight": 0.2},
    "predictive_parity_diff": {"value": 0.05, "ideal": 0, "max_acceptable": 0.10, "weight": 0.2}
  },
  "pass_threshold": 0.70
}
```

**Expected Output:**
```json
{
  "scores": {
    "demographic_parity_diff": {"raw": 0.08, "normalized": 0.20, "status": "PASS"},
    "equalized_odds_diff": {"raw": 0.12, "normalized": 0.00, "status": "FAIL"},
    "disparate_impact_ratio": {"raw": 0.85, "normalized": 0.25, "status": "PASS"},
    "predictive_parity_diff": {"raw": 0.05, "normalized": 0.50, "status": "PASS"}
  },
  "composite_score": 0.22,
  "pass_threshold": 0.70,
  "overall": "FAIL",
  "failing_metrics": ["equalized_odds_diff"],
  "recommendation": "Address equalized_odds_diff before deployment (0.12 > 0.10 threshold)"
}
```

**Validation:** json-structure
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Fixed mathematical normalization formula, fixed weights, fixed thresholds. Same metric values always produce the same composite score and pass/fail status.

---

## M09: Tools (Экосистема Инструментов) -- 2 Challenges

### DG-CC-38: Docker Compose Validator

**Module:** M09 (Экосистема Инструментов)
**Target Lesson:** Tool deployment and infrastructure
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Apply

**Description:** Create a YAML Docker Compose file for a data governance tool stack containing: OpenMetadata (catalog), PostgreSQL (metadata store), Elasticsearch (search), and Airflow (lineage). Validate service definitions, port mappings, volume mounts, health checks, and dependency ordering.

**Input:** (student writes YAML from requirements)

**Expected Output:**
```yaml
version: "3.9"

services:
  postgresql:
    image: "postgres:15.4@sha256:abcdef1234567890"
    environment:
      POSTGRES_USER: openmetadata
      POSTGRES_PASSWORD: openmetadata
      POSTGRES_DB: openmetadata_db
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U openmetadata"]
      interval: 10s
      timeout: 5s
      retries: 5

  elasticsearch:
    image: "docker.elastic.co/elasticsearch/elasticsearch:7.17.15@sha256:abcdef1234567890"
    environment:
      discovery.type: single-node
      ES_JAVA_OPTS: "-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ["CMD-SHELL", "curl -s http://localhost:9200/_cluster/health | grep -q '\"status\":\"green\\|yellow\"'"]
      interval: 15s
      timeout: 10s
      retries: 5

  openmetadata:
    image: "openmetadata/server:1.2.0@sha256:abcdef1234567890"
    environment:
      OPENMETADATA_CLUSTER_NAME: openmetadata
      DB_HOST: postgresql
      DB_PORT: 5432
      ELASTICSEARCH_HOST: elasticsearch
    ports:
      - "8585:8585"
    depends_on:
      postgresql:
        condition: service_healthy
      elasticsearch:
        condition: service_healthy

  airflow:
    image: "apache/airflow:2.7.3@sha256:abcdef1234567890"
    environment:
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: "postgresql+psycopg2://airflow:airflow@postgresql:5432/airflow_db"
    ports:
      - "8080:8080"
    depends_on:
      postgresql:
        condition: service_healthy
    volumes:
      - airflow_dags:/opt/airflow/dags

volumes:
  pg_data:
  es_data:
  airflow_dags:
```

**Validation:** json-structure (YAML parsed, validates service names, port mappings, healthchecks, depends_on, volumes)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** YAML structure validation against fixed required services, configuration keys, and dependency ordering rules.

---

### DG-CC-39: Tool Comparison Matrix

**Module:** M09 (Экосистема Инструментов)
**Target Lesson:** Evaluating governance tools
**Language:** YAML
**Runner:** yaml-validator
**Bloom Level:** Analyze

**Description:** Create a YAML tool comparison matrix evaluating 4 data catalog tools (OpenMetadata, DataHub, Apache Atlas, Amundsen) across governance-relevant criteria: metadata ingestion, lineage support, classification, collaboration, deployment complexity, and license. Include a weighted scoring system and recommendation.

**Input:** (student writes YAML from requirements)

**Expected Output:**
```yaml
tool_comparison:
  category: Data Catalog
  evaluation_date: "2025-12-01"
  evaluator: Data Governance Team

  criteria:
    - name: metadata_ingestion
      weight: 0.20
      description: "Breadth and ease of metadata connectors"
    - name: lineage_support
      weight: 0.20
      description: "Automated and manual lineage tracking"
    - name: data_classification
      weight: 0.15
      description: "PII detection, sensitivity tagging"
    - name: collaboration
      weight: 0.15
      description: "Comments, ownership, tasks, notifications"
    - name: deployment_complexity
      weight: 0.15
      description: "Infrastructure requirements, operational overhead"
    - name: license
      weight: 0.15
      description: "Open-source availability, vendor lock-in risk"

  tools:
    - name: OpenMetadata
      scores:
        metadata_ingestion: 4
        lineage_support: 4
        data_classification: 3
        collaboration: 4
        deployment_complexity: 4
        license: 5
      weighted_score: 4.00

    - name: DataHub
      scores:
        metadata_ingestion: 5
        lineage_support: 5
        data_classification: 4
        collaboration: 3
        deployment_complexity: 2
        license: 5
      weighted_score: 4.10

    - name: Apache Atlas
      scores:
        metadata_ingestion: 3
        lineage_support: 3
        data_classification: 3
        collaboration: 2
        deployment_complexity: 2
        license: 5
      weighted_score: 2.95

    - name: Amundsen
      scores:
        metadata_ingestion: 3
        lineage_support: 2
        data_classification: 2
        collaboration: 3
        deployment_complexity: 3
        license: 5
      weighted_score: 2.85

  recommendation:
    winner: OpenMetadata
    rationale: "Best balance of features and operational simplicity; 4-6 GB RAM vs 8+ GB for DataHub; stronger collaboration features than Atlas/Amundsen"
    runner_up: DataHub
    runner_up_rationale: "Strongest metadata/lineage but highest infrastructure requirements (14+ containers)"
```

**Validation:** json-structure (YAML parsed, validates 4+ tools, all criteria scored, weighted scores calculated, recommendation present)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Structure validation against fixed required fields, score ranges (1-5), and mathematical weighted score calculation.

---

## M10: Capstone (Capstone Project) -- 3 Challenges

### DG-CC-40: Governance Program Scorer

**Module:** M10 (Capstone Project)
**Target Lesson:** Capstone synthesis -- designing a complete governance program
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Evaluate

**Description:** Write a function that evaluates a complete governance program submission against a rubric. The program includes: charter (10 pts), policies (15 pts), RACI matrix (10 pts), quality framework (15 pts), privacy controls (15 pts), security model (15 pts), KPIs (10 pts), and implementation roadmap (10 pts). Score each section, provide detailed feedback, calculate overall score, and determine the governance maturity level achieved.

**Input:**
```json
{
  "submission": {
    "charter": {
      "has_mission": true,
      "has_scope": true,
      "has_principles": true,
      "principles_count": 5,
      "has_org_structure": true,
      "has_decision_rights": true,
      "has_escalation": false
    },
    "policies": {
      "count": 4,
      "has_classification_policy": true,
      "has_retention_policy": true,
      "has_access_policy": true,
      "has_quality_policy": true,
      "all_have_enforcement": false,
      "all_have_review_schedule": true
    },
    "raci": {
      "activities_count": 8,
      "roles_count": 5,
      "has_single_accountable": true,
      "has_responsible": true,
      "all_roles_used": true
    },
    "quality_framework": {
      "dimensions_covered": 5,
      "has_metrics": true,
      "has_thresholds": true,
      "has_monitoring": true,
      "has_remediation_process": false
    },
    "privacy": {
      "has_pii_inventory": true,
      "has_classification": true,
      "has_consent_management": true,
      "has_dpia": true,
      "has_breach_procedure": false
    },
    "security": {
      "has_rbac": true,
      "has_audit_logging": true,
      "has_encryption_policy": true,
      "has_incident_response": false,
      "access_review_defined": true
    },
    "kpis": {
      "count": 6,
      "all_have_targets": true,
      "all_have_owners": true,
      "all_have_frequency": true,
      "has_thresholds": false
    },
    "roadmap": {
      "phases_count": 4,
      "has_milestones": true,
      "has_dependencies": true,
      "has_timeline": true,
      "has_success_criteria": false
    }
  },
  "rubric": {
    "charter": {"max": 10, "weights": {"mission": 2, "scope": 2, "principles": 2, "org_structure": 2, "decision_rights": 1, "escalation": 1}},
    "policies": {"max": 15, "weights": {"count_4plus": 4, "classification": 2, "retention": 2, "access": 2, "quality": 2, "enforcement": 2, "review": 1}},
    "raci": {"max": 10, "weights": {"activities_5plus": 3, "roles_4plus": 2, "single_accountable": 2, "responsible": 2, "all_roles": 1}},
    "quality_framework": {"max": 15, "weights": {"dimensions_5plus": 3, "metrics": 3, "thresholds": 3, "monitoring": 3, "remediation": 3}},
    "privacy": {"max": 15, "weights": {"pii_inventory": 3, "classification": 3, "consent": 3, "dpia": 3, "breach": 3}},
    "security": {"max": 15, "weights": {"rbac": 3, "audit": 3, "encryption": 3, "incident": 3, "review": 3}},
    "kpis": {"max": 10, "weights": {"count_5plus": 3, "targets": 2, "owners": 2, "frequency": 2, "thresholds": 1}},
    "roadmap": {"max": 10, "weights": {"phases_3plus": 3, "milestones": 2, "dependencies": 2, "timeline": 2, "success_criteria": 1}}
  }
}
```

**Expected Output:**
```
=== GOVERNANCE PROGRAM EVALUATION ===

Section Scores:
  Charter:           9/10  (Excellent -- missing escalation process)
  Policies:         13/15  (Strong -- add enforcement mechanisms)
  RACI Matrix:      10/10  (Perfect)
  Quality Framework: 12/15 (Good -- add remediation process)
  Privacy Controls:  12/15 (Good -- add breach notification procedure)
  Security Model:    12/15 (Good -- add incident response plan)
  KPIs:              9/10  (Strong -- add threshold definitions)
  Roadmap:           9/10  (Strong -- add success criteria per phase)

Overall Score: 86/100
Grade: B+
Maturity Level Achieved: Level 3 (Defined)

Top 3 Improvement Areas:
  1. Quality Framework: Add documented remediation process for quality failures
  2. Privacy Controls: Develop breach notification procedure per 152-FZ requirements
  3. Security Model: Create incident response plan with escalation timeline

=== END EVALUATION ===
```

**Validation:** exact-match
**Test Cases:** 2 visible + 2 hidden

**Why Deterministic:** Fixed rubric weights, fixed scoring rules (boolean checks), fixed grade boundaries. Same submission always receives the same score and feedback.

---

### DG-CC-41: Governance Assessment Output

**Module:** M10 (Capstone Project)
**Target Lesson:** Capstone -- organizational assessment
**Language:** JSON
**Runner:** json-validator
**Bloom Level:** Evaluate

**Description:** Create a JSON governance assessment report for DataTech Solutions at the end of their governance journey (post-M10). Must include: current maturity level with evidence, gap analysis against target (Level 3), prioritized recommendations (at least 5), quick wins vs strategic investments, and 12-month improvement plan.

**Input:** (student writes JSON based on cumulative course scenario)

**Expected Output:**
```json
{
  "assessment": {
    "organization": "DataTech Solutions",
    "assessment_date": "2025-12-15",
    "assessor": "Governance Program Team",

    "maturity": {
      "current_level": 2,
      "current_label": "Managed",
      "target_level": 3,
      "target_label": "Defined",
      "dimensions": [
        {"name": "Data Quality", "score": 3, "evidence": "Automated quality checks on 80% of critical datasets"},
        {"name": "Metadata Management", "score": 2, "evidence": "Data catalog launched, 60% of datasets cataloged"},
        {"name": "Privacy & Compliance", "score": 2, "evidence": "PII inventory complete, consent management partially automated"},
        {"name": "Security & Access", "score": 3, "evidence": "RBAC implemented, audit logging active"},
        {"name": "Governance Organization", "score": 2, "evidence": "Steward roles assigned, governance council meets monthly"},
        {"name": "AI Governance", "score": 1, "evidence": "No formal AI governance framework yet"}
      ]
    },

    "gap_analysis": [
      {"dimension": "Metadata Management", "gap": 1, "blocking_issues": ["40% of datasets uncataloged", "No automated metadata ingestion"]},
      {"dimension": "Privacy & Compliance", "gap": 1, "blocking_issues": ["Consent management still partially manual", "No automated DPIA process"]},
      {"dimension": "Governance Organization", "gap": 1, "blocking_issues": ["No formal training program", "KPIs not tracked automatically"]},
      {"dimension": "AI Governance", "gap": 2, "blocking_issues": ["No model registry", "No fairness testing", "No model cards"]}
    ],

    "recommendations": [
      {"id": 1, "priority": "high", "type": "quick_win", "action": "Complete data catalog to 90% coverage", "effort": "2 months", "impact": "high"},
      {"id": 2, "priority": "high", "type": "quick_win", "action": "Automate consent management workflows", "effort": "1 month", "impact": "high"},
      {"id": 3, "priority": "high", "type": "strategic", "action": "Implement AI governance framework with model registry", "effort": "6 months", "impact": "high"},
      {"id": 4, "priority": "medium", "type": "quick_win", "action": "Deploy governance KPI dashboard", "effort": "1 month", "impact": "medium"},
      {"id": 5, "priority": "medium", "type": "strategic", "action": "Establish data steward training and certification program", "effort": "3 months", "impact": "medium"}
    ],

    "improvement_plan": {
      "q1": ["Complete catalog coverage", "Automate consent management", "Deploy KPI dashboard"],
      "q2": ["Launch AI model registry", "Start steward training program", "Implement automated DPIA"],
      "q3": ["Fairness testing for all production models", "Model cards for all ML models"],
      "q4": ["Maturity reassessment", "Level 3 certification preparation"]
    }
  }
}
```

**Validation:** json-structure (validates maturity dimensions, gap analysis, 5+ recommendations, improvement plan with 4 quarters)
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** JSON structure validation against fixed required sections, minimum recommendation count, and quarterly plan structure.

---

### DG-CC-42: Governance Maturity Comparison

**Module:** M10 (Capstone Project)
**Target Lesson:** Capstone -- cross-company analysis
**Language:** Python
**Runner:** pyodide
**Bloom Level:** Evaluate

**Description:** Write a function that compares governance maturity across the three case study companies (DataTech L1, BioGenesis L2, FinSecure L3). Given maturity scores for each company across 6 governance dimensions, produce a comparative analysis with dimension-by-dimension ranking, strongest/weakest areas per company, and an overall maturity leaderboard.

**Input:**
```json
{
  "companies": {
    "DataTech Solutions": {
      "maturity_level": 1,
      "dimensions": {"quality": 2, "metadata": 1, "privacy": 1, "security": 2, "organization": 1, "ai_governance": 0}
    },
    "BioGenesis Lab": {
      "maturity_level": 2,
      "dimensions": {"quality": 3, "metadata": 2, "privacy": 3, "security": 2, "organization": 2, "ai_governance": 1}
    },
    "FinSecure Bank": {
      "maturity_level": 3,
      "dimensions": {"quality": 4, "metadata": 3, "privacy": 4, "security": 4, "organization": 3, "ai_governance": 2}
    }
  }
}
```

**Expected Output:**
```
=== GOVERNANCE MATURITY COMPARISON ===

Overall Leaderboard:
  1. FinSecure Bank       Level 3 (avg: 3.33)
  2. BioGenesis Lab       Level 2 (avg: 2.17)
  3. DataTech Solutions    Level 1 (avg: 1.17)

Dimension Rankings:
  Quality:        FinSecure (4) > BioGenesis (3) > DataTech (2)
  Metadata:       FinSecure (3) > BioGenesis (2) > DataTech (1)
  Privacy:        FinSecure (4) > BioGenesis (3) > DataTech (1)
  Security:       FinSecure (4) > DataTech (2) = BioGenesis (2)
  Organization:   FinSecure (3) > BioGenesis (2) > DataTech (1)
  AI Governance:  FinSecure (2) > BioGenesis (1) > DataTech (0)

Per-Company Analysis:
  DataTech Solutions (Level 1):
    Strongest: quality, security (score: 2)
    Weakest: ai_governance (score: 0)
    Priority: ai_governance, metadata, privacy

  BioGenesis Lab (Level 2):
    Strongest: quality, privacy (score: 3)
    Weakest: ai_governance (score: 1)
    Priority: ai_governance, metadata, security

  FinSecure Bank (Level 3):
    Strongest: quality, privacy, security (score: 4)
    Weakest: ai_governance (score: 2)
    Priority: ai_governance, metadata, organization

Industry Insight: AI Governance is the weakest dimension across all companies (avg: 1.00)

=== END COMPARISON ===
```

**Validation:** exact-match
**Test Cases:** 2 visible + 1 hidden

**Why Deterministic:** Fixed scores, deterministic sorting/ranking algorithm, fixed formatting. Same dimension scores always produce the same comparative analysis.

---

## Summary

### Runner Distribution Summary

| Runner | Count | Modules Covered |
|--------|-------|-----------------|
| Python (Pyodide) | 15 | M01, M04, M05, M06, M08, M10 |
| SQL (sql.js) | 5 | M02, M04, M06 |
| JSON (json-validator) | 12 | M01, M03, M05, M06, M07, M08, M10 |
| YAML (yaml-validator) | 11 | M02, M04, M07, M09 |
| JavaScript (js-sandbox) | 2 | M06, M08 |
| **Total** | **45** | **M01-M10** |

### Module Distribution Summary

| Module | Challenges | Runners Used |
|--------|-----------|-------------|
| M01 Foundations | 4 | Python (3), JSON (1) |
| M02 Architecture | 7 | SQL (2), YAML (5) |
| M03 Metadata & Catalogs | 4 | JSON (3), Python (1) |
| M04 Data Quality | 7 | Python (3), SQL (2), YAML (2) |
| M05 Privacy & Compliance | 5 | Python (3), JSON (2) |
| M06 Security & Access | 5 | Python (1), SQL (1), JSON (2), JS (1) |
| M07 Implementation | 4 | JSON (2), YAML (2) |
| M08 AI Governance | 4 | Python (2), JSON (1), JS (1) |
| M09 Tools Ecosystem | 2 | YAML (2) |
| M10 Capstone | 3 | Python (2), JSON (1) |

### Bloom Level Distribution

| Level | Count | Percentage | Challenges |
|-------|-------|------------|------------|
| Apply | 9 | 20.0% | DG-CC-03, DG-CC-07, DG-CC-09, DG-CC-14, DG-CC-18, DG-CC-24, DG-CC-31, DG-CC-38, DG-CC-43 |
| Analyze | 24 | 53.3% | DG-CC-01, DG-CC-02, DG-CC-04, DG-CC-05, DG-CC-06, DG-CC-08, DG-CC-10, DG-CC-12, DG-CC-13, DG-CC-15, DG-CC-16, DG-CC-17, DG-CC-19, DG-CC-20, DG-CC-22, DG-CC-26, DG-CC-28, DG-CC-30, DG-CC-32, DG-CC-34, DG-CC-35, DG-CC-39, DG-CC-44, DG-CC-45 |
| Evaluate | 12 | 26.7% | DG-CC-11, DG-CC-21, DG-CC-23, DG-CC-25, DG-CC-27, DG-CC-29, DG-CC-33, DG-CC-36, DG-CC-37, DG-CC-40, DG-CC-41, DG-CC-42 |

### Challenge Index

| ID | Name | Module | Runner | Bloom |
|----|------|--------|--------|-------|
| DG-CC-01 | Governance Maturity Scorer | M01 | Python | Analyze |
| DG-CC-02 | Data Domain Classifier | M01 | Python | Analyze |
| DG-CC-03 | Governance Policy Template Validator | M01 | JSON | Apply |
| DG-CC-04 | Stakeholder RACI Generator | M01 | Python | Analyze |
| DG-CC-05 | Schema Quality Inspector | M02 | SQL | Analyze |
| DG-CC-06 | Naming Convention Checker | M02 | SQL | Analyze |
| DG-CC-07 | Data Model Documentation Generator | M02 | YAML | Apply |
| DG-CC-08 | Data Lineage YAML Descriptor | M02 | YAML | Analyze |
| DG-CC-43 | Minimal ODCS Data Contract | M02 | YAML | Apply |
| DG-CC-44 | Complete ODCS Contract with Schema and Quality | M02 | YAML | Analyze |
| DG-CC-45 | ODCS Quality Rules Definition | M02 | YAML | Analyze |
| DG-CC-09 | Data Catalog Entry Creator | M03 | JSON | Apply |
| DG-CC-10 | Metadata Lineage Graph Builder | M03 | JSON | Analyze |
| DG-CC-11 | Metadata Schema Validator | M03 | JSON | Evaluate |
| DG-CC-12 | Tag Classifier | M03 | Python | Analyze |
| DG-CC-13 | Data Quality Dimension Scorer | M04 | Python | Analyze |
| DG-CC-14 | Completeness Calculator | M04 | Python | Apply |
| DG-CC-15 | Freshness Checker | M04 | Python | Analyze |
| DG-CC-16 | Quality Violation Finder | M04 | SQL | Analyze |
| DG-CC-17 | Duplicate Detector | M04 | SQL | Analyze |
| DG-CC-18 | dbt Test Generator | M04 | YAML | Apply |
| DG-CC-19 | Great Expectations Suite Builder | M04 | YAML | Analyze |
| DG-CC-20 | PII Column Classifier | M05 | Python | Analyze |
| DG-CC-21 | Consent Validator | M05 | Python | Evaluate |
| DG-CC-22 | Data Masking Function | M05 | Python | Analyze |
| DG-CC-23 | DPIA Template Builder | M05 | JSON | Evaluate |
| DG-CC-24 | Data Classification Policy | M05 | JSON | Apply |
| DG-CC-25 | Access Decision Engine | M06 | Python | Evaluate |
| DG-CC-26 | Audit Log Query Builder | M06 | SQL | Analyze |
| DG-CC-27 | RBAC Policy Validator | M06 | JSON | Evaluate |
| DG-CC-28 | ABAC Policy Builder | M06 | JSON | Analyze |
| DG-CC-29 | Access Control Decision Function | M06 | JavaScript | Evaluate |
| DG-CC-30 | RACI Matrix Validator | M07 | JSON | Analyze |
| DG-CC-31 | Governance Charter Structure | M07 | JSON | Apply |
| DG-CC-32 | Implementation Roadmap Timeline | M07 | YAML | Analyze |
| DG-CC-33 | Governance KPI Definitions | M07 | YAML | Evaluate |
| DG-CC-34 | Bias Metric Calculator | M08 | Python | Analyze |
| DG-CC-35 | Model Card Generator | M08 | Python | Analyze |
| DG-CC-36 | AI Risk Assessment Template | M08 | JSON | Evaluate |
| DG-CC-37 | Fairness Scoring Function | M08 | JavaScript | Evaluate |
| DG-CC-38 | Docker Compose Validator | M09 | YAML | Apply |
| DG-CC-39 | Tool Comparison Matrix | M09 | YAML | Analyze |
| DG-CC-40 | Governance Program Scorer | M10 | Python | Evaluate |
| DG-CC-41 | Governance Assessment Output | M10 | JSON | Evaluate |
| DG-CC-42 | Governance Maturity Comparison | M10 | Python | Evaluate |
