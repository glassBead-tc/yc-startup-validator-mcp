# Deep Research Workflow with Exa MCP Server

This workflow implements a sophisticated, iterative research methodology that leverages multiple Exa MCP tools to conduct comprehensive, academic-quality research on any topic. The workflow is designed to mimic how expert researchers approach complex topics through multiple rounds of investigation, evaluation, and synthesis.

## Overview

The Deep Research workflow is an advanced research methodology that:
- Starts with broad exploration and iteratively refines focus
- Evaluates completeness and identifies knowledge gaps
- Synthesizes information from multiple sources
- Produces comprehensive, well-sourced research reports

## Core Workflow Stages

### Prompt-Based Topic Definition
Provide a single, well-scoped prompt line like:
> Research Topic: **"…"** (include timeframe, perspective, any exclusions)

<!--TASK_AGENT_CONTEXT
role: Retriever-Summariser
motivation: Produce concise, citation-rich summaries for the main orchestrator.
constraints: 4096 tokens max, return JSON {url, title, summary, credibility}
-->

### Stage 2: Initial Query Generation
Generate efficient search queries:

```
• Core topic exactly as-is
• Two perspective shifts (e.g., regulation, implementation, ethics)
• One temporal/comparative angle (e.g., "past 2 years" or "vs. 2019")
```

### Stage 3: Parallel Search Execution
Execute searches across multiple tools simultaneously:

```
Parallel Execution:
- web_search_exa → Current news and developments
- research_paper_search_exa → Academic papers
- wikipedia_search_exa → Foundational knowledge
- reddit_search_exa → Community discussions
- github_search_exa → Open source implementations
```

### Stage 4: Content Summarization with Source Tracking
Each search result undergoes intelligent summarization with citation tracking:

```
For each result:
1. Extract raw content
2. Identify relevance to research topic
3. Summarize key findings
4. Preserve important quotes and data
5. Note source credibility indicators
6. Assign unique evidence ID (EV-001, EV-002, etc.)
7. Track: URL, title, author, publication date, tool source
```

### Stage 5: Iterative Research Cycles
The system evaluates research completeness and generates follow-up queries:

```
Evaluation Process:
1. Analyze current findings coverage
2. Identify knowledge gaps
3. Generate targeted follow-up queries
4. Repeat until:
   - Budget exhausted
   - No gaps identified
   - Sufficient depth achieved
```

### Stage 6: Result Filtering and Source Selection
Filter and prioritize sources based on relevance and quality:

```
Filtering Criteria:
Relevance ≥ 0.8 · Unique claim · ≤3 yrs old or seminal · CredScore ≥ 60
```

### Stage 7: Research Synthesis with Evidence Citations
Generate comprehensive research report with inline citations:

```
Report Structure:
1. Executive Summary
2. Key Findings (with evidence markers)
3. Detailed Analysis (with inline citations)
4. Supporting Evidence
5. Conclusions
6. Evidence Citations (full source list)
```

**Citation Requirements:**
- Every factual claim must include an evidence marker [EV-XXX]
- Track source URL, title, author, and publication date
- Note confidence levels for each source
- Cross-reference claims across multiple sources
- Group citations by search tool for transparency

**Common Issues to Address:**
- Same paper on multiple platforms (e.g., arXiv + journal)
- PDF vs HTML/abstract page URLs
- Author name variations
- Access restrictions on certain platforms
- Temporal inconsistencies (future dates citing past events)

**Final Verification Summary:**
Include a brief summary noting:
- Total claims verified
- Distribution of confidence levels
- Any claims removed or revised
- Overall research reliability assessment

## Implementation with MCP Tools

### Tool Orchestration Strategy

#### Initial Broad Search
```
// Parallel execution for comprehensive coverage
1. web_search_exa(topic) → Recent developments
2. research_paper_search_exa(topic) → Academic foundation
3. wikipedia_search_exa(topic) → Background knowledge
4. reddit_search_exa(topic) → Public discourse
```

#### Targeted Deep Dives
```
// Based on initial findings
1. company_research_exa(key_players) → Industry analysis
2. github_search_exa(implementations) → Technical details
3. youtube_search_exa(topic + "explained") → Educational content
4. linkedin_search_exa(experts) → Professional perspectives
```

#### Source Verification
```
// Cross-reference and validate
1. crawling_exa(authoritative_urls) → Primary sources
2. research_paper_search_exa(citations) → Verify claims
3. web_search_exa(fact_check + claim) → Validation
```

## Advanced Workflow Patterns

### Pattern 1: Academic Research
For scholarly topics requiring rigorous sourcing:

```
Workflow:
1. Start with research_paper_search_exa (5-10 papers)
2. Extract key authors and institutions
3. Use linkedin_search_exa to find current work
4. Use github_search_exa for implementations
5. Synthesize theoretical and practical insights
```

### Pattern 2: Current Events Analysis
For rapidly evolving topics:

```
Workflow:
1. web_search_exa with time constraints
2. reddit_search_exa for community reactions
3. youtube_search_exa for video coverage
4. TikTok search (tiktok_search_exa) for viral perspectives
5. Create timeline and sentiment analysis
```

### Pattern 3: Technical Deep Dive
For technology and implementation topics:

```
Workflow:
1. github_search_exa for repositories
2. research_paper_search_exa for theory
3. reddit_search_exa for developer discussions
4. youtube_search_exa for tutorials
5. Create technical assessment report
```

### Pattern 4: Business Intelligence
For company and market research:

```
Workflow:
1. company_research_exa for target companies
2. competitor_finder_exa for market landscape
3. linkedin_search_exa for leadership insights
4. reddit_search_exa for customer sentiment
5. Generate competitive analysis
```

## Configuration Options

### Research Depth Parameters
- **Budget**: Number of research iterations (default: 6)
- **Max Queries**: Queries per iteration (default: unlimited)
- **Max Sources**: Final sources to include (default: unlimited)
- **Timeout**: User interaction timeout (default: 30s)

### Quality Controls
- **Remove Thinking Tags**: Clean internal reasoning from output
- **Interactive Mode**: Enable user feedback loops
- **Debug Output**: Stream intermediate reasoning in the response for inspection

## Citation Best Practices

### Evidence Tracking Throughout Research
1. **Assign Evidence IDs Early**: As soon as you process a source, assign it an EV-XXX ID
2. **Consistent Format**: Use [EV-001], [EV-002] format for easy scanning
3. **Multiple Citations**: Use [EV-001, EV-003] when multiple sources support a claim
4. **Confidence Indicators**: Note when evidence is strong (multiple sources) vs. single-source
5. **Tool Attribution**: Always note which MCP tool provided the source

### Citation Format Examples
```
Strong claim with multiple sources: "AI adoption in healthcare has increased 300% since 2020 [EV-001, EV-004, EV-007]"
Single source claim: "The specific implementation uses transformer architecture [EV-012]"
Contradictory evidence: "While some sources report 50% efficiency gains [EV-003], others suggest only 20% [EV-008]"
```

### Evidence Quality Markers
Tag each source: Primary • Peer-reviewed • News • Community • Technical

## Best Practices (concise)
• Craft 5 diverse queries → broad + angles + time.
• Mix sources (academic, news, community, technical).
• Iterate until gaps closed or budget hits.
• Cite every claim with [EV-XXX].
## Example Prompt

```
Conduct deep research on "quantum computing applications in cryptography" 
using the Exa MCP tools. Provide a comprehensive analysis with inline 
citations using [EV-XXX] format and a complete evidence list.
```

## Integration with Claude Code

### Using TodoWrite for Research Planning
```
1. Create research plan with stages
2. Track completion of each search phase
3. Mark iterations as complete
4. Note follow-up queries to explore
```

### Parallel Execution
```
// Execute multiple searches simultaneously
[
  web_search_exa(query1),
  research_paper_search_exa(query2),
  reddit_search_exa(query3)
]
```

### Session Memory (Run-Local)
- Maintain context only within the current run
- Track which sources have been explored during this session
- Remember user preferences from clarification for the duration of the task
- Build upon previous findings within the same research execution
- **Maintain running evidence list** with citations throughout research
- **Track evidence IDs** assigned to each source for consistent referencing
- All memory structures are automatically discarded at process termination

## Output Format
`Report: Executive summary • Key findings + [EV] tags • Evidence list`

### Research Report Structure
```markdown
# Research Report: [Topic]

## Executive Summary
[2-3 paragraph overview of key findings with [EV-XXX] markers]

## Introduction
[Context and research objectives]

## Key Findings
1. [Major finding] [EV-001, EV-003]
2. [Major finding] [EV-002, EV-004]
3. [Major finding] [EV-005]

## Detailed Analysis
### [Subtopic 1]
[In-depth exploration with inline citations [EV-XXX]]

### [Subtopic 2]
[In-depth exploration with inline citations [EV-XXX]]

## Contradictions and Debates
[Areas where sources disagree, citing specific sources]

## Conclusions
[Synthesis and implications]

## Evidence Citations
[EV-001]: "Title of Source" by Author Name. Source: web_search_exa. URL: https://... Published: Date. Confidence: 95/100 (SUPPORTED)
[EV-002]: "Academic Paper Title" by Researchers. Source: research_paper_search_exa. URL: https://... Published: Date. Confidence: 85/100 (SUPPORTED)
[EV-003]: "Wikipedia Article". Source: wikipedia_search_exa. URL: https://... Accessed: Date. Confidence: 70/100 (PARTIALLY SUPPORTED)
[...continue for all evidence]

## Methodology Note
This research synthesized [X] sources across [Y] search tools. Confidence levels: [W] high confidence (80-100), [X] medium confidence (50-79), [Y] low confidence (20-49), [Z] refuted/removed. Claims marked with † were pre-verified in Stage 5.5.
```


This workflow enables systematic, thorough research that mirrors expert human research practices while leveraging the speed and breadth of AI-powered search tools.