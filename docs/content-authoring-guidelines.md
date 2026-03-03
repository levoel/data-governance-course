# Content Authoring Guidelines -- Data Governance Course

> DG-specific authoring patterns extending the universal quiz-authoring-guide.md.
> Covers audience targeting, content ratio, scenario anchoring, regulatory framing,
> tool isolation, terminology authority, and cross-reference to all Phase 28 deliverables.
>
> **Audience:** Content author (human or Claude) working on DG course modules M00-M10.
> **Scope:** Lesson MDX structure, KnowledgeCheck placement, scenario integration, and quality enforcement.
> **Last Updated:** 2026-03-03

---

## 1. Purpose and Scope

This document defines **Data Governance-specific** authoring patterns. It does **not** replace the universal quiz and assessment guide -- it extends it.

### What this guide covers

- Audience markers per module (engineer / leadership / both)
- Content ratio enforcement (concept / tool-technique / scenario)
- Scenario anchoring using the 3 fictional case study companies
- Regulatory content framing (principles, date-stamps, disclaimers)
- Tool deep-dive isolation (marked sections, pinned versions)
- KnowledgeCheck-to-quiz ratio and placement
- Terminology authority (glossary as single source of truth)
- Code challenge assignment from the pre-defined catalog
- Cross-course references to Debezium CDC content
- Standard lesson MDX template
- Per-lesson quality checklist

### What this guide does NOT cover

For the following topics, refer to `docs/quiz-authoring-guide.md` (568 lines):

- Quiz JSON schema and field reference (`quizFileSchema`)
- Bloom's taxonomy levels and question type mapping
- True/False question limits (max 30% per quiz)
- Explanation quality standards (3-5 sentence explanations)
- Hint writing requirements (progressive, non-answer-revealing)
- Quiz ID conventions and `_meta` field usage
- Code challenge question schema (`code-challenge` type)
- Exam aggregation and `_exam.json` conventions
- Validation workflow (`validate-quizzes.ts`)
- Scaffold generation (`scaffold-quizzes.ts`)

**Rule:** When authoring quiz JSON files, follow `docs/quiz-authoring-guide.md`. When authoring lesson MDX content, follow this guide. Both apply simultaneously.

---

## 2. Terminology Authority

### Single Source of Truth

The file `data/glossary.json` is the **authoritative** source for all Russian Data Governance terminology. It contains 117 terms across 8 categories, following the DMBOK2 Russian standard (ISBN 978-5-9693-0404-8).

**Rule:** Before using any DG term in a lesson, check `data/glossary.json` for the approved translation.

### Contested Term Decisions

These terms have multiple possible Russian translations. The glossary specifies which translation to use. Do not deviate.

| English Term | Approved Russian Form | Notes |
|-------------|----------------------|-------|
| Data Governance | Data Governance (руководство данными) | English borrowing + Russian clarification |
| Data Management | Data Management (управление данными) | Paired with Governance to distinguish |
| Data Steward | Data Steward (распорядитель данных) | DMBOK2 Russian standard |
| Data Owner | Владелец данных (Data Owner) | Stable Russian term leads |
| Data Lineage | Data Lineage (происхождение данных) | English borrowing + Russian clarification |
| Data Catalog | Каталог данных | Stable Russian term, no English needed |
| Metadata | Метаданные | Stable Russian term, no English needed |
| Data Masking | Маскирование данных | Distinct from Обезличивание (anonymization) |
| Data Quality | Качество данных (Data Quality) | Stable Russian term leads |
| Data Asset | Актив данных (Data Asset) | Stable Russian term leads |

### First-Use Rule

On **first use** of any glossary term in a lesson, use the format:

```
English Term (Russian Translation)
```

Example: "Data Governance (руководство данными) -- это система принятия решений..."

On subsequent uses within the same lesson, use whichever form is more natural in context.

### Terminology in Quizzes

**NEVER** test terminology recall in quiz or exam questions. Test understanding of concepts instead.

| Quality | Example |
|---------|---------|
| Bad | "Как переводится Data Steward?" |
| Bad | "Выберите правильный перевод термина Data Lineage" |
| Good | "Кто отвечает за качество данных в конкретном бизнес-домене?" |
| Good | "Какой процесс позволяет отследить происхождение данных от источника до отчёта?" |

### Term Variants

When the glossary lists related but distinct terms (e.g., "маскирование данных" vs "обезличивание данных"), use the specific term from the glossary entry. These are NOT interchangeable:

- **Маскирование данных (Data Masking):** Replacing sensitive values with realistic but fake values. Original data preserved, masked copy used for non-production.
- **Обезличивание данных (Data Anonymization):** Irreversible removal of personally identifiable information. Original association cannot be restored.

---

## 3. Audience Markers

### Module-Audience Designation Table

Every module has a designated primary audience. This designation is **fixed** -- do not change it without updating this document.

| Module | Primary Audience | Content Implications |
|--------|-----------------|---------------------|
| M00: Introduction | Both | High-level orientation, no code, motivational framing |
| M01: Foundations | Both | Framework concepts, light illustrative examples |
| M02: Architecture | Engineers | Data modeling, schema design, SQL, architecture patterns |
| M03: Metadata & Catalogs | Engineers | API examples, OpenMetadata configuration, dbt integration |
| M04: Data Quality | Engineers | Most hands-on: Python, SQL, YAML, Great Expectations |
| M05: Privacy & Compliance | Both | Legal principles + technical implementation (PII detection, consent) |
| M06: Security & Access | Engineers | RBAC/ABAC code, policy-as-code (OPA Rego), row-level security |
| M07: Implementation | Leadership | Program design, stakeholder engagement, KPIs, maturity assessment |
| M08: AI Governance | Both | EU AI Act + technical bias detection, model cards |
| M09: Tools Ecosystem | Both | Tool selection frameworks, comparison matrices |
| M10: Capstone | Both | Synthesis project combining all modules |

### Authoring Rules by Audience Type

**For "Engineers" modules (M02, M03, M04, M06):**

- Include code examples in 60%+ of lessons
- Use technical language freely (SQL, API, YAML, Docker)
- Code challenges are expected in most lessons
- KnowledgeChecks can test technical details
- Scenarios should focus on technical implementation decisions

**For "Leadership" modules (M07):**

- Focus on frameworks, KPIs, stakeholder management, organizational design
- Code examples are illustrative, not required
- Use business language, explain technical concepts when referenced
- KnowledgeChecks test strategic thinking and decision-making
- Scenarios should focus on organizational and governance decisions
- Challenges (if any) use JSON/YAML for policy/framework definition, not Python/SQL

**For "Both" modules (M00, M01, M05, M08, M09, M10):**

- Lead with business context, follow with technical implementation
- Every lesson must have value for both engineers and leaders
- Code examples present but explained in business terms
- Use "why this matters" framing before technical deep-dives
- KnowledgeChecks alternate between conceptual and technical
- Scenarios include both organizational and technical aspects

### Audience Marker in Frontmatter

Every lesson's frontmatter SHOULD include an audience hint for content reviewers:

```yaml
---
title: "..."
description: "..."
order: 1
audience: "engineers"  # engineers | leadership | both
---
```

This field is informational (not enforced by schema) but helps reviewers verify content matches module designation.

---

## 4. Content Ratio per Module

### Target Ratio

Each module should approximate this content distribution (measured by lesson count):

| Content Type | Target | Description |
|-------------|--------|-------------|
| Concept | 30% | Theory, frameworks, definitions, principles |
| Tool-Technique | 40% | Hands-on implementation, code, tool walkthroughs |
| Scenario | 30% | Case study application, real-world problem solving |

### Ratio by Module Size

| Module Size | Concept Lessons | Tool-Technique Lessons | Scenario Lessons |
|-------------|----------------|----------------------|-----------------|
| 4 lessons | 1 | 2 | 1 |
| 5 lessons | 1-2 | 2 | 1-2 |
| 6 lessons | 2 | 2-3 | 1-2 |
| 7 lessons | 2 | 3 | 2 |

**Module summary lessons** (if present) do not count toward the ratio.

### Abstraction Trap Detection (CRITICAL-01)

**Detection criteria:** More than 3 consecutive lessons with zero code samples = **abstraction takeover**.

If detected during authoring or review:

1. STOP authoring the next lesson
2. Insert a tool-technique or scenario lesson before continuing
3. Refactor existing lessons to add inline code examples where appropriate

This applies even to "Both" audience modules. Every module needs implementation grounding.

### Bloom's Distribution for Assessments

| Assessment Type | Max Conceptual (Remember + Understand) | Min Analytical (Apply + Analyze + Evaluate) |
|----------------|----------------------------------------|---------------------------------------------|
| Lesson quizzes | 40% | 60% |
| Module exams | 30% | 70% (min 50% Apply+Analyze) |

**Rule:** If a module's quiz questions exceed 40% conceptual (Remember + Understand), rewrite questions to target higher Bloom's levels. See `docs/quiz-authoring-guide.md` for Bloom's level definitions and examples.

---

## 5. Scenario Anchoring

### Case Study Companies

All scenarios MUST use one of the 3 fictional companies defined in `docs/case-study-companies.md`:

| Company | Industry | Size | Governance Maturity | Primary Role |
|---------|----------|------|--------------------|-------------|
| DataTech Solutions / ДатаТех Солюшенз | E-commerce | 500 | Level 1 (Initial) | Building governance from zero |
| BioGenesis Lab / БиоГенезис Лаб | Healthcare / biotech | 200 | Level 2 (Managed) | Sensitive data, consent focus |
| FinSecure Bank / ФинСекьюр Банк | Fintech / banking | 2,000+ | Level 3 (Defined) | Mature governance reference |

### Module-to-Company Usage Matrix

Use the matrix in `docs/case-study-companies.md` (Section: Module-to-Company Usage Matrix) to determine which company is Primary, Secondary, or Reference for each module.

**Rule:** Every module MUST have at least 1 scenario grounded in one of the 3 case study companies.

**Rule:** Use the company designated as "Primary" for the main scenario in each module. "Secondary" companies provide supplementary or contrasting scenarios.

### Scenario Quality Rules

1. **Reference specific pain points** from the company profile. Not "a company had a problem" but "DataTech's data team discovered 15% customer record duplication across PostgreSQL, ClickHouse, and Metabase."

2. **Use the company's actual tech stack.** DataTech uses PostgreSQL + ClickHouse + Airflow + dbt. Do not give DataTech a Snowflake warehouse or FinSecure a PostgreSQL primary database.

3. **Respect governance maturity.** DataTech (L1) should not have a functioning data catalog. FinSecure (L3) should not lack basic access controls. Scenarios must be consistent with each company's maturity assessment.

4. **Progress within modules.** If a module uses a company across multiple lessons, show realistic progression (discovery -> analysis -> implementation -> results).

### Scenario Format in MDX

Use a blockquote with company name in bold:

```mdx
> **Сценарий: ДатаТех Солюшенз**
> В ДатаТех обнаружили, что 15% записей клиентов дублируются в трёх системах:
> PostgreSQL (основная БД), ClickHouse (аналитика) и Metabase (дашборды).
> Data-инженер Алексей получил задачу провести аудит качества данных...
```

For secondary company scenarios within the same lesson:

```mdx
> **Для сравнения: ФинСекьюр Банк**
> В отличие от ДатаТех, в ФинСекьюр эта проблема была решена ещё на уровне
> Master Data Management: единый Golden Record клиента обновляется через CDC-пайплайн...
```

### Naming Conventions

Follow the naming rules from `docs/case-study-companies.md`:

- **First mention:** Both Russian and English: "DataTech Solutions (ДатаТех Солюшенз)"
- **Subsequent mentions:** Short form: "DataTech" or "ДатаТех"
- **In code challenges:** Short English form: "DataTech's data team needs to..."

---

## 6. Regulatory Content Framing

### Principles, Not Provisions (CRITICAL-02)

**Rule:** Teach regulatory *principles*, not specific *provisions*. Focus on "what GDPR requires" rather than "Article 17 states that..."

| Quality | Example |
|---------|---------|
| Bad | "Согласно пункту 3 статьи 5 152-ФЗ, оператор обязан..." |
| Good | "152-ФЗ требует, чтобы оператор получил согласие субъекта на обработку персональных данных. Рассмотрим, как это реализуется технически..." |

### RegulationRef Component

When specific articles or provisions ARE referenced (unavoidable in compliance-focused lessons), isolate them in a dedicated component:

```mdx
<RegulationRef
  regulation="GDPR"
  article="17"
  title="Right to Erasure"
  lastVerified="2026-03"
/>
```

```mdx
<RegulationRef
  regulation="152-FZ"
  article="9"
  title="Consent to Processing"
  lastVerified="2026-03"
/>
```

> **Note:** The `RegulationRef` component will be built in Phase 29. During initial authoring, use a placeholder callout:
> ```mdx
> :::regulation[GDPR, Article 17 -- Right to Erasure]
> Last verified: 2026-03
> :::
> ```

### Date-Stamping

**Rule:** All regulatory content MUST include a `lastVerified` date. Regulations change. Content without a date-stamp cannot be maintained.

Format: `YYYY-MM` (month-level granularity is sufficient).

### Regulatory Disclaimer

**Rule:** Every lesson that discusses specific regulatory requirements MUST include this disclaimer, either in the introduction or as a callout:

```mdx
:::caution[Правовая оговорка]
Данный материал носит образовательный характер и не является юридической консультацией.
Для применения в конкретной организации обратитесь к юристу, специализирующемуся на защите данных.
:::
```

### Russian Regulatory Priority

**Rule:** This is a Russian-language course for a Russian-speaking audience. Prioritize Russian regulations alongside EU ones:

| Topic | Russian Regulation | EU/International Regulation |
|-------|-------------------|---------------------------|
| Personal data | 152-ФЗ "О персональных данных" | GDPR |
| Medical data | 323-ФЗ "Об основах охраны здоровья" | HIPAA (reference only) |
| Banking data | 395-1-ФЗ "О банках и банковской деятельности" | PCI DSS |
| AI governance | (evolving) | EU AI Act |

**Rule:** When both Russian and EU regulations apply (e.g., cross-border data for FinSecure), present both with clear jurisdictional context. Never imply one supersedes the other without explaining when each applies.

### Regulatory Content Freshness

**Rule:** Never present regulatory requirements as static. Always note that regulations evolve:

```mdx
> Требования 152-ФЗ регулярно обновляются. Описанные здесь положения актуальны
> на {lastVerified}. Проверяйте текущую редакцию на pravo.gov.ru.
```

---

## 7. Tool Deep-Dive Isolation

### Concept-First, Tool-Second (CRITICAL-03)

**Rule:** Students must understand the concept BEFORE seeing the tool implementation. Structure lessons as:

1. **What** is the concept? (e.g., "data cataloging is the process of...")
2. **Why** does it matter? (business value, governance impact)
3. **How** does it work conceptually? (generic workflow, not tool-specific)
4. **Tool Deep Dive:** How does [specific tool] implement this?

### ToolDeepDive Component

Wrap all tool-specific content in marked sections:

```mdx
<ToolDeepDive tool="OpenMetadata" version="1.3.x" lastVerified="2026-03">

### Setting up OpenMetadata Data Catalog

OpenMetadata provides a REST API for registering data assets...

```yaml
# docker-compose.yml (pinned to SHA)
services:
  openmetadata:
    image: openmetadata/server@sha256:abc123...
```

</ToolDeepDive>
```

> **Note:** The `ToolDeepDive` component will be built in Phase 29. During initial authoring, use a styled callout:
> ```mdx
> :::tool-deep-dive[OpenMetadata 1.3.x -- Last verified: 2026-03]
> ... tool-specific content ...
> :::
> ```

### Docker Image Pinning

**Rule:** Pin Docker images to SHA digests in ALL lab configurations. Never use `:latest` tags.

| Quality | Example |
|---------|---------|
| Bad | `image: openmetadata/server:latest` |
| Bad | `image: openmetadata/server:1.3.0` |
| Good | `image: openmetadata/server@sha256:abc123def456...` |

Include the human-readable version as a comment:

```yaml
# OpenMetadata 1.3.0 (pinned 2026-03)
image: openmetadata/server@sha256:abc123def456...
```

### Swappability Requirement

**Rule:** Tool-specific content should be swappable without rewriting the conceptual foundation.

Test: If OpenMetadata is replaced by DataHub, only the `<ToolDeepDive>` sections should need rewriting. The surrounding lesson content (concepts, scenarios, KnowledgeChecks) should remain valid.

### Tools Referenced in This Course

| Tool | Used In | Purpose |
|------|---------|---------|
| OpenMetadata | M03, M09 | Data cataloging, metadata management |
| Great Expectations | M04 | Data quality validation |
| dbt | M02, M04 | Data modeling, data transformations |
| OPA (Open Policy Agent) | M06 | Policy-as-code, authorization |
| Apache Atlas | M09 | Data catalog comparison |
| DataHub | M09 | Data catalog comparison |
| Collibra | M09 | Data catalog comparison (commercial) |

---

## 8. KnowledgeCheck-to-Quiz Ratio

### KnowledgeCheck Rules

| Rule | Details |
|------|---------|
| **Count** | 1-2 KnowledgeChecks per lesson |
| **Placement** | Inline, immediately after the concept being tested |
| **Purpose** | Immediate reinforcement of the concept just explained |
| **Format** | Single question, self-check, no grading |
| **Component** | `<KnowledgeCheck>` |

### Placement: Inline, Not Grouped

**Rule:** KnowledgeChecks go INSIDE the lesson flow, right after a concept is explained. Never group them at the end of a lesson.

| Quality | Placement |
|---------|-----------|
| Bad | All KCs at the bottom of the lesson |
| Bad | KC section before the summary |
| Good | KC after explaining data catalog purpose (mid-lesson) |
| Good | KC after showing RBAC configuration (in technical section) |

### KC vs Quiz Distinction

| Aspect | KnowledgeCheck (KC) | Quiz Question |
|--------|-------------------|---------------|
| **Scope** | Tests the concept just explained (1 paragraph/section) | Tests the lesson as a whole |
| **Timing** | Inline during reading | After completing the lesson |
| **Grading** | Self-check only, no score | Scored, tracked in progress |
| **Repetition** | Student sees answer immediately | Student sees explanation after submission |
| **Bloom's** | Typically Remember or Understand | Apply, Analyze, or Evaluate |

### Non-Duplication Rule

**Rule:** Quiz questions MUST NOT duplicate KnowledgeCheck questions. If a KC asks "What is the primary purpose of a data catalog?", the quiz must test a different aspect (e.g., "Given DataTech's 200+ tables across 3 systems, which cataloging approach would reduce discovery time?").

### KnowledgeCheck Format in MDX

```mdx
<KnowledgeCheck
  question="Чем маскирование данных отличается от обезличивания?"
  answer="Маскирование заменяет значения реалистичными, но фиктивными данными, сохраняя оригинал. Обезличивание необратимо удаляет связь между данными и субъектом."
/>
```

---

## 9. Code Challenge Assignments

### Challenge Catalog Reference

All code challenges are pre-defined in `docs/code-challenge-catalog.md` (42 challenges across 5 runners).

**Rule:** Each lesson's code challenge MUST come from the pre-defined catalog. Do not create ad-hoc challenges.

**Rule:** If a lesson needs a challenge not in the catalog, update the catalog document FIRST, then author the lesson.

### Challenge Distribution by Module

| Module | Challenges | Runners |
|--------|-----------|---------|
| M01: Foundations | 2 | Python, JSON |
| M02: Architecture | 4 | Python, SQL, JSON, YAML |
| M03: Metadata & Catalogs | 5 | Python, JSON, YAML |
| M04: Data Quality | 7 | Python (3), SQL, JSON, YAML, JS |
| M05: Privacy & Compliance | 5 | Python (2), JSON, YAML, JS |
| M06: Security & Access | 5 | Python, SQL, JSON, YAML |
| M07: Implementation | 3 | Python, JSON, YAML |
| M08: AI Governance | 4 | Python (2), JSON, YAML |
| M09: Tools Ecosystem | 4 | Python, JSON (2), YAML |
| M10: Capstone | 3 | Python, SQL, JSON |

### Challenge Context in Lessons

**Rule:** When authoring a lesson with an assigned challenge, include setup context in the lesson prose BEFORE the challenge widget appears. The student should understand:

1. What business problem this challenge addresses
2. Which case study company this scenario involves
3. What technical approach they will implement

Example flow:

```mdx
## Практика: Профилирование данных клиентов

В ДатаТех необходимо провести профилирование таблицы `customers` для выявления
проблем с качеством данных. Используя Python, напишите функцию, которая вычислит
ключевые метрики качества для каждого столбца...

<CodeChallenge id="DG-CC-15" />
```

### Difficulty Progression

**Rule:** Challenge difficulty should progress within a module following Bloom's taxonomy:

1. **Early lessons:** Apply (implement a known pattern)
2. **Middle lessons:** Analyze (examine data, identify issues)
3. **Late lessons:** Evaluate (make decisions, assess trade-offs)

### Determinism Requirement

**Rule:** Never create a challenge that requires non-deterministic validation. All challenges use:

- Fixed inputs (no random data, no network, no time-dependent logic)
- Exact expected outputs (validated by platform runners)
- Pre-loaded datasets for SQL challenges (SQLite via sql.js)

---

## 10. Cross-Course References

### Debezium CDC Course Overlap

The Data Governance course overlaps with the Debezium CDC Mastery course in several areas. When these topics arise, link to the relevant Debezium lesson for deeper technical coverage.

| DG Topic | Debezium Reference | Link |
|----------|-------------------|------|
| CDC and Data Lineage | Module 6: Data Engineering Patterns | `[CDC и Data Lineage](/debezium/06-module-6/03-data-pipeline-patterns/)` |
| Streaming data quality | Module 4: Production Operations (monitoring) | `[Мониторинг качества потоковых данных](/debezium/04-module-4/02-monitoring-metrics/)` |
| Event-driven governance | Module 5: SMT Patterns | `[Event-driven паттерны](/debezium/05-module-5/01-single-message-transforms/)` |

### Cross-Reference Format

Use standard MDX links with course prefix:

```mdx
> Подробнее о CDC и Data Lineage: [CDC и Data Lineage](/debezium/06-module-6/03-data-pipeline-patterns/)
```

### When to Cross-Reference

- When DG lesson mentions a concept covered in depth in Debezium course
- When a scenario involves CDC pipelines (common for FinSecure's architecture)
- When data quality monitoring involves streaming data

### When NOT to Cross-Reference

- Do not cross-reference for basic database concepts (SQL, indexes)
- Do not cross-reference if the DG lesson is self-contained on the topic
- Maximum 1-2 cross-references per lesson (avoid sending students away)

---

## 11. Lesson Structure Template

### Standard MDX Lesson Structure

Every lesson should follow this structure. Sections may be reordered for pedagogical reasons, but all required elements must be present.

```mdx
---
title: "Lesson Title / Название урока"
description: "One-sentence description for SEO and lesson cards"
order: 1
difficulty: "beginner"       # beginner | intermediate | advanced
estimatedTime: 15            # minutes
audience: "engineers"        # engineers | leadership | both
topics: ["data-quality", "profiling"]
---

# {Lesson Title}

## Введение

{Why this topic matters -- connect to business value.
 Frame the problem before introducing the solution.
 1-2 paragraphs maximum.}

## {Core Concept Section}

{Concept explanation with diagrams where appropriate.
 Define terms using glossary.json translations.
 First use: "English Term (Russian Translation)"}

<KnowledgeCheck
  question="..."
  answer="..."
/>

## {Hands-On / Technical Section}

{Code examples, tool walkthroughs, configuration snippets.
 For "Both" audience modules: explain code in business terms.
 For "Engineers" modules: focus on implementation details.}

:::tool-deep-dive[ToolName X.Y.z -- Last verified: YYYY-MM]
{Tool-specific content isolated here}
:::

## {Scenario Section}

> **Сценарий: {Company Name}**
> {Scenario grounded in case study company.
>  Reference specific pain points from company profile.
>  Use company's actual tech stack.}

{Analysis, discussion, or hands-on activity based on scenario.}

<KnowledgeCheck
  question="..."
  answer="..."
/>

## {Code Challenge Section (if assigned)}

{Setup context: business problem, company, technical approach.}

<CodeChallenge id="DG-CC-{NN}" />

## Итоги

{3-5 key takeaways as bullet points.
 Link to next lesson for continuity.
 Cross-course reference if relevant.}
```

### Frontmatter Requirements

| Field | Required | Validation |
|-------|----------|------------|
| `title` | Yes | Non-empty string |
| `description` | Yes | Non-empty string, under 160 characters |
| `order` | Yes | Positive integer, unique within module |
| `difficulty` | Yes | One of: beginner, intermediate, advanced |
| `estimatedTime` | Yes | Positive integer (minutes) |
| `audience` | Recommended | One of: engineers, leadership, both |
| `topics` | Recommended | Array of topic slugs |

### Section Order Flexibility

The template above is the **default** order. Acceptable variations:

- **Scenario-first lessons:** Start with scenario, then teach the concept needed to solve it (problem-based learning)
- **Lab lessons:** Longer technical section, scenario integrated into the lab
- **Comparison lessons:** Multiple tool deep-dives side by side (M09)

All variations MUST still include: introduction, at least 1 KC, scenario with case study company, and summary.

---

## 12. Quality Checklist (Per Lesson)

Before marking any lesson as complete, verify all applicable items:

### Content Structure

- [ ] Lesson follows the standard MDX template (Section 11)
- [ ] Frontmatter includes all required fields
- [ ] Introduction connects topic to business value
- [ ] Summary includes 3-5 key takeaways

### Audience Alignment

- [ ] Content matches this module's audience designation (Section 3)
- [ ] For "Engineers" modules: 60%+ of lessons contain code
- [ ] For "Leadership" modules: frameworks and KPIs emphasized
- [ ] For "Both" modules: business context leads, technical follows

### Terminology

- [ ] All DG terms use `data/glossary.json` translations (Section 2)
- [ ] First use of each term follows "English (Russian)" format
- [ ] No quiz questions test terminology recall

### Content Ratio

- [ ] Module is not in abstraction takeover (no 3+ consecutive codeless lessons) (Section 4)
- [ ] Module approximates 30/40/30 concept/tool-technique/scenario ratio
- [ ] Quiz questions: max 40% conceptual (Remember + Understand)

### Scenario Anchoring

- [ ] At least 1 scenario uses a case study company from `docs/case-study-companies.md` (Section 5)
- [ ] Company selection follows Module-to-Company Usage Matrix
- [ ] Scenario references specific company pain points (not generic)
- [ ] Company tech stack is accurate (no invented tools)
- [ ] Company governance maturity is respected (L1 != L3)

### Regulatory Content

- [ ] Regulatory content teaches principles, not provisions (Section 6)
- [ ] Specific article references use `RegulationRef` component (or placeholder callout)
- [ ] Regulatory content has `lastVerified` date stamp
- [ ] Regulatory lessons include the legal disclaimer
- [ ] Russian regulations presented alongside EU regulations

### Tool Content

- [ ] Tool-specific content is in `ToolDeepDive` sections (or placeholder callout) (Section 7)
- [ ] Docker images pinned to SHA digest
- [ ] Concept taught before tool implementation
- [ ] Tool content is swappable without rewriting conceptual foundation

### KnowledgeChecks

- [ ] 1-2 KnowledgeChecks per lesson (Section 8)
- [ ] KCs placed inline (not grouped at end)
- [ ] KCs test concept just explained
- [ ] KC questions do not duplicate quiz questions

### Code Challenges

- [ ] Challenge comes from `docs/code-challenge-catalog.md` (Section 9)
- [ ] Lesson includes setup context before challenge widget
- [ ] Challenge difficulty matches position in module progression
- [ ] Challenge uses deterministic validation only

### Cross-References

- [ ] Cross-course links included where relevant (Section 10)
- [ ] Maximum 1-2 cross-references per lesson
- [ ] Links use correct course prefix format

---

## Appendix A: Quick Reference Card

For fast lookup during authoring:

| What | Where |
|------|-------|
| Quiz JSON schema, Bloom's, T/F limits | `docs/quiz-authoring-guide.md` |
| Russian DG term translations | `data/glossary.json` (117 terms) |
| Code challenge specifications | `docs/code-challenge-catalog.md` (42 challenges) |
| Case study company profiles | `docs/case-study-companies.md` (3 companies) |
| Module audience designations | This document, Section 3 |
| Content ratio targets | This document, Section 4 |
| Regulatory framing rules | This document, Section 6 |
| Tool isolation patterns | This document, Section 7 |
| Lesson MDX template | This document, Section 11 |
| Per-lesson quality checklist | This document, Section 12 |

## Appendix B: CRITICAL Pitfall Cross-Reference

This document addresses all five critical pitfalls identified during course research:

| Pitfall | Section | Prevention Mechanism |
|---------|---------|---------------------|
| CRITICAL-01: Abstraction Trap | Section 4 | 30/40/30 ratio, 3-lesson detection rule |
| CRITICAL-02: Regulatory Staleness | Section 6 | Principles not provisions, date-stamps, disclaimers |
| CRITICAL-03: Tool Version Churn | Section 7 | ToolDeepDive isolation, SHA pinning, swappability |
| CRITICAL-04: Audience Bifurcation | Section 3 | Module-audience table, per-audience authoring rules |
| CRITICAL-05: Terminology Instability | Section 2 | Glossary as single source of truth, first-use format |
