---
name: paper-writing-workflow
description: >
  Modular 8-stage academic paper writing workflow — from planning to submission.
  Combines nature-skills + academic-paper + Omniscale + Zotero MCP.
  Supports single-stage invocation or full pipeline automation.
  Trigger when user asks about paper writing workflow, 论文写作流程,
  academic writing pipeline, or wants to start/continue a structured paper project.
version: 2.1.0
author: yxb
license: MIT
tags:
  - academic
  - writing
  - workflow
  - paper
  - research
  - zotero
---

# Paper Writing Full-Pipeline Workflow

## Overview

This skill provides a modular 8-stage academic paper writing workflow that combines
the best capabilities of installed Claude Code skills:

- **nature-skills**: polishing, writing, citation, figures, reviewer, response, data, paper2ppt, academic-search
- **academic-paper**: 12-agent writing pipeline with 10 modes (plan, outline-only, full, revision, revision-coach, abstract-only, lit-review, format-convert, citation-check, disclosure)
- **academic-paper-reviewer**: multi-perspective peer review with 5 reviewer personas
- **Omniscale**: critique, summarize-paper, research-map
- **Zotero MCP**: zotero_add_by_doi, zotero_add_by_url, zotero_create_collection, zotero_batch_update_tags, zotero_find_duplicates, zotero_search_items, zotero_get_collections

## Prerequisites

使用前需先安装以下依赖。全部安装可获得最佳体验，也可按需只安装部分。

| 依赖 | 类型 | GitHub | 用途 |
|------|------|--------|------|
| **nature-skills** | Claude Code Skill | [Yuan1z0825/nature-skills](https://github.com/Yuan1z0825/nature-skills) | Stages 2–8：润色、写作、引文、图表、审稿、回复 |
| **academic-research-skills (ARS)** | Claude Code Skill | [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) | Stages 1–4, 7–8：规划、文献综述、写作、引文验证、格式转换、披露声明 |
| **Zotero MCP** | MCP Server | [54yyyu/zotero-mcp](https://github.com/54yyyu/zotero-mcp) | Stage 4：文献验证后导入 Zotero（核心依赖） |
| **summarize-paper** | Claude Code Skill | ✅ 已内置（`skills/summarize-paper/`） | Stage 2：单篇论文精读提取 |
| **critique** | Claude Code Skill | ✅ 已内置（`skills/critique/`） | Stage 6：逻辑漏洞检测 |
| **research-map** | Claude Code Skill | ✅ 已内置（`skills/research-map/`） | Stage 1：研究全景图 |

> **Omniscale 三件套已内置**：`critique`、`summarize-paper`、`research-map` 三个辅助 skill 已打包在本仓库的 `skills/` 目录下，安装 paper-workflow 后自动可用，无需额外安装。

### 安装命令

```bash
# 1. 安装本 Skill（含内置 Omniscale 三件套：critique + summarize-paper + research-map）
git clone https://github.com/student-yxb/paper-workflow.git ~/.claude/skills/paper-workflow

# 2. 安装 nature-skills
claude mcp add nature-skills https://github.com/Yuan1z0825/nature-skills

# 3. 安装 academic-research-skills (含 academic-paper + academic-paper-reviewer + deep-research 等)
claude mcp add ars https://github.com/Imbad0202/academic-research-skills

# 4. 安装 Zotero MCP（需先在本地启动 Zotero 客户端）
claude mcp add zotero https://github.com/54yyyu/zotero-mcp
```

## 8-Stage Workflow

| Stage | Name | Key Skills | Zotero |
|-------|------|-----------|--------|
| 1 | Planning & Research Map | academic-paper (plan), research-map | — |
| 2 | Literature Survey | nature-academic-search, academic-paper (lit-review), summarize-paper | Optional: manual import |
| 3 | Writing First Draft | nature-writing, academic-paper (outline-only), nature-polishing, academic-paper (abstract-only) | — |
| 4 | Citations & Data | nature-citation, academic-paper (citation-check), nature-data, **zotero-import** | ✅ **Core**: import only VERIFIED citations |
| 5 | Figures & Charts | nature-figure (Python/R) | — |
| 6 | Review & Self-Check | nature-reviewer, academic-paper-reviewer, critique | — |
| 7 | Revision & Response | academic-paper (revision-coach), academic-paper (revision), nature-polishing, nature-response | — |
| 8 | Submission Output | academic-paper (format-convert), academic-paper (disclosure), nature-paper2ppt | — |

## Usage

### Quick Start — Full Pipeline

```js
Workflow({scriptPath: "path/to/paper-workflow.js", args: {
  stage: "all",
  paperPath: "D:\\papers\\my-paper.docx",
  paperTitle: "My Research Paper Title",
  outputDir: "D:\\papers\\output",
  collectionName: "my-paper-refs"
}})
```

### Single Stage

```js
// Run only Stage 4 (citations + Zotero import)
Workflow({scriptPath: "path/to/paper-workflow.js", args: {
  stage: 4,
  paperPath: "D:\\papers\\my-paper.docx",
  paperTitle: "My Research Paper Title",
  collectionName: "my-paper-refs"
}})
```

### Zotero Import Only

```js
// Import verified citations into Zotero after a citation check
Workflow({scriptPath: "path/to/zotero-import.js", args: {
  verificationReportPath: "D:\\papers\\citation-verification-report.md",
  collectionName: "my-paper-refs",
  tags: ["my-topic"],
  paperTitle: "My Research Paper Title"
}})
```

### Manual Stage Execution

Each stage can also be run manually using the Skill calls documented in `paper-writing-workflow-guide.md`.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stage` | number or `"all"` | Yes | Stage 1–8 or `"all"` for full pipeline |
| `paperPath` | string | For stages 2–8 | Path to the paper file (.docx / .md / .tex) |
| `paperTitle` | string | Recommended | Paper title for context in agent prompts |
| `outputDir` | string | No | Output directory (defaults to paper directory) |
| `collectionName` | string | For Stage 4 | Zotero collection name for importing verified citations |
| `tags` | string[] | No | Tags to apply to imported Zotero items |

## Citation → Zotero Flow (Stage 4)

This is the key v2.0 addition. After citations are verified, only VERIFIED citations are imported into Zotero:

```
academic-paper (citation-check)
    ↓ classifies each citation
VERIFIED   → zotero_add_by_doi  → imported into collection ✅
MISMATCH   → skipped, fix suggestions output  ⚠️
NOT_FOUND  → skipped, replacement suggestions output  ❌
```

See `zotero-import.js` for the standalone import workflow.

## Design Principles

- **Human-in-the-loop**: Every stage has a checkpoint before proceeding
- **VERIFIED-only Zotero import**: Never import unverified citations — protect library integrity
- **Skill complementarity**: academic-paper excels at pipeline automation; nature-skills excel at language/figures/citations; Zotero MCP bridges to reference management
- **Flexible invocation**: Run any stage independently or the full pipeline
- **Degradation strategy**: If a required skill is missing, manual alternatives are provided

## Recommended Order for Existing Drafts

If you already have a draft:
1. Stage 3 (polishing) → fix language issues
2. Stage 5 (figures) → optimize charts
3. Stage 4 (citations + Zotero) → verify references and import to Zotero
4. Stage 6 (review) → pre-submission self-check
5. Stage 7 (revision) → address findings
6. Stage 8 (output) → format and package

## Files

- `paper-workflow.js` — Generic 8-stage workflow script (parameterized via args)
- `zotero-import.js` — Standalone VERIFIED-citation → Zotero import workflow
- `paper-writing-workflow-guide.md` — Complete Chinese user manual with slash commands and checklists
- `tbm-paper-workflow.js` — Project-specific instance (TBM-ML paper)
- `verify-citations.js` — Standalone citation verification workflow
