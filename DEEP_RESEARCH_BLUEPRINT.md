# Deep Research Orchestration Blueprint

A concise reference for building an iterative, citation-centred research agent (e.g. Claude Code + Task agents).

---

## 1. Inputs & Knobs

| Parameter | Purpose |
|-----------|---------|
| `topic` | Question or subject of investigation |
| `config` | Budgets, LLM models, search engines, `max_queries`, `max_sources`, etc. |
| `interactive` | If `true`, orchestrator may prompt the user (not used in current lightweight flow) |

---

## 2. Core Data Structures

```text
ResearchPlan        – high-level stage tracker & config snapshot
QuerySet            – list[str] with status flags (pending, done, follow-up)
DeepResearchResult  – {url, title, raw, summary, evidence_id, credibility}
EvidenceTable       – Dict[evidence_id → DeepResearchResult]
```

---

## 3. Modular Stage Functions

| Stage | Function | Default Impl. | Swap-Out Ideas |
|-------|----------|---------------|----------------|
| 1 — Topic definition | _handled via prompt_ | — | — |
| 2 — Query generation | `generate_research_queries()` | LLM prompt | Rule-based templates |
| 3 — Search | `search_all_queries()` → `_search_engine_call()` | Exa web / papers / reddit / github | Bing API, ArXiv API |
| 4 — Summarise | `_summarize_content_async()` | LLM summariser | Local GPT-4o, langchain summariser |
| 5 — Gap analysis | `evaluate_research_completeness()` | LLM planner | Heuristic coverage scorer |
| 6 — Filter | `filter_results()` | Relevance / novelty heuristics | PageRank-like credibility scorer |
| 7 — Synthesis | `generate_research_answer()` | "answer_model" LLM | Graph-based RAG |
| 8 — Output render | `save_and_generate_html()`, `generate_pdf()` | Markdown → HTML/PDF | TTS podcast, slides |

Each function should be pure & swappable.

---

## 4. Control Loop (pseudocode)

```python
async def deep_research(topic, cfg):
    # Master plan +  queries 
    plan = ResearchPlan(cfg)
    queries = generate_research_queries(topic)

    
    while True:
        raw_results = await search_all_queries(queries)
        summaries   = await summarize_results(raw_results)
        evidence_table.add(summaries)

        follow_ups = evaluate_research_completeness(topic, evidence_table, queries)
        if not follow_ups or budget_exhausted(cfg):
            break
        queries = follow_ups  # next iteration

    filtered = filter_results(topic, evidence_table)
    report   = generate_research_answer(topic, filtered)
    return render_outputs(report, cfg.outputs)
```

---

## 5. Extension Hooks

* **Search adapters** – plug in any retrieval API returning `{url, title, content}`.
* **Credibility scorer** – micro-service checking domain reputation, citation count, author info.
* **Budget manager** – tracks token / $ spend and halts expensive calls.
* **Trace store** – push every stage artefact to a vector DB for audit / reuse.

---

## 6. Deployment Patterns

1. **Local CLI** – good for batch offline reports.
2. **Serverless function** – accept JSON `{topic, config}` → return JSON report.
3. **Product integration** – a "Deep Research" button inside an app (Claude Code orchestrator spawns Task agents).

---

## 7. Task-Agent Context Cookie

Include this HTML comment in prompts given to Task agents so they know their role when Claude Code spawns them:

```html
<!--TASK_AGENT_CONTEXT
role: Retriever-Summariser
motivation: Produce concise, citation-rich summaries for the orchestrator.
constraints: 4096 tokens max, return JSON {url, title, summary, credibility}
-->
```

---

## 8. Minimal Heuristics (copy-paste ready)

* **Query mix** – core topic • 2 perspective shifts • 1 temporal/comparative.
* **Filtering** – Relevance ≥ 0.8 · Unique claim · ≤ 3 yrs old or seminal · CredScore ≥ 60.
* **Best practice mantra** – *Iterate → Fill gaps → Cite everything*.

---

Happy researching! 🎓
