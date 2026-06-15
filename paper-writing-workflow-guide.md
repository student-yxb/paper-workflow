# 论文写作全流程 Skill 调用手册

> 适用于 Claude Code 学术写作工作流 | 基于 nature-skills + academic-paper + Zotero MCP + Omniscale  
> 项目目录：`${项目目录}`（通过 `args.paperPath` 传入）  
> 更新日期：2026-06-15 | 版本：v2.0

---

## 📦 依赖安装

使用本工作流前，需先安装以下 Skills 和 MCP Server：

| 依赖 | 类型 | GitHub | 安装命令 |
|------|------|--------|---------|
| **nature-skills** | Skill | [Yuan1z0825/nature-skills](https://github.com/Yuan1z0825/nature-skills) | `claude mcp add nature-skills https://github.com/Yuan1z0825/nature-skills` |
| **academic-research-skills** | Skill | [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) | `claude mcp add ars https://github.com/Imbad0202/academic-research-skills` |
| **Zotero MCP** | MCP | [54yyyu/zotero-mcp](https://github.com/54yyyu/zotero-mcp) | `claude mcp add zotero https://github.com/54yyyu/zotero-mcp` |

> **注意**：Zotero MCP 需要在本地启动 Zotero 客户端后才能使用。academic-research-skills 包含 academic-paper、academic-paper-reviewer、deep-research 等多个子 skill。

---

## 快速导航

| 阶段 | 名称 | 预计耗时 | 核心 Skill | Zotero |
|------|------|---------|-----------|--------|
| [1](#stage-1-规划与研究地图) | 规划与研究地图 | 30 min | academic-paper (plan) + research-map | — |
| [2](#stage-2-文献调研) | 文献调研 | 1-3 h | nature-academic-search + academic-paper (lit-review) + summarize-paper | 可选手动导入 |
| [3](#stage-3-写作初稿) | 写作初稿 | 2-6 h | nature-writing + nature-polishing + academic-paper (outline-only) + academic-paper (abstract-only) | — |
| [4](#stage-4-引文与数据) | 引文与数据 | 1-2 h | nature-citation + academic-paper (citation-check) + **zotero-import** + nature-data | ✅ **仅导入 VERIFIED** |
| [5](#stage-5-图表制作) | 图表制作 | 1-4 h | nature-figure (Python/R) | — |
| [6](#stage-6-审稿自查) | 审稿自查 | 30-60 min | nature-reviewer + academic-paper-reviewer + critique | — |
| [7](#stage-7-修改与回复) | 修改与回复 | 2-8 h | academic-paper (revision-coach) + academic-paper (revision) + nature-polishing + nature-response | — |
| [8](#stage-8-投稿输出) | 投稿输出 | 30 min | academic-paper (format-convert) + academic-paper (disclosure) + nature-paper2ppt | — |

---

## 两种使用方式

### 方式 A：自动化工作流（推荐）

```js
// 运行全部 8 阶段
Workflow({scriptPath: "${skill目录}/paper-workflow.js", args: {
  stage: "all",
  paperPath: "${项目目录}/论文.docx",
  paperTitle: "论文标题",
  paperTopic: "简短主题描述",
  outputDir: "${项目目录}/output",
  collectionName: "论文项目-refs",
  targetJournal: "目标期刊名",
  tags: ["主题标签1", "主题标签2"]
}})

// 仅运行引文验证+Zotero导入（Stage 4）
Workflow({scriptPath: "${skill目录}/paper-workflow.js", args: {
  stage: 4,
  paperPath: "${项目目录}/论文.docx",
  paperTitle: "论文标题",
  collectionName: "论文项目-refs"
}})

// 单独运行 Zotero 导入（已有验证结果）
Workflow({scriptPath: "${skill目录}/zotero-import.js", args: {
  verificationReportPath: "${项目目录}/citation-verification-report.md",
  collectionName: "论文项目-refs",
  paperTitle: "论文标题",
  tags: ["主题标签"]
}})
```

### 方式 B：手动逐阶段执行

下面的每个阶段都列出了可以直接使用的 Skill 调用方式。

---

## Stage 1: 规划与研究地图

### 目标
明确论文核心论点、目标期刊、章节结构，创建研究项目全景图。

### 调用方式

**步骤 1.1 — Socratic 规划对话**
```
Skill: academic-paper
```
直接说："引导我规划论文"（自动进入 plan mode）

AI 会逐一询问：
1. 核心论点
2. 目标期刊
3. 论文类型
4. 章节结构
5. 每章关键证据
6. 已有材料清单

**步骤 1.2 — 研究地图**
```
Skill: research-map
```
或直接说："为我的论文项目创建研究地图"

### 检查清单
- [ ] 核心论点一句话能说清楚
- [ ] 目标期刊的作者指南已下载
- [ ] 章节大纲已确定
- [ ] 研究地图清晰标注了已完成/待完成项

---

## Stage 2: 文献调研

### 目标
系统检索最新相关文献，深度阅读关键论文，建立文献矩阵。

### 调用方式

**步骤 2.1 — 多库文献检索**
```
Skill: nature-academic-search
```
输入：检索关键词、数据库范围、时间范围、筛选标准

也可以用 Zotero MCP 先在本地库中搜索：
```
zotero_semantic_search → "你的研究主题"
zotero_search_items → "关键词"
```

**步骤 2.2 — 系统性文献综述**
```
Skill: academic-paper
```
直接说："做 [主题] 的系统性文献综述"（自动进入 lit-review mode）

**步骤 2.3 — 单篇精读**
```
Skill: summarize-paper
```
对关键论文逐篇提取：论点、方法、数据、可引用语句

**步骤 2.4 — 可选：导入 Zotero**
如果此时已有确认存在的文献，可手动导入：
```
zotero_create_collection → 创建"论文项目-refs"
zotero_add_by_doi → 逐篇导入（优先 DOI）
zotero_batch_update_tags → 按主题打标签
```
> ⚠️ Stage 2 的导入是**可选手动操作**。正式的"验证后导入"在 Stage 4 进行。

### 检查清单
- [ ] 文献矩阵覆盖最近 5-10 年核心论文
- [ ] 每篇关键论文有结构化笔记
- [ ] 研究缺口已明确标注
- [ ] 排除了不相关领域论文
- [ ] （可选）高优先级论文已手动导入 Zotero

---

## Stage 3: 写作初稿

### 目标
从大纲/草稿到完整初稿，包含摘要、各章节、参考文献。

### 调用方式

**步骤 3.1 — 大纲细化**
```
Skill: academic-paper
```
直接说："为论文生成详细大纲"（进入 outline-only mode）

**步骤 3.2 — 摘要生成（双语）**
```
Skill: academic-paper
```
直接说："写双语摘要"（进入 abstract-only mode）

**步骤 3.3 — 章节写作**
```
Skill: nature-writing
```
传入：你的中文笔记/大纲 + 文献矩阵 + 图注

提示词示例：
> 请根据以下大纲撰写论文的 Discussion 部分。  
> 大纲：[粘贴大纲]  
> 文献矩阵：[粘贴关键文献笔记]  
> 要求：目标期刊风格，IMRaD 结构

**步骤 3.4 — 语言润色**
```
Skill: nature-polishing
```
传入：你的草稿段落

### 检查清单
- [ ] 所有章节已完成（不要求完美）
- [ ] Abstract 完整（背景-方法-结果-结论-展望）
- [ ] 参考文献已用 Zotero/EndNote 管理
- [ ] 图表初版已插入正文

---

## Stage 4: 引文与数据 ⭐

> 这是 v2.0 的核心改动阶段。新增：验证后仅将 VERIFIED 文献导入 Zotero。

### 目标
补充缺失引用、验证已有引文的真实性、**将确认存在的文献导入 Zotero**、撰写数据可用性声明。

### 核心流程

```
步骤 4.1 — 补充引用 (nature-citation)
    ↓
步骤 4.2 — 引文真实性验证 (academic-paper citation-check)
    ↓ 每条引用输出分类：VERIFIED / MISMATCH / NOT_FOUND
    ↓
步骤 4.3 — 筛选导入 Zotero 🆕（仅导入 VERIFIED）
    ├── VERIFIED → zotero_add_by_doi → 导入 project collection ✅
    ├── MISMATCH → 跳过，输出修正建议 ⚠️
    └── NOT_FOUND → 跳过，输出替代文献建议 ❌
    ↓
步骤 4.4 — 数据可用性声明 (nature-data)
```

### 调用方式

**步骤 4.1 — 自动配引用**
```
Skill: nature-citation
```
传入：需要支撑的段落文本
AI 返回：匹配的参考文献（EndNote/RIS 格式）

**步骤 4.2 — 引文真实性验证**
```
Skill: academic-paper
```
直接说："检查我的论文引用"（进入 citation-check mode）

AI 会通过 DOI 和标题搜索验证每条引用，输出三类：
- ✅ VERIFIED — 引用正确，可导入
- ⚠️ MISMATCH — 信息不匹配（如作者/年份/期刊有误）
- ❌ NOT_FOUND — 引用不存在，需替换

**步骤 4.3 — 导入 Zotero（仅 VERIFIED）🆕**
```
方式 A（自动）：Workflow 脚本中内置了 zotero-import agent，Stage 4 运行时会自动执行
方式 B（手动）：Workflow({scriptPath: "zotero-import.js", args: {verificationReportPath: "...", ...}})
```

**关键原则：只导入 VERIFIED 文献。MISMATCH 和 NOT_FOUND 一律不导入，保护 Zotero 库的整洁性。**

导入时自动执行：
1. `zotero_create_collection` — 为项目创建专属 collection
2. `zotero_add_by_doi` / `zotero_add_by_url` — 逐条导入 VERIFIED 文献
3. `zotero_batch_update_tags` — 打标签（`verified` + 用户指定的主题标签）
4. `zotero_find_duplicates` — 去重检查

输出报告格式：
```
✅ Imported: 150 篇
⚠️ Skipped (MISMATCH): 8 篇 + 修正建议
❌ Skipped (NOT_FOUND): 5 篇 + 替代建议
⛔ Import failed: 2 篇 + 失败原因
```

**步骤 4.4 — 数据可用性声明**
```
Skill: nature-data
```

### 检查清单
- [ ] 所有关键论断都有文献支撑
- [ ] 引文验证完成，VERIFIED/MISMATCH/NOT_FOUND 已分类
- [ ] VERIFIED 文献已导入 Zotero 项目 collection ✅ 🆕
- [ ] MISMATCH 文献已记录修正建议，待人工处理 🆕
- [ ] NOT_FOUND 文献已标记，需要替换 🆕
- [ ] Zotero collection 无重复文献 🆕
- [ ] 数据可用性声明已写好

---

## Stage 5: 图表制作

### 目标
按投稿标准制作/优化所有图表。

### 调用方式

**步骤 5.1 — 图表审计**
直接说："审计我的论文图表质量"

**步骤 5.2 — 图表制作**
```
Skill: nature-figure
```
首先选择后端（Python 或 R），然后：
- 传入数据
- 说明图表类型和要表达的结论
- 指定输出格式（SVG + PDF + TIFF）

### 检查清单
- [ ] 所有图片分辨率 ≥ 300 DPI
- [ ] 图中字号 ≥ 8pt
- [ ] 配色专业（期刊风格色板）
- [ ] 布局规整，无文字重叠
- [ ] 图注完整（标题、单位、n值、统计方法、缩写说明）
- [ ] 保存为可编辑 SVG + PDF

---

## Stage 6: 审稿自查

### 目标
从多视角模拟审稿，发现逻辑漏洞和不足之处。

### 调用方式

**步骤 6.1 — Nature 标准审稿**
```
Skill: nature-reviewer
```
获得 3 位审稿人 + 交叉综合意见

**步骤 6.2 — 强化审稿（5-reviewer + Devil's Advocate）**
```
Skill: academic-paper-reviewer
```
或直接说："审稿我的论文"

**步骤 6.3 — 逻辑漏洞检测**
```
Skill: critique
```
或直接说："critique my paper"

专门查找：
- 逻辑漏洞
- 循环论证
- 因果推断错误
- 过度宣称
- 遗漏变量

### 检查清单
- [ ] 所有审稿意见已汇总到一张表
- [ ] 意见按严重程度分类（Blocker > Major > Minor）
- [ ] 每条意见有明确的修改方案或 rebuttal 策略
- [ ] Devil's Advocate 发现的问题已特别标注

---

## Stage 7: 修改与回复

### 目标
根据审稿意见逐点修改论文，撰写 rebuttal letter。

### 调用方式

**步骤 7.1 — 解析审稿意见**
```
Skill: academic-paper
```
直接说："解析审稿意见，生成修改路线图"（进入 revision-coach mode）

**步骤 7.2 — 逐点修改**
```
Skill: academic-paper
```
直接说："根据审稿意见修改论文"（进入 revision mode）

**步骤 7.3 — 最终润色**
```
Skill: nature-polishing
```

**步骤 7.4 — 撰写 Rebuttal Letter**
```
Skill: nature-response
```
传入：审稿意见 + 你的修改说明

### 检查清单
- [ ] 每条审稿意见都有回应
- [ ] Rebuttal letter 语气专业、尊敬
- [ ] 不修改的意见有充分理由
- [ ] 最终稿完成全文拼写/语法检查

---

## Stage 8: 投稿输出

### 目标
格式转换、AI声明、答辩PPT、最终打包。

### 调用方式

**步骤 8.1 — 格式转换**
```
Skill: academic-paper
```
直接说："转换论文格式为 LaTeX/DOCX/PDF"（进入 format-convert mode）
支持：LaTeX / DOCX / PDF / Markdown

**步骤 8.2 — AI 使用声明**
```
Skill: academic-paper
```
直接说："生成 AI 使用声明"（进入 disclosure mode）
自动生成符合各期刊要求的 AI 使用声明

**步骤 8.3 — 答辩/组会 PPT**
```
Skill: nature-paper2ppt
```
或直接说："把这篇论文做成PPT"

### 检查清单
- [ ] Cover letter 已写好
- [ ] Highlights (3-5条) 已准备
- [ ] 作者贡献声明完整
- [ ] 利益冲突声明已签署
- [ ] 数据可用性声明已写
- [ ] AI 使用声明已添加
- [ ] Zotero collection 已整理完毕，可随时导出 BibTeX/EndNote 🆕
- [ ] 所有文件已打包到 submission-package 文件夹

---

## 🎯 已有草稿的推荐执行顺序

```
现在立刻可以做：
  Stage 3 (polish)   → 全文语言润色
  Stage 5 (figure)   → 重制图表
  Stage 4 (citation) → 补充引文 + 验证 + 导入 Zotero ⭐

投稿前：
  Stage 6 (review)   → 预审自查
  Stage 7 (revision) → 根据审稿意见修改

投稿时：
  Stage 8 (output)   → 格式转换 + 投稿文件包
```

---

## 📋 通用检查清单总表

| # | 检查项 | 涉及阶段 |
|---|--------|---------|
| 1 | 核心论点一句话清晰 | Stage 1 |
| 2 | 章节逻辑流畅、无跳跃 | Stage 3 |
| 3 | 所有论断有文献支撑 | Stage 4 |
| 4 | 引文已验证，VERIFIED/MISMATCH/NOT_FOUND 已分类 | Stage 4 🆕 |
| 5 | VERIFIED 文献已导入 Zotero，无重复 | Stage 4 🆕 |
| 6 | 无第一人称（视期刊要求） | Stage 3, 7 |
| 7 | 图表清晰、分辨率达标 | Stage 5 |
| 8 | 参考文献格式统一 | Stage 4 |
| 9 | 引文真实性已验证 | Stage 4 |
| 10 | 无语法/拼写错误 | Stage 7 |
| 11 | 摘要完整（背景-方法-结果-结论） | Stage 3 |
| 12 | Cover letter 已准备 | Stage 8 |
| 13 | AI 使用声明已添加 | Stage 8 |
| 14 | Zotero collection 整理完毕 | Stage 8 🆕 |
| 15 | 所有补充材料已打包 | Stage 8 |

---

## 🔧 故障排除

| 问题 | 解决方案 |
|------|---------|
| academic-paper skill 无响应 | 检查 skill 是否已安装：`ls .claude/skills/academic-paper/` |
| nature-figure 报字体缺失 | 使用系统可用字体（如 Microsoft YaHei / SimSun） |
| 引文验证大量 NOT_FOUND | 检查 DOI 格式，或手动在 Semantic Scholar 验证 |
| Workflow 脚本报错 | 确保参数使用双反斜杠 `\\`，确保 `paperPath` 文件存在 |
| Zotero MCP 工具无响应 | 确认 Zotero 客户端已启动，MCP server 已连接 |
| zotero_add_by_doi 导入失败 | 检查 DOI 格式（需以 `10.` 开头），尝试用 zotero_add_by_url |
| Git 无法连接 GitHub | 已配置 Clash 代理：`git config --global http.proxy http://127.0.0.1:7890` |
| Zotero 导入后出现大量重复 | 使用 zotero_find_duplicates + zotero_merge_duplicates 手动合并 |

---

## 📁 Skill 文件结构

```
.claude/skills/paper-workflow/
├── SKILL.md                          ← Skill 定义（英文）
├── paper-workflow.js                 ← 通用 8 阶段工作流脚本（参数化）
├── zotero-import.js                  ← Zotero 导入脚本（仅导入 VERIFIED）🆕
├── paper-writing-workflow-guide.md   ← 本手册（中文）
├── tbm-paper-workflow.js             ← 项目实例：TBM-ML 综述
├── verify-citations.js               ← 独立引文验证脚本
├── paper-writing-skill-workflow.png  ← 流程图
├── paper-writing-skill-workflow.svg  ← SVG 流程图
└── paper-writing-skill-workflow.pdf  ← PDF 流程图
```
