# Case Study Companies -- Data Governance Course

**Last Updated:** 2026-03-04
**Companies:** 3 (governance maturity spectrum: Level 1, Level 2, Level 3)

## Purpose

These three fictional companies provide consistent organizational context for scenario-based questions, code challenges, and exam problems across all 11 modules of the Data Governance course. Every lesson that includes a scenario or case-based exercise must reference one of these companies by name.

Using recurring companies instead of ad-hoc examples:
- Builds familiarity -- students understand each company's constraints by Module 3
- Enables progression -- students see the same company evolve across modules
- Forces realism -- each company has a fixed tech stack, team size, and regulatory context that constrains solutions
- Supports the capstone -- Module 10 synthesizes governance programs for these companies

**Rule:** Lesson authors must select scenarios from the Module-to-Company Usage Matrix below. Introducing new fictional companies is not permitted without updating this document.

---

## Company A: DataTech Solutions / ДатаТех Солюшенз

### Profile

| Attribute | Detail |
|-----------|--------|
| **Full Name** | DataTech Solutions / ДатаТех Солюшенз |
| **Short Name** | DataTech / ДатаТех |
| **Industry** | E-commerce / retail analytics |
| **Founded** | 2018 |
| **HQ** | Moscow, Russia |
| **Employees** | 500 |
| **Revenue** | ~3 billion RUB annually |

### Data Team Structure

| Role | Count | Notes |
|------|-------|-------|
| Data Engineers | 3 | Maintain Airflow pipelines and dbt models |
| Data Analysts | 2 | Build Metabase dashboards, ad-hoc queries |
| BI Developer | 1 | Manages ClickHouse analytics warehouse |
| ML Engineer | 1 | Recommendation models, churn prediction |
| **Data Steward** | 0 | No dedicated governance roles |
| **DPO** | 0 | Privacy handled by Legal on case-by-case basis |
| **Total Data Team** | 7 | Reports to VP Engineering |

### Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Transactional DB | PostgreSQL | 15 | Main product database, 200+ tables |
| Analytics DB | ClickHouse | 23.8 | Analytics warehouse, loaded via batch ETL |
| Orchestration | Apache Airflow | 2.7 | 45 DAGs, no monitoring dashboard |
| Transformations | dbt Core | 1.7 | 120 models, no tests defined |
| BI | Metabase | 0.47 | 80+ dashboards, unknown % actively used |
| Storage | S3-compatible (MinIO) | Latest | Raw data lake, unorganized bucket structure |
| ML | Custom Python scripts | -- | No MLOps tooling, models run on cron jobs |
| Monitoring | None | -- | Failures discovered by business users |

### Governance Maturity: Level 1 (Initial)

**Current state:** No formal governance program exists. Data management is reactive.

| Dimension | Score (0-5) | Evidence |
|-----------|------------|----------|
| Data Quality | 1 | Ad-hoc checks; no systematic monitoring; business users report issues |
| Metadata Management | 0 | No data catalog; no documentation; tribal knowledge only |
| Privacy & Compliance | 1 | Legal reviews PII requests on case-by-case basis; 152-FZ gaps found in last audit |
| Security & Access | 1 | Shared database credentials; no role-based access; no audit logging |
| Governance Organization | 0 | No governance roles, no policies, no data council |
| AI Governance | 0 | ML models trained on production data without review; no model documentation |

### Key Pain Points

1. **Duplicate customer records** -- 15% estimated duplicate rate across CRM and order systems; no deduplication strategy
2. **Untrusted dashboards** -- Business users created 80+ Metabase dashboards; nobody knows which ones use correct data sources; executives make decisions based on conflicting numbers
3. **152-FZ compliance gaps** -- External audit revealed customer personal data stored without proper consent records; no data classification; no retention policy
4. **Uncontrolled ML** -- Recommendation model trained on full customer dataset including PII; no access controls on training data; model performance not monitored post-deployment
5. **No metadata management** -- New data engineer spent 3 weeks understanding table relationships; no documentation; SQL queries copied via Slack
6. **Data freshness issues** -- Analytics warehouse sometimes 2 days stale; no SLA defined; no alerting

### Regulatory Context

| Regulation | Status | Exposure |
|-----------|--------|----------|
| 152-FZ (Personal Data) | Non-compliant | Customer PII stored without proper consent; no data classification |
| GDPR | Not yet applicable | Planning EU market expansion in 12 months; no preparation started |
| PCI DSS | Not applicable | Uses third-party payment processor |

### Course Thread

DataTech Solutions is the **"starting from zero"** company. Students encounter DataTech's problems in every module and progressively design governance solutions:

- **M01:** Assess DataTech's maturity, identify governance gaps
- **M02:** Design a proper data architecture to replace ad-hoc structures
- **M03:** Plan a data catalog deployment for DataTech's 200+ tables
- **M04:** Implement quality monitoring for the ClickHouse warehouse
- **M05:** Build a 152-FZ compliance program; prepare for GDPR expansion
- **M06:** Design RBAC to replace shared database credentials
- **M07:** Create a governance charter and implementation roadmap for DataTech
- **M08:** Establish ML model governance for the recommendation system
- **M09:** Select governance tools (greenfield evaluation)
- **M10:** Capstone -- design a complete governance program for DataTech

---

## Company B: FinSecure Bank / ФинСекьюр Банк

### Profile

| Attribute | Detail |
|-----------|--------|
| **Full Name** | FinSecure Bank / ФинСекьюр Банк |
| **Short Name** | FinSecure / ФинСекьюр |
| **Industry** | Fintech / digital banking |
| **Founded** | 2005 |
| **HQ** | Moscow, Russia + EU subsidiary (Frankfurt) |
| **Employees** | 2,000+ |
| **Revenue** | ~25 billion RUB annually |

### Data Team Structure

| Role | Count | Notes |
|------|-------|-------|
| Data Engineers | 12 | Split across core banking and analytics teams |
| Data Analysts | 8 | Business intelligence and regulatory reporting |
| ML Engineers | 4 | Credit scoring, fraud detection, churn models |
| Data Architects | 3 | Maintain enterprise data model |
| Data Stewards | 2 | Appointed but understaffed; cover only core banking |
| DPO | 1 | Cross-border data protection oversight |
| **Total Data Team** | 30 | Data department reports to CTO |

### Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Core Banking DB | Oracle | 19c | Legacy; 800+ tables; undocumented schemas |
| Microservices DB | PostgreSQL | 15 | 15 microservice databases; well-structured |
| Event Streaming | Apache Kafka | 3.5 | 200+ topics; real-time transaction processing |
| Batch Processing | Apache Spark | 3.4 | ETL for regulatory reporting; overnight batches |
| Analytics Warehouse | Snowflake | Enterprise | 3 years of transaction data; growing rapidly |
| BI | Tableau | 2023.3 | Enterprise license; 200+ published dashboards |
| Secrets Management | HashiCorp Vault | 1.15 | API keys, DB credentials, certificates |
| Monitoring | Datadog | -- | Infrastructure monitoring; partial data pipeline coverage |
| Data Catalog | OpenMetadata | 1.2 | Deployed 6 months ago; 40% of datasets cataloged |

### Governance Maturity: Level 3 (Defined)

**Current state:** Formal governance program exists with documented policies, but enforcement is inconsistent.

| Dimension | Score (0-5) | Evidence |
|-----------|------------|----------|
| Data Quality | 3 | Automated checks on critical pipelines (Spark jobs); no coverage for microservices |
| Metadata Management | 3 | OpenMetadata deployed; 40% cataloged; lineage for Spark only |
| Privacy & Compliance | 4 | DPO appointed; GDPR program for EU subsidiary; 152-FZ compliant for core banking |
| Security & Access | 4 | RBAC on production databases; Vault for secrets; audit logging on core systems |
| Governance Organization | 3 | Data governance office exists; 2 stewards; monthly governance council meetings |
| AI Governance | 2 | Model risk committee exists; no automated fairness testing; audit trail gaps |

### Key Pain Points

1. **Legacy Oracle systems** -- Core banking on Oracle 19c with 800+ undocumented tables; 15 years of schema evolution; no one fully understands the data model; migration too risky without complete documentation
2. **Cross-border data transfer** -- EU subsidiary in Frankfurt requires GDPR compliance; customer data flows between Moscow and Frankfurt; Standard Contractual Clauses in place but technical controls are insufficient
3. **Shadow IT data copies** -- Business teams extract data to local spreadsheets and shared drives for analysis; at least 12 known shadow copies of customer data outside governed systems
4. **ML audit trail gaps** -- Credit scoring model approved by Model Risk Committee, but no automated fairness testing; regulators increasingly asking for explainability of automated decisions
5. **Too many policies, inconsistent enforcement** -- 47 published data policies; compliance measured only during annual audit; no automated policy enforcement
6. **Microservice data silos** -- 15 microservices each own their database; no cross-service data governance; duplicate customer representations across services

### Regulatory Context

| Regulation | Status | Exposure |
|-----------|--------|----------|
| Central Bank of Russia | Compliant | Regular reporting; data quality requirements for financial reporting |
| 152-FZ (Personal Data) | Compliant (core banking) | Gaps in microservice data and shadow copies |
| GDPR | Partially compliant | EU subsidiary program in place; cross-border transfer gaps |
| PCI DSS | Compliant | Card data in isolated Vault-protected zone; annual audit passed |

### Course Thread

FinSecure Bank is the **"has governance but struggles with consistency"** company. Scenarios focus on improving and enforcing existing governance in a complex environment:

- **M01:** Reference case for mature governance; used as comparison against DataTech
- **M02:** Legacy Oracle architecture problems; microservice data silos
- **M03:** Expanding OpenMetadata coverage; cataloging Oracle schemas
- **M04:** Extending quality monitoring from Spark pipelines to microservices
- **M05:** Cross-border GDPR compliance; shadow IT data leakage
- **M06:** PCI DSS access zones; RBAC across heterogeneous systems
- **M07:** Improving enforcement of existing 47 policies
- **M08:** Credit scoring fairness; model explainability for regulators
- **M09:** Tool migration challenges; integrating legacy monitoring
- **M10:** Reference for capstone comparison; mature governance baseline

---

## Company C: BioGenesis Lab / БиоГенезис Лаб

### Profile

| Attribute | Detail |
|-----------|--------|
| **Full Name** | BioGenesis Lab / БиоГенезис Лаб |
| **Short Name** | BioGenesis / БиоГенезис |
| **Industry** | Healthcare / biotech / clinical research |
| **Founded** | 2020 |
| **HQ** | St. Petersburg, Russia |
| **Employees** | 200 |
| **Revenue** | ~800 million RUB annually (mostly research grants and clinical trial contracts) |

### Data Team Structure

| Role | Count | Notes |
|------|-------|-------|
| Bioinformaticians | 2 | Genomic data processing and analysis |
| Data Engineers | 3 | Maintain ETL pipelines for clinical and research data |
| ML Researcher | 1 | Drug discovery models, biomarker prediction |
| Data Analysts | 1 | Clinical trial reporting |
| **Data Steward** | 0 | Informally handled by senior data engineer |
| **DPO** | 0 | Ethics board covers some privacy concerns; no formal DPO |
| **Total Data Team** | 7 | Reports to Head of Research |

### Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Operational DB | PostgreSQL | 15 | Patient records, clinical trial data, lab results |
| Genomic Storage | MinIO | Latest | Object storage for genomic sequences; 50+ TB |
| Research Notebooks | JupyterHub | 4.0 | 25 researchers with individual notebooks |
| Genomic Processing | Apache Spark | 3.4 | Batch processing for genomic analysis pipelines |
| Monitoring | Grafana | 10 | Infrastructure monitoring; no data pipeline monitoring |
| Pipelines | Custom Python | 3.11 | 30+ data pipeline scripts; no orchestrator |
| Clinical Reporting | R + Shiny | 4.3 | Clinical trial statistical reports |

### Governance Maturity: Level 2 (Managed)

**Current state:** Some governance exists for patient data due to regulatory pressure, but research data governance is informal.

| Dimension | Score (0-5) | Evidence |
|-----------|------------|----------|
| Data Quality | 2 | Quality checks exist for clinical data only (regulatory requirement); research data has no quality monitoring |
| Metadata Management | 1 | No data catalog; genomic data documented in researcher notebooks only |
| Privacy & Compliance | 2 | Patient consent forms collected; consent management is manual (paper + spreadsheets); no automated enforcement |
| Security & Access | 2 | Role-based access on PostgreSQL; MinIO access controlled by API keys; JupyterHub has individual accounts but no data access controls |
| Governance Organization | 1 | IRB/ethics board reviews research protocols; no data governance council or steward roles |
| AI Governance | 1 | ML models for drug discovery exist; no model cards; no bias testing; training data lineage unknown |

### Key Pain Points

1. **Research and clinical data mixing** -- Researchers access patient clinical data in JupyterHub for analysis without proper de-identification; no clear boundary between clinical (regulated) and research (less regulated) data environments
2. **Genomic consent management** -- Patient consent for genomic sequencing collected on paper forms; no digital consent management; unclear whether consent covers secondary research use; some genomic samples used in research without explicit consent for that purpose
3. **No de-identification pipeline** -- Patient data used in research notebooks contains direct identifiers (names, birth dates, medical record numbers); no automated de-identification or anonymization tools; risk of re-identification from genomic data combined with clinical data
4. **No lineage tracking** -- ML model for biomarker prediction trained on combined clinical + genomic data; impossible to trace which patient data was used; cannot fulfill data deletion requests for ML training data
5. **Third-party lab data integration** -- External laboratory results received as CSV files via email; no quality validation before loading into PostgreSQL; format inconsistencies cause pipeline failures
6. **Researcher access governance** -- 25 researchers have JupyterHub accounts; all researchers can access all datasets; no project-based access segregation; no access audit trail

### Regulatory Context

| Regulation | Status | Exposure |
|-----------|--------|----------|
| 152-FZ (Personal Data) | Partially compliant | Patient data consent exists but manual; gaps in researcher access |
| 323-FZ (Health Protection) | Partially compliant | Clinical data handling follows hospital protocols; research data uncontrolled |
| IRB / Ethics Board | Active | Reviews research protocols; does not audit data access or usage |
| International Clinical Trial Standards (GCP) | Compliant for trials | Trial data follows GCP standards; observational data uncontrolled |

### Course Thread

BioGenesis Lab deals with the **most sensitive data** in the course. Scenarios focus on privacy, consent, data classification, and research ethics:

- **M01:** Assess governance maturity in a research organization
- **M04:** Clinical data quality monitoring; lab data integration quality
- **M05:** Genomic consent management; patient data de-identification; research vs. clinical data boundaries
- **M06:** Researcher access controls; project-based data segregation; JupyterHub access governance
- **M08:** ML model governance for drug discovery; training data lineage; biomarker model fairness
- **M10:** Reference for capstone -- most sensitive data governance challenges

---

## Module-to-Company Usage Matrix

This matrix defines which company is the primary scenario source for each module. "Primary" means most scenarios and code challenges in that module use this company. "Secondary" means 1-2 supplementary scenarios. "--" means the company is not used in that module.

| Module | DataTech (L1) | FinSecure (L3) | BioGenesis (L2) |
|--------|---------------|----------------|-----------------|
| **M01** Foundations | Primary (starting governance) | Reference (mature example) | Secondary (research org) |
| **M02** Architecture | Primary (no architecture) | Secondary (legacy Oracle) | -- |
| **M03** Metadata & Catalogs | Primary (no catalog) | Secondary (partial OpenMetadata) | -- |
| **M04** Data Quality | Primary (ad-hoc checks) | Secondary (Spark pipelines) | Primary (clinical data quality) |
| **M05** Privacy & Compliance | Secondary (152-FZ gaps) | Primary (GDPR + 152-FZ cross-border) | Primary (patient consent + genomics) |
| **M06** Security & Access | Secondary (shared credentials) | Primary (PCI DSS + banking RBAC) | Primary (researcher access + patient data) |
| **M07** Implementation | Primary (building program) | Secondary (improving enforcement) | -- |
| **M08** AI Governance | Primary (uncontrolled ML) | Primary (credit scoring audit) | Primary (drug discovery ML) |
| **M09** Tools | Primary (greenfield selection) | Secondary (tool migration) | -- |
| **M10** Capstone | Primary (complete design) | Reference (mature baseline) | Reference (sensitive data) |

### Coverage Summary

| Company | Primary Modules | Secondary Modules | Reference Modules | Total Appearances |
|---------|-----------------|-------------------|-------------------|-------------------|
| DataTech Solutions (L1) | M01, M02, M03, M04, M07, M08, M09, M10 | M05, M06 | -- | 10 |
| FinSecure Bank (L3) | M05, M06, M08 | M02, M03, M04, M07, M09 | M01, M10 | 10 |
| BioGenesis Lab (L2) | M04, M05, M06, M08 | M01 | M10 | 6 |

---

## Naming Conventions

1. **First mention in a lesson:** Always use both Russian and English names
   - Example: "DataTech Solutions (ДатаТех Солюшенз) -- среднего размера e-commerce компания..."
   - Example: "FinSecure Bank (ФинСекьюр Банк) -- крупный цифровой банк..."

2. **Subsequent mentions in the same lesson:** Use the short form consistently
   - "DataTech" or "ДатаТех" (not "DataTech Solutions")
   - "FinSecure" or "ФинСекьюр" (not "FinSecure Bank")
   - "BioGenesis" or "БиоГенезис" (not "BioGenesis Lab")

3. **In code challenges and quiz questions:** Use the short English form
   - "DataTech's data team needs to..."
   - "FinSecure's DPO discovered that..."
   - "BioGenesis researchers are working on..."

4. **Company names are fictional** -- do not reference real companies. If a student asks about a real company with a similar name, clarify these are fictional case studies.

5. **Technology stack references are real** -- PostgreSQL, ClickHouse, Kafka, Snowflake, etc. are real products mentioned intentionally for realism. Version numbers in this document are fixed for consistency; do not update them in lesson content without updating this document.

6. **Regulatory references are real** -- 152-FZ, GDPR, PCI DSS, 323-FZ are actual regulations. Follow the authoring guidelines for regulatory content framing (teach principles, not provisions; isolate article numbers; date-stamp).

---

## Phase 34 New Lesson Company Assignments

Phase 34 (DMBOK2 Coverage Expansion) added 8 new lessons across 5 modules. Each lesson uses the company spectrum consistently:

| Lesson | Module | Primary Company | Secondary Company |
|--------|--------|-----------------|-------------------|
| 07-master-data-management | M01 Foundations | DataTech (L1, 15% duplicates) | FinSecure (L3, Oracle+microservices) |
| 07-data-integration-governance | M02 Architecture | DataTech (L1, 45 undocumented DAGs) | FinSecure (L3, 200+ Kafka topics) |
| 07-streaming-data-governance | M03 Metadata | FinSecure (L3, 200+ topics) | DataTech (L1, planning streaming) |
| 08-retention-archiving-disposal | M04 Quality | FinSecure (L3, 7-year retention) | BioGenesis (L2, clinical data) |
| 06-data-lifecycle-management | M07 Implementation | DataTech (L1, no lifecycle mgmt) | FinSecure (L3, inconsistent enforcement) |
| 07-third-party-data-governance | M07 Implementation | BioGenesis (L2, 8 external sources) | FinSecure (L3, EU cross-border) |
| 08-governance-communication | M07 Implementation | DataTech (L1, CEO needs ROI proof) | FinSecure (L3, board reporting) |
| 06-bi-analytics-governance | M09 Tools | DataTech (L1, 80+ dashboards) | FinSecure (L3, 200+ Tableau) |

### Coverage Impact

- **DataTech** appears as primary in 5/8 new lessons (MDM, integration, lifecycle, communication, BI governance)
- **FinSecure** appears as primary in 2/8 new lessons (streaming, retention) and secondary in 6/8
- **BioGenesis** appears as primary in 1/8 new lessons (third-party governance) and secondary in 1/8

---

## Cross-Company Comparison

| Dimension | DataTech (L1) | BioGenesis (L2) | FinSecure (L3) |
|-----------|---------------|-----------------|----------------|
| **Industry** | E-commerce | Healthcare / biotech | Fintech / banking |
| **Size** | 500 employees | 200 employees | 2,000+ employees |
| **Data team** | 7 people (no governance roles) | 7 people (no governance roles) | 30 people (stewards + DPO) |
| **Governance maturity** | Level 1 (Initial) | Level 2 (Managed) | Level 3 (Defined) |
| **Primary DB** | PostgreSQL + ClickHouse | PostgreSQL + MinIO | Oracle + Snowflake |
| **Key challenge** | Everything from scratch | Most sensitive data, consent | Legacy systems, consistency |
| **Regulatory pressure** | Moderate (152-FZ, future GDPR) | High (medical data, ethics) | Very high (banking + GDPR + PCI) |
| **Data catalog** | None | None | OpenMetadata (40%) |
| **ML governance** | None | None | Partial (committee, no automation) |
| **Primary course role** | Build governance from zero | Privacy and consent focus | Mature governance reference |
