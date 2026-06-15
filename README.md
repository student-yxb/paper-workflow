<!--
  paper-workflow — Modular 8-Stage Academic Paper Writing Workflow
  Version: 2.1.0 | License: MIT
  Combines: nature-skills + academic-research-skills + Zotero MCP + Omniscale
  GitHub: https://github.com/student-yxb/paper-workflow
-->

# 📝 Paper Workflow

> **模块化 8 阶段学术论文写作全流程 — 从规划到投稿，一键编排。**

[![Version](https://img.shields.io/badge/version-2.1.0-blue)](https://github.com/student-yxb/paper-workflow)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Claude%20Code-orange)](https://claude.ai/code)

Paper Workflow 是一个 **Claude Code Skill**，它将学术论文写作拆解为 8 个独立阶段，编排 20+ 个专业 Skills（nature-skills + academic-research-skills + Zotero MCP），支持全流程自动化或单阶段调用。

---

## 🎯 解决什么问题？

作为学术写作者，你可能有这些痛点：

| 痛点 | Paper Workflow 的解决方案 |
|------|--------------------------|
| "我有 20 个学术 skills，什么时候用哪个？" | **8 阶段清晰路由**，每阶段明确告诉你该调用哪个 skill |
| "引文验证完了，还要手动一条条导入 Zotero" | **Stage 4 自动导入**：验证 → 筛选 VERIFIED → 批量导入 Zotero |
| "每次写论文都要重新写 prompt" | **通用参数化模板**，换论文只需改 `args` 参数 |
| "审稿前没有系统自查" | **Stage 6 双重审稿**：nature-reviewer + academic-paper-reviewer + critique |

---

## 🏗️ 8 阶段架构

```
 Stage 1        Stage 2        Stage 3        Stage 4         Stage 5        Stage 6        Stage 7        Stage 8
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ 规划与   │  │ 文献调研 │  │ 写作初稿 │  │ 引文与数据   │  │ 图表制作 │  │ 审稿自查 │  │ 修改与   │  │ 投稿输出 │
│ 研究地图 │→│          │→│          │→│ ⭐Zotero导入 │→│          │→│          │→│ 回复     │→│          │
└──────────┘  └──────────┘  └──────────┘  └──────────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
   30 min        1-3 h         2-6 h          1-2 h           1-4 h        30-60 min      2-8 h         30 min
```

### 各阶段详情

#### Stage 1: 规划与研究地图
- **做什么**：明确核心论点、目标期刊、章节结构，创建研究项目全景图
- **技能**：`academic-paper (plan mode)` + `research-map`
- **输出**：论文大纲 + 研究全景图

#### Stage 2: 文献调研
- **做什么**：多库系统检索 → 系统性文献综述 → 关键论文精读
- **技能**：`nature-academic-search` + `deep-research` + `summarize-paper` + Zotero MCP（可选手动导入）
- **输出**：文献矩阵 + 结构化精读笔记

#### Stage 3: 写作初稿
- **做什么**：大纲细化 → 章节写作 → 双语摘要 → 语言润色
- **技能**：`nature-writing` + `academic-paper (outline-only mode)` + `nature-polishing` + `academic-paper (abstract-only mode)`
- **输出**：完整初稿 + 双语摘要

#### Stage 4: 引文与数据 ⭐ (v2.0 核心)
- **做什么**：补充缺失引用 → 逐条验证真实性 → **仅将 VERIFIED 文献导入 Zotero** → 撰写数据声明
- **技能**：`nature-citation` + `academic-paper (citation-check mode)` + **`zotero-import.js`** + `nature-data`
- **输出**：验证报告 + Zotero 导入报告 + 数据可用性声明

#### Stage 5: 图表制作
- **做什么**：图表质量审计 → 按期刊标准重制
- **技能**：`nature-figure` (Python seaborn/matplotlib 或 R ggplot2)
- **输出**：300 DPI 矢量图表（SVG + PDF + TIFF）

#### Stage 6: 审稿自查
- **做什么**：Nature 审稿人模拟 + 5-reviewer 面板 + 逻辑漏洞检测
- **技能**：`nature-reviewer` + `academic-paper-reviewer` + `critique`
- **输出**：审稿意见汇总表（按严重程度排序）

#### Stage 7: 修改与回复
- **做什么**：解析审稿意见 → 逐点修改 → 最终润色 → 撰写 rebuttal letter
- **技能**：`academic-paper (revision-coach mode)` + `academic-paper (revision mode)` + `nature-polishing` + `nature-response`
- **输出**：修改后论文 + rebuttal letter

#### Stage 8: 投稿输出
- **做什么**：格式转换 → AI 声明 → 答辩 PPT → 最终打包
- **技能**：`academic-paper (format-convert mode)` + `academic-paper (disclosure mode)` + `nature-paper2ppt`
- **输出**：`submission-package/` 完整投稿文件包

---

## 📦 依赖与安装

### 前置依赖

| 依赖 | 类型 | 必需？ | GitHub | 覆盖阶段 |
|------|------|--------|--------|---------|
| **nature-skills** | Skill | 推荐 | [Yuan1z0825/nature-skills](https://github.com/Yuan1z0825/nature-skills) | Stage 2–8 |
| **academic-research-skills** | Skill | 推荐 | [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) | Stage 1–4, 7–8 |
| **Zotero MCP** | MCP Server | Stage 4 必需 | [54yyyu/zotero-mcp](https://github.com/54yyyu/zotero-mcp) | Stage 4 |
| **Omniscale 三件套** | Skill | ✅ 已内置 | `skills/critique/` `skills/summarize-paper/` `skills/research-map/` | Stage 1, 2, 6 |

> **降级策略**：即使未安装上述任一外部 Skill，工作流仍可通过通用 agent 正常运行。安装对应 Skill 后，agent 在该领域表现更专业。
> 
> **Omniscale 三件套**（critique / summarize-paper / research-map）已打包在本仓库中，安装 paper-workflow 后自动可用。

### 安装步骤

```bash
# 1. 安装本 Skill（内置 Omniscale 三件套：critique + summarize-paper + research-map）
git clone https://github.com/student-yxb/paper-workflow.git ~/.claude/skills/paper-workflow

# 2. 安装 nature-skills
git clone https://github.com/Yuan1z0825/nature-skills.git ~/.claude/skills/nature-skills

# 3. 安装 academic-research-skills
git clone https://github.com/Imbad0202/academic-research-skills.git ~/.claude/skills/academic-research-skills

# 4. 安装 Zotero MCP（需先在本地启动 Zotero 客户端）
# 在 Claude Code 中配置 mcp.json，添加 zotero-mcp server
```

---

## 🚀 快速开始

### 全流程自动化

```js
// 在 Claude Code 中运行
Workflow({scriptPath: "~/.claude/skills/paper-workflow/paper-workflow.js", args: {
  stage: "all",
  paperPath: "/path/to/your-paper.docx",
  paperTitle: "Your Research Paper Title",
  paperTopic: "简短主题描述",
  outputDir: "/path/to/output",
  collectionName: "your-paper-refs",
  targetJournal: "Nature / Frontiers in Plant Science",
  paperType: "文献综述",
  tags: ["your-topic-tag"]
}})
```

### 单阶段调用

```js
// 仅做引文验证 + Zotero 导入
Workflow({scriptPath: "~/.claude/skills/paper-workflow/paper-workflow.js", args: {
  stage: 4,
  paperPath: "/path/to/your-paper.docx",
  paperTitle: "Your Research Paper Title",
  collectionName: "your-paper-refs"
}})

// 仅做审稿自查
Workflow({scriptPath: "~/.claude/skills/paper-workflow/paper-workflow.js", args: {
  stage: 6,
  paperPath: "/path/to/your-paper.docx"
}})
```

### 仅 Zotero 导入（已有验证结果）

```js
Workflow({scriptPath: "~/.claude/skills/paper-workflow/zotero-import.js", args: {
  verificationReportPath: "/path/to/citation-verification-report.md",
  collectionName: "your-paper-refs",
  paperTitle: "Your Research Paper Title",
  tags: ["your-topic"]
}})
```

---

## 📋 参数参考

### `paper-workflow.js`

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `stage` | `number` \| `"all"` | ✅ | — | 运行阶段：1-8 或 `"all"` |
| `paperPath` | `string` | Stage 2–8 | — | 论文文件路径（.docx / .md / .tex） |
| `paperTitle` | `string` | 推荐 | — | 论文标题，用于 agent prompt 上下文 |
| `paperTopic` | `string` | 推荐 | `paperTitle` | 论文主题简短描述 |
| `outputDir` | `string` | 否 | 论文同目录 | 输出文件目录 |
| `collectionName` | `string` | Stage 4 | `"paper-refs"` | Zotero collection 名称 |
| `targetJournal` | `string` | 否 | `"待确定"` | 目标期刊名 |
| `paperType` | `string` | 否 | `"学术论文"` | 论文类型（综述/原创研究/案例研究等） |
| `tags` | `string[]` | 否 | `[]` | Zotero 文献标签 |

### `zotero-import.js`

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `verificationResults` | `object[]` | 二选一 | — | 引文验证结果 JSON 数组 |
| `verificationReportPath` | `string` | 二选一 | — | 引文验证报告文件路径 |
| `collectionName` | `string` | ✅ | `"paper-refs"` | 目标 Zotero collection |
| `tags` | `string[]` | 否 | `[]` | 导入文献的标签 |
| `paperTitle` | `string` | 否 | — | 论文标题（用于报告） |

---

## ⭐ 核心特性：VERIFIED-only Zotero 导入

v2.0 的关键创新。Stage 4 的引文验证后，**不是全部导入，而是按验证状态分流处理**：

```
academic-paper (citation-check)
    │
    ↓ 逐条验证每条引用
    │
    ├── status === "VERIFIED"  ──→ ✅ zotero_add_by_doi  ──→ 导入 Zotero collection
    │                                                       + 打标签 + 去重
    │
    ├── status === "MISMATCH"  ──→ ⚠️ 跳过不导入
    │                              输出：修正建议（如作者名/年份/期刊名修正）
    │                              → 人工修正后手动导入
    │
    └── status === "NOT_FOUND" ──→ ❌ 跳过不导入
                                   输出：替代文献建议
                                   → 人工查找替代文献后替换
```

### 为什么这样设计？

| ❌ 如果全部导入 | ✅ VERIFIED-only |
|---------------|-----------------|
| 虚假引用污染 Zotero 库 | 库中每篇文献都确认存在 |
| 元数据错误难以发现 | MISMATCH 被标记，可逐一修正 |
| 后期引用错误追溯到源头难 | 导入即正确，引用无忧 |

### 导入报告示例

```
✅ Imported:       150 篇  (已导入 Zotero)
⚠️  Skipped (MISMATCH):   8 篇  (信息不匹配，需修正)
❌  Skipped (NOT_FOUND):  5 篇  (引用不存在，需替换)
⛔  Import failed:        2 篇  (DOI 解析失败)
```

---

## 📁 仓库文件结构

```
paper-workflow/
├── README.md                          ← 本文件
├── SKILL.md                           ← Skill 定义（给 Claude Code 的入口指令）
├── paper-workflow.js                  ← 通用 8 阶段 Workflow 脚本（参数化模板）
├── zotero-import.js                   ← Zotero 独立导入脚本（仅导入 VERIFIED）🆕
├── paper-writing-workflow-guide.md    ← 完整中文使用手册（逐阶段详解）
├── verify-citations.js                ← 独立引文验证脚本
├── tbm-paper-workflow.js              ← 项目实例：TBM-ML 地层识别综述
├── skills/                            ← 🆕 内置 Omniscale 辅助 skill
│   ├── critique/SKILL.md              ← 形式逻辑魔鬼代言人（Stage 6）
│   ├── summarize-paper/SKILL.md       ← 论文结构化精读（Stage 2）
│   └── research-map/SKILL.md          ← 研究项目全景图（Stage 1）
├── plugin.json                        ← 插件注册信息
└── .gitignore
```

| 文件 | 角色 | 可独立运行？ |
|------|------|------------|
| `SKILL.md` | Skill 注册入口 | ❌（被 Claude Code 自动加载） |
| `paper-workflow.js` | 全流程编排器 | ✅ |
| `zotero-import.js` | Zotero 导入专用 | ✅ |
| `verify-citations.js` | 引文验证专用 | ✅ |
| `paper-writing-workflow-guide.md` | 人类阅读手册 | ❌ |
| `tbm-paper-workflow.js` | 参考实例 | ✅（修改参数后） |
| `skills/critique/SKILL.md` | 逻辑漏洞检测 skill | ❌（通过 `/critique` 调用） |
| `skills/summarize-paper/SKILL.md` | 论文精读 skill | ❌（通过 `/summarize-paper` 调用） |
| `skills/research-map/SKILL.md` | 研究全景图 skill | ❌（通过 `/research-map` 调用） |

---

## 🔄 典型工作流场景

### 场景 1：从零开始写新论文

```
Stage 1 (规划) → Stage 2 (文献) → Stage 3 (初稿) → Stage 4 (引文+Zotero)
→ Stage 5 (图表) → Stage 6 (审稿) → Stage 7 (修改) → Stage 8 (输出)
```

### 场景 2：已有草稿，投稿前打磨

```
Stage 3 (润色) → Stage 5 (图表) → Stage 4 (引文+Zotero)
→ Stage 6 (审稿自查) → Stage 7 (修改) → Stage 8 (输出)
```

### 场景 3：收到审稿意见，需要修改

```
Stage 7 (修改+回复) → Stage 4 (重新验证引用) → Stage 8 (重新输出)
```

### 场景 4：只想整理参考文献

```
Stage 4 单独运行 → 引文验证 → Zotero 导入 → 获得整洁的 Zotero collection
```

---

---

## 🧰 内置 Omniscale 辅助 Skills（v2.1 新增）

Paper Workflow v2.1 将以下三个辅助 skill 打包在 `skills/` 目录中，**安装 paper-workflow 后自动可用，无需额外安装**：

### 1. `critique` — 形式逻辑魔鬼代言人

用于 **Stage 6（审稿自查）**，系统性检测论文中的逻辑漏洞。

| 属性 | 说明 |
|------|------|
| **功能** | 逻辑漏洞 / 数据泄漏 / 循环论证 / 统计谬误 / 代码审查 / 新颖性检查 |
| **模型** | Sonnet（子 agent 按需使用 Opus） |
| **Profiles** | `scan`(1-2min) / `review`(7-10min) / `audit`(18-25min) / `code`(5-8min) |
| **用法** | `/critique paper.md --profile=review` |

**7 大检查维度：**

| 维度 | 检查内容 |
|------|---------|
| `deterministic` | AST 检查、修辞模式、Benford 定律、声明提取 |
| `logic` | 循环推理、不可证伪声明、隐藏假设、确认偏误 |
| `methodology` | 数据泄漏、消融有效性、统计问题、跨模型有效性 |
| `code-review` | 完整代码库审查、跨实验血缘分析 |
| `novelty` | arXiv 先前研究检索、Zotero 引用交叉验证 |
| `rhetoric` | 空洞声明、声明升级、数字溯源、框架分析 |
| `formal` | 证明正确性、符号一致性、算法伪代码、图文一致性 |

### 2. `summarize-paper` — 论文结构化精读

用于 **Stage 2（文献调研）**，将论文提取为结构化知识笔记。

| 属性 | 说明 |
|------|------|
| **功能** | 提取文献元数据、研究背景、方法、发现、批判评估、相关概念 |
| **模型** | Haiku（快速处理，论文分析足够） |
| **输入** | 本地 PDF/Markdown 文件 或 arXiv/DOI URL |
| **输出** | YAML 元数据 + 结构化 Markdown 笔记（可直接入库 Obsidian） |
| **用法** | `/summarize-paper path/to/paper.pdf` |

**输出包含：** TL;DR 摘要、文献信息、研究背景、方法论、发现与结果、批判评估、资源链接、相关概念、自动标签

### 3. `research-map` — 研究项目全景图

用于 **Stage 1（规划与研究地图）**，为研究项目生成结构化导航地图。

| 属性 | 说明 |
|------|------|
| **功能** | 生成实验依赖图、发现总结、负面结果记录、复现指南 |
| **深度** | `quick`(概览) / `standard`(标准，默认) / `deep`(含代码数据指针) |
| **输出** | `research-map.md`（支持 HTML 侧边栏导航） |
| **用法** | `/research-map ~/projects/my-project --depth=standard` |

**文档结构：** 研究论文 → 数据管理 → 实验分组 → 负面结果 → 开放问题 → 复现指南 → 术语表

---

## 🛠️ 设计原则

| 原则 | 说明 |
|------|------|
| **Human-in-the-loop** | 每阶段完成需人工确认才进入下一阶段 |
| **VERIFIED-only Zotero import** | 不导入未验证的引用，保护 Zotero 库整洁 |
| **Skill 互补** | academic-paper 擅长流程自动化，nature-skills 擅长语言/图表/引用，Zotero MCP 桥接到文献管理 |
| **灵活调用** | 任意阶段可独立运行，不依赖前后阶段 |
| **降级策略** | 缺少某个 Skill 时自动降级为通用 agent，不阻塞流程 |
| **参数化模板** | 所有项目相关内容通过 `args` 传入，零硬编码 |

---

## 🔧 故障排除

| 问题 | 解决方案 |
|------|---------|
| academic-paper skill 无响应 | 确认 skill 已安装：`ls ~/.claude/skills/academic-paper/` |
| nature-figure 报字体缺失 | 安装系统可用中文字体（Microsoft YaHei / SimSun / Noto Sans CJK） |
| 引文验证大量 NOT_FOUND | 检查 DOI 格式，手动在 [Semantic Scholar](https://www.semanticscholar.org/) 验证 |
| Zotero MCP 工具无响应 | 确认 Zotero 客户端已启动，MCP server 在 `mcp.json` 中已配置 |
| `zotero_add_by_doi` 导入失败 | 检查 DOI 格式（需以 `10.` 开头），尝试改用 `zotero_add_by_url` |
| Workflow 脚本报错 | 确保路径使用正确的分隔符（Windows: `\\`，macOS/Linux: `/`） |
| Zotero 导入后出现重复 | 运行 `zotero_find_duplicates` → 手动合并 `zotero_merge_duplicates` |

---

## 📖 进一步阅读

- **[完整中文手册](paper-writing-workflow-guide.md)** — 每个阶段的详细操作步骤、Slash Command 调用方式、检查清单
- **[SKILL.md](SKILL.md)** — Skill 定义和技术规格
- **[tbm-paper-workflow.js](tbm-paper-workflow.js)** — 真实项目实例（TBM 掘进地层识别综述），展示如何为特定论文定制工作流

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

常见贡献方式：
- 报告 Bug 或使用体验问题
- 为你的论文类型提供工作流实例（如 `xxx-paper-workflow.js`）
- 改进某个 Stage 的 agent prompt
- 补充新的 Zotero 集成功能

---

## 📄 许可证

[MIT](LICENSE) © 2026 yxb

---

## 🔗 相关项目

| 项目 | 说明 |
|------|------|
| [nature-skills](https://github.com/Yuan1z0825/nature-skills) | Nature 期刊级写作/润色/图表/引文/审稿 skill 套件 |
| [academic-research-skills](https://github.com/Imbad0202/academic-research-skills) | 12-agent 学术论文写作 + 审稿 + 深度研究 skill 套件 |
| [zotero-mcp](https://github.com/54yyyu/zotero-mcp) | Zotero MCP Server — Claude Code 与 Zotero 的桥梁 |
| **Omniscale 三件套**（已内置） | critique（逻辑审查）+ summarize-paper（论文精读）+ research-map（研究全景图）— 见 `skills/` 目录 |
