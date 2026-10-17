---
title: REA on a Token Diet
description: Measure and cut the tokens Reverse Engineering Anything puts in your AI agent's context, keep agents working while big binaries decompile, and see which optimizations are still open proposals.
keywords:
  - Reverse Engineering Anything
  - mcp
  - AI Agents
  - token-efficiency
authors: [adrianescutia]
image: /img/blog/rea-token-diet.png
date: 2026-10-16T00:00:00Z
---
import Head from '@docusaurus/Head';
import harnessPoster from '/img/blog/rea-token-diet.png';

<Head>
  <meta property="og:image" content={harnessPoster} />
</Head>

REA lets your AI agent reverse engineer anything, and it can produce far more evidence than any context window holds. We ran one full analysis of a 4 MB JavaScript folder and got 189 MB of evidence, about 45 million tokens by REA's own counter. This guide shows how to cut that by orders of magnitude with features REA already ships, how to handle big native binaries without leaving your agent stuck waiting, and which ideas are still proposals.

{/* truncate */}

<MediaEmbed url="https://youtu.be/egVWmJln7jg?autoplay=1" />

## Three different costs

- **Tokens**: everything the model reads, including big tool results, repeated calls, errors, and retries.
- **Latency**: the time an engine such as Ghidra needs to import and analyze a binary.
- **Reasoning**: the model deciding small steps that ordinary software could handle.

Waiting for Ghidra doesn't burn tokens by itself. Polling, giant replies, and repeated analyses do.

## Measure first

Every REA command accepts `--token-count`, which prints the size of the output instead of the output itself. The token count is REA's CLI counter, not your provider's bill. Your real cost also depends on the client, caching, and the number of turns.

All measurements below use REA 6.5.0 on the open-source LibreChat `api/` folder (470 JavaScript files). The repo's `token-diet-bench.sh` reproduces them on any project.

| What | Result |
| --- | --- |
| Full `analyze-javascript-application` | 74 s · 189 MB · ≈ 44,909,971 tokens |
| Summary view of the same evidence | 10,485 bytes · 2,344 tokens |
| One page (32 modules) | 2,793 tokens |
| Trace `/refresh`, `both` directions | 4,524 nodes · ≈ 4.7 M tokens · 29 s |
| Trace, `incoming` only | 11 nodes · 10,465 tokens |
| Trace, `outgoing` only | 1 node · 1,351 tokens |
| Trace summary with `--filter-output` | 60 tokens |
| `--source-path server/routes/auth.js` | 5.7 s · 8.1 MB · ≈ 1.94 M tokens |

## Levers you can use today

**Summary first.** Save the evidence once, then project a view:

```bash
rea analyze-javascript-application /path/to/app --json > evidence.json
jq -c '{source: {kind: "inline", evidence: .}, view: {kind: "summary"}}' evidence.json > view.json
rea inspect-analysis-view view.json
```

To page through modules, use `{"kind": "page", "collection": "modules", "offset": 0, "limit": 32}`.

**Filter and cap.** `--filter-output` selects key paths, `--token-limit` caps the output, and `--token-offset` reads the next slice. TOON, the default CLI format, is already compact.

**Choose the trace direction.** `trace-application-feature` accepts `outgoing`, `incoming`, or `both`. A broad bidirectional trace can pull in unrelated relationships.

**Scope, then still use views.** `--source-path` cuts analysis time, but the result can still be large. Combine it with views and filters.

**The MCP safety net.** When a result doesn't fit one MCP message, REA returns `resource_constraint` with a reference to the evidence it retained. Open that reference with `inspect_analysis_view` (summary, section, or page), or export it with `export_evidence_bundle`. For native function evidence, the error includes a ready-to-call request for the first pseudocode page. `get_evidence_bundle` with `detail: "summary"` and filters lists stored records without their payloads. Never re-run an analysis only because the reply was too big.

## Big native binaries

**Cold start.** The first Ghidra-backed query imports and auto-analyzes the target. REA allows 330 s by default (`REA_GHIDRA_STARTUP_TIMEOUT_MS`). Your client may still give up sooner; the pinned SDK defaults to 60 s per call. Send a progress token, since REA reports a waiting notification every 10 s, and either set `resetTimeoutOnProgress` or use a longer deadline. REA's setup writes 450 s for Codex and Kimi.

**Snapshots.** Add `--snapshot /path/program.json` to the CLI, or `snapshot_path` to `open_binary` / `close_binary` over MCP. An exact repeat of a query is usually answered before any engine starts. The match must be exact (bytes, operation, parameters, provider, settings), and snapshots store results, not Ghidra's database.

**Keep working while it decompiles (Kuna).** With `REA_KUNA_COMMAND`, REA starts a whole-program export in the background, answers individual functions right away from single-function runs, and caches the export by target hash, Kuna hash, version, and job count. Agents can search the exported `.c` and `.asm` files directly. Kuna supports ELF and thin Mach-O, not Windows. Single-function answers can differ from the later export.

**Tune Ghidra.** Use `REA_GHIDRA_DISABLED_ANALYZERS` when one analyzer stalls, `REA_GHIDRA_SEED_FILE` for code that analysis can't reach, and `GHIDRA_HEADLESS_MAXMEM` for heap size. The analysis profile records each override.

**Ask small native questions.** Work your way up from search, to one function, to one decompiled body, to xrefs. Read long pseudocode page by page through `inspect_analysis_view`. The combined `analyze_function` dossier can be large.

**The tool catalog.** Your agent reads tool schemas before doing anything. `REA_MCP_INPUT_SCHEMA_PROFILE=compact` and `REA_MCP_OUTPUT_SCHEMA_PROFILE=off` shrink what the catalog advertises, while server-side validation stays in place.

## What REA's own lab found

REA's `experiments/analysis-efficiency` (issue #2016) treats agent tokens and end-to-end time as the main goals. Some findings are humbling:

- On one small Windows binary, four selected views were bigger than the complete dossier (68 KB vs 51 KB).
- In several real-agent trials, replies shrank but the model's input tokens did not reliably go down, and latency was mixed.

Measure the whole task (tokens per answered question, and time to an evidence-backed answer), not the size of one reply.

## The playbook

1. Turn the request into a checklist of questions first.
2. Reuse snapshots, retained evidence, and earlier findings. Don't repeat an identical analysis.
3. Start with the smallest useful overview.
4. Use views, pages, and filters before asking for full bodies.
5. Choose the trace direction on purpose.
6. Batch related calls around one hypothesis.
7. Give independent questions to parallel workers that return sources and gaps.
8. Keep a findings ledger with evidence IDs.

## Not implemented yet: proposals

These ideas are **not** in REA today:

- A general async job API (start → status → results). REA has progress notifications and Kuna's background export, but no general job interface.
- An engine database cache across sessions (REA's notes list it as deferred).
- Relevance-ranked retrieval within a token budget. `--token-limit` truncates; it doesn't rank.
- Lazy tool groups.
- A capability graph for reverse-engineered software.

Projects to study (references, not REA plugins):

- [jaenster/ghidra-mcp](https://github.com/jaenster/ghidra-mcp): a headless daemon whose background import jobs return job IDs you poll; it can run Kubernetes workers.
- [bethington/ghidra-mcp](https://github.com/bethington/ghidra-mcp): lazy tool loading by default, field selection, and batch operations. It claims 93% fewer API calls; that is its own claim.
- [nrf24l01/ghidra-mcp](https://github.com/nrf24l01/ghidra-mcp): a fork of LaurieWired/GhidraMCP with a function hash index for carrying documentation across binaries.

The principle underneath: let deterministic software decompile, index, traverse, filter, and cache, and let the model form hypotheses, choose paths, and explain.

Which lever saved you the most? Visit [rebelion.la](https://rebelion.la) to see what La Rebelion Labs is building.

Go Rebels!
