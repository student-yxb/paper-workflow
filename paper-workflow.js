export const meta = {
  name: 'paper-writing-workflow',
  description: '模块化论文写作全流程：从规划到投稿，8阶段可独立调用。组合 nature-skills + academic-paper + Zotero MCP + Omniscale',
  phases: [
    { title: 'Stage 1: 规划与研究地图', detail: 'academic-paper (plan) + Omniscale research-map' },
    { title: 'Stage 2: 文献调研', detail: 'nature-academic-search + deep-research + summarize-paper' },
    { title: 'Stage 3: 写作初稿', detail: 'nature-writing + academic-paper (outline-only) + nature-polishing + academic-paper (abstract-only)' },
    { title: 'Stage 4: 引文与数据', detail: 'nature-citation + academic-paper (citation-check) + Zotero import (VERIFIED only) + nature-data' },
    { title: 'Stage 5: 图表制作', detail: 'nature-figure (Python/R)' },
    { title: 'Stage 6: 审稿自查', detail: 'nature-reviewer + academic-paper-reviewer + critique' },
    { title: 'Stage 7: 修改与回复', detail: 'academic-paper (revision-coach) + academic-paper (revision) + nature-polishing + nature-response' },
    { title: 'Stage 8: 投稿输出', detail: 'academic-paper (format-convert) + academic-paper (disclosure) + nature-paper2ppt' },
  ],
}

// ================================================================
// 论文写作全流程工作流 — 通用模板版 (v2.0)
//
// 用法:
//   全流程: Workflow({scriptPath, args: {stage: "all", paperPath: "...", paperTitle: "...", ...}})
//   单阶段: Workflow({scriptPath, args: {stage: 3, paperPath: "...", paperTitle: "...", ...}})
//
// 参数:
//   stage           — 1-8 或 "all"（必填）
//   paperPath       — 论文文件路径（.docx/.md/.tex，Stage 2-8 需要）
//   paperTitle      — 论文标题（用于 agent prompt 上下文）
//   outputDir       — 输出目录（默认同论文目录）
//   collectionName  — Zotero collection 名称（Stage 4 需要，默认 "paper-refs"）
//   tags            — Zotero 标签列表（Stage 4，默认 []）
//   paperTopic      — 论文主题简短描述（用于 agent prompt，如 "海藻提取物文献计量分析"）
//   targetJournal   — 目标期刊（默认 "待确定"）
//   paperType       — 论文类型（如 "文献计量学综述" / "原创研究"）
//
// 设计原则:
//   - Human-in-the-loop: 每阶段结束需人工确认
//   - 通用参数化: 所有项目相关内容通过 args 传入
//   - VERIFIED-only Zotero: Stage 4 只导入验证通过的文献
// ================================================================

// ---- 参数提取 ----
const PAPER_PATH = args?.paperPath || ''
const PAPER_TITLE = args?.paperTitle || args?.paperTopic || '（请提供论文标题）'
const OUTPUT_DIR = args?.outputDir || (PAPER_PATH ? PAPER_PATH.replace(/\\[^\\]+$/, '') : '')
const COLLECTION_NAME = args?.collectionName || 'paper-refs'
const TAGS = args?.tags || []
const PAPER_TOPIC = args?.paperTopic || PAPER_TITLE
const TARGET_JOURNAL = args?.targetJournal || '待确定'
const PAPER_TYPE = args?.paperType || '学术论文'

// 参数校验（非阻塞，仅提示）
if (!PAPER_PATH && args?.stage >= 2 && args?.stage !== 'all') {
  log('⚠️  未提供 paperPath 参数，部分 agent 可能无法读取论文文件')
  log('   建议: Workflow({scriptPath, args: {stage: X, paperPath: "D:\\\\path\\\\to\\\\paper.docx", ...}})')
}

// ================================================================
// 8 阶段定义
// ================================================================

const STAGES = {
  1: {
    name: '规划与研究地图',
    description: '明确论文核心论点，生成章节大纲，创建研究项目全景图',
    agents: [
      {
        label: 'plan-paper',
        prompt: `你是一位学术写作导师。请以苏格拉底式对话引导我规划论文。

请逐一询问并帮我明确以下内容：
1. 论文的核心论点（one-sentence claim）
2. 目标期刊和读者群
3. 论文类型（${PAPER_TYPE}）
4. 章节结构（IMRaD 或其他）
5. 每章需要的关键证据/数据
6. 已有材料清单（数据、图表、草稿）

对每个问题，先听我的回答，再给出针对性建议。最后输出一份结构化的论文大纲。

论文主题：${PAPER_TOPIC}
目标期刊：${TARGET_JOURNAL}`,
        phase: 'Stage 1: 规划与研究地图',
      },
      {
        label: 'research-map',
        prompt: `为以下研究项目创建一份全景地图（research map），包括：
- 核心研究问题层级树
- 已完成 vs 待完成的任务清单
- 关键依赖关系（如"文献综述完成 → 方法部分可写"）
- 风险点与缓解策略
- 建议的时间线

项目：${PAPER_TOPIC}
目标期刊：${TARGET_JOURNAL}
论文类型：${PAPER_TYPE}

请输出结构化的研究全景图，清晰标注已完成/待完成项。`,
        phase: 'Stage 1: 规划与研究地图',
      },
    ],
    checkpoint: '确认论文大纲和研究地图满意后，进入 Stage 2',
  },

  2: {
    name: '文献调研',
    description: '系统检索文献、深度阅读关键论文、建立文献矩阵',
    agents: [
      {
        label: 'lit-search',
        prompt: `为以下论文主题执行系统文献检索：

论文：${PAPER_TITLE}
主题：${PAPER_TOPIC}
目标期刊：${TARGET_JOURNAL}

检索要求：
1. 使用 Zotero MCP (zotero_search_items, zotero_semantic_search) 在本地库中搜索已有文献
2. 使用 WebSearch 在 Web of Science / PubMed / Scopus 中检索最新文献
3. 重点关注近 5 年高影响力论文
4. 排除不相关领域的论文
5. 输出文献矩阵（作者、年份、期刊、核心发现、方法、与本研究相关性评分 1-5）

提示：
- 可以先用 zotero_semantic_search 快速定位相关文献
- 用 nature-academic-search skill 进行多库系统检索
- 用 deep-research skill 进行系统性文献综述和深度分析
- 用 summarize-paper skill 逐篇提取关键信息`,
        phase: 'Stage 2: 文献调研',
      },
      {
        label: 'deep-read-key',
        prompt: `对检索到的高相关性文献进行深度阅读和结构化提取。

论文主题：${PAPER_TOPIC}

请对评分 ≥ 4 的关键论文逐篇提取：
- 核心论点和方法
- 可引用的关键数据/结论（带页码或章节号）
- 与本研究的关联（支撑/对比/补充）
- 可引用的具体句子

如果论文文件在 ${PAPER_PATH} 中已有参考文献列表，请优先精读被高频引用的论文。

输出结构化的文献精读笔记。`,
        phase: 'Stage 2: 文献调研',
      },
    ],
    checkpoint: '文献矩阵和精读笔记完成后，进入 Stage 3',
  },

  3: {
    name: '写作初稿',
    description: '从大纲到完整初稿，包含摘要、各章节、参考文献',
    agents: [
      {
        label: 'write-sections',
        prompt: `请帮我撰写/润色以下论文章节。

文件路径：${PAPER_PATH}
论文标题：${PAPER_TITLE}
目标期刊：${TARGET_JOURNAL}

需要重点处理的章节：
1. Abstract — 检查逻辑流畅度，确保覆盖背景-方法-结果-结论-展望
2. Introduction — 检查文献引用是否充分，逻辑链是否完整
3. Methods — 检查方法描述是否清晰可复现
4. Results — 检查是否有超出数据范围的评估性语言
5. Discussion — 检查是否与 Results 有清晰边界，推论是否合理
6. Conclusions — 是否呼应了 Abstract 和核心论点

对每个部分输出：修改建议 + 修改后文本`,
        phase: 'Stage 3: 写作初稿',
      },
      {
        label: 'polish-language',
        prompt: `对以下论文进行全文语言润色：

文件路径：${PAPER_PATH}
目标期刊：${TARGET_JOURNAL}

润色要求：
1. 目标期刊级学术英文（如为中文期刊则润色中文学术表达）
2. 修正所有语法错误和不完整句子
3. 统一时态（Methods用过去时，Results用过去时，Discussion用现在时）
4. 消除中式英语/翻译腔
5. 确保术语一致性
6. 保持原意不变，不添加新内容
7. 输出修改对照（原文 → 修改后）`,
        phase: 'Stage 3: 写作初稿',
      },
    ],
    checkpoint: '初稿润色完成后，进入 Stage 4',
  },

  4: {
    name: '引文与数据',
    description: '补充缺失引用、验证引文真实性、VERIFIED文献导入Zotero、撰写数据声明',
    agents: [
      {
        label: 'find-citations',
        prompt: `为以下论文段落查找支撑文献。

文件路径：${PAPER_PATH}
主题：${PAPER_TOPIC}

请：
1. 读取论文，识别所有需要文献支撑但当前引用不足的论断
2. 对每处缺失引用，用 WebSearch + Zotero MCP 找到 2-3 篇合适文献
3. 输出 BibTeX 格式 + 建议插入位置
4. 优先找近 3 年高影响力论文`,
        phase: 'Stage 4: 引文与数据',
      },
      {
        label: 'verify-citations',
        prompt: `对论文现有参考文献列表进行引文真实性验证。

文件路径：${PAPER_PATH}

验证方法：
1. 提取论文中所有参考文献
2. 逐条验证：
   - 有 DOI：检查 DOI 是否可解析（格式检查 + CrossRef API 查询）
   - 无 DOI：通过标题+作者+年份在 WebSearch/Semantic Scholar 中搜索
   - 检查期刊名是否真实存在
3. 每条输出分类：
   - ✅ VERIFIED — 确认存在，信息匹配
   - ⚠️ MISMATCH — 存在但元数据不匹配（指出哪项不匹配）
   - ❌ NOT_FOUND — 无法确认存在

输出 Markdown 表格 + 分类统计。`,
        phase: 'Stage 4: 引文与数据',
      },
      {
        label: 'zotero-import',
        prompt: `你现在运行 Zotero 导入流程。请基于上一个 verify-citations 步骤的验证结果，将 VERIFIED 文献导入 Zotero。

⚠️ 关键原则：只导入 status === "VERIFIED" 的文献。MISMATCH 和 NOT_FOUND 一律跳过。

导入步骤：

**步骤 1：创建 Zotero Collection**
1. 用 zotero_get_collections 列出所有 collection
2. 用 zotero_search_collections 搜索 "${COLLECTION_NAME}"
3. 如不存在，用 zotero_create_collection 创建 "${COLLECTION_NAME}"
4. 记录 collection key

**步骤 2：筛选 VERIFIED 文献**
从上一步的验证结果中筛选所有 status === "VERIFIED" 的条目。

**步骤 3：逐条导入**
对每篇 VERIFIED 文献：
- 有 DOI → zotero_add_by_doi(doi, collections=["${COLLECTION_NAME}"], tags=${JSON.stringify([...TAGS, 'verified'])})
- 无 DOI 但有 URL → zotero_add_by_url(url, collections=["${COLLECTION_NAME}"], tags=${JSON.stringify([...TAGS, 'verified'])})
- 都没有 → 标记为 IMPORT_FAILED

**步骤 4：去重**
用 zotero_find_duplicates 检查 "${COLLECTION_NAME}" 中是否有重复。

**不要做的事情：**
- ❌ 不要导入 MISMATCH 文献（元数据不匹配）
- ❌ 不要导入 NOT_FOUND 文献（虚假引用）
- ❌ 不要自动合并重复文献

输出导入报告：
- ✅ Imported: N 篇（列出标题+DOI）
- ⚠️ Skipped MISMATCH: M 篇（列出+修正建议）
- ❌ Skipped NOT_FOUND: K 篇（列出+替代建议）
- ⛔ Import failed: P 篇（列出+原因）`,
        phase: 'Stage 4: 引文与数据',
      },
      {
        label: 'data-statement',
        prompt: `为论文撰写数据可用性声明。

文件路径：${PAPER_PATH}
目标期刊：${TARGET_JOURNAL}

用 nature-data skill 或根据期刊要求撰写：
1. 数据来源声明
2. 数据获取方式（如 WoS 检索式可通过 DOI 复现）
3. 补充材料说明
4. 受限数据说明（如有）

输出符合 ${TARGET_JOURNAL} 格式的 Data Availability Statement。`,
        phase: 'Stage 4: 引文与数据',
      },
    ],
    checkpoint: '引文验证完成 + VERIFIED 文献已导入 Zotero + 数据声明已写好，进入 Stage 5',
  },

  5: {
    name: '图表制作',
    description: '按投稿标准制作/优化所有图表',
    agents: [
      {
        label: 'figure-audit',
        prompt: `审计论文中所有图表的质量。

文件路径：${PAPER_PATH}
目标期刊：${TARGET_JOURNAL}

请对每张图/表评估：
1. 分辨率是否≥300 DPI
2. 字号是否≥8pt
3. 配色是否专业
4. 布局是否规整
5. 图注是否完整（标题、单位、缩写说明、n值、统计方法）
6. 是否为可编辑矢量格式（SVG/PDF）

输出优先级修复清单（按严重程度排序）。`,
        phase: 'Stage 5: 图表制作',
      },
      {
        label: 'remake-figures',
        prompt: `基于审计结果，用 nature-figure skill (Python 或 R) 重新制作需要修复的图表。

文件路径：${PAPER_PATH}
输出目录：${OUTPUT_DIR}\\figures\\

要求：
- ${TARGET_JOURNAL} 投稿标准
- 可编辑 SVG + PDF + 高分辨率 TIFF/PNG
- 专业配色方案
- 中/英文标注视目标期刊而定

输出图表保存到 ${OUTPUT_DIR}\\figures\\`,
        phase: 'Stage 5: 图表制作',
      },
    ],
    checkpoint: '图表重制完成后，进入 Stage 6',
  },

  6: {
    name: '审稿自查',
    description: '多视角模拟审稿，发现逻辑漏洞和不足',
    agents: [
      {
        label: 'nature-review',
        prompt: `以 ${TARGET_JOURNAL} 审稿人标准对以下论文进行模拟审稿：

文件路径：${PAPER_PATH}

请按 nature-reviewer skill 的标准流程：
1. 3 位审稿人分别侧重：技术严谨性、原创性/重要性、跨学科可读性
2. 交叉综合意见
3. 标注所有需要修改的技术缺陷

重点关注：
- 方法的规范性
- 结论是否有充分的数据支撑
- Discussion 是否与 Results 有清晰边界
- 引用是否充分且真实`,
        phase: 'Stage 6: 审稿自查',
      },
      {
        label: 'devils-advocate',
        prompt: `以魔鬼代言人身份，用 critique 模式严格审查这篇论文：

文件路径：${PAPER_PATH}

请主动寻找以下问题：
1. 逻辑漏洞：哪些结论不能从数据中合理推出？
2. 循环论证：是否有用结论证明前提的情况？
3. 因果推断错误：相关性是否被当作因果性？
4. 遗漏变量：是否有重要的混杂因素未讨论？
5. 过度宣称：哪些声明显得过于绝对？

对每个问题，给出具体位置（段落/句子）和严重程度评分（1-5）。`,
        phase: 'Stage 6: 审稿自查',
      },
    ],
    checkpoint: '审稿意见汇总后，进入 Stage 7',
  },

  7: {
    name: '修改与回复',
    description: '根据审稿意见逐点修改，撰写 rebuttal letter',
    agents: [
      {
        label: 'revision-plan',
        prompt: `根据 Stage 6 的审稿意见，制定修改路线图。

文件路径：${PAPER_PATH}

请：
1. 将所有意见按严重程度排序（Blocker > Major > Minor > Suggestion）
2. 对每条意见给出修改方案（具体到段落/句子级别）
3. 标注哪些意见可以快速解决、哪些需要深入修改
4. 建议哪些意见可以有理有据地 rebut（不修改）

输出格式：Markdown 表格`,
        phase: 'Stage 7: 修改与回复',
      },
      {
        label: 'polish-final',
        prompt: `对修改后的论文进行最终语言润色。

文件路径：${PAPER_PATH}
目标期刊：${TARGET_JOURNAL}

这是投稿前最后一次润色，请：
1. 逐句检查语法、拼写、标点
2. 确保全篇术语一致
3. 检查参考文献格式（文中引用与文末列表一一对应）
4. 检查图表引用编号是否连续正确
5. 输出最终修改对照`,
        phase: 'Stage 7: 修改与回复',
      },
    ],
    checkpoint: '修改完成 + rebuttal letter 就绪后，进入 Stage 8',
  },

  8: {
    name: '投稿输出',
    description: '格式转换、AI声明、答辩PPT、最终检查',
    agents: [
      {
        label: 'format-prep',
        prompt: `为论文准备投稿就绪文件包。

文件路径：${PAPER_PATH}
输出目录：${OUTPUT_DIR}\\submission-package\\
目标期刊：${TARGET_JOURNAL}

需要准备：
1. 目标期刊格式检查清单
2. Cover letter 草稿
3. Highlights（3-5条）
4. 作者贡献声明（CRediT 14 roles）
5. 利益冲突声明
6. 数据可用性声明
7. AI 使用声明（使用了 Claude Code 辅助写作和润色）

输出所有文件到 ${OUTPUT_DIR}\\submission-package\\`,
        phase: 'Stage 8: 投稿输出',
      },
      {
        label: 'make-slides',
        prompt: `为这篇论文制作组会/答辩 PPT。

论文：${PAPER_TITLE}
文件路径：${PAPER_PATH}

要求：
1. 15-20 页
2. 简洁专业设计
3. 包含：背景、方法、关键结果（核心图表）、讨论亮点、未来方向
4. 每页有演讲者备注
5. 输出 PPTX 格式

保存到 ${OUTPUT_DIR}\\${PAPER_TITLE.replace(/[\\/:*?"<>|]/g, '-')}-presentation.pptx`,
        phase: 'Stage 8: 投稿输出',
      },
    ],
    checkpoint: '🎉 投稿文件包完成！可以提交了。',
  },
}

// ================================================================
// 主流程
// ================================================================

const targetStage = args?.stage || 'all'

if (targetStage === 'all') {
  // 全流程：逐阶段执行
  log('=== 论文写作全流程启动 ===')
  log(`论文：${PAPER_TITLE}`)
  log(`目标期刊：${TARGET_JOURNAL}`)
  log(`输出目录：${OUTPUT_DIR}`)
  log('共 8 个阶段，每阶段完成需人工确认')
  log('')

  for (let s = 1; s <= 8; s++) {
    const stage = STAGES[s]
    phase(`Stage ${s}: ${stage.name}`)

    log(`\n📋 Stage ${s}: ${stage.name}`)
    log(`   ${stage.description}`)
    log(`   涉及：${meta.phases[s-1].detail}`)

    await parallel(
      stage.agents.map(a => () =>
        agent(a.prompt, { label: a.label, phase: `Stage ${s}: ${stage.name}` })
      )
    )

    log(`\n✅ Stage ${s} 完成`)
    log(`🔍 检查点: ${stage.checkpoint}`)

    if (s < 8) {
      log('⏸️  请人工审核后继续下一阶段')
    }
  }

  log('\n🎉 全流程完成！投稿文件包已就绪。')

} else if (typeof targetStage === 'number' || /^\d+$/.test(targetStage)) {
  // 单阶段执行
  const s = parseInt(targetStage)
  if (!STAGES[s]) {
    log(`❌ 无效的阶段编号: ${targetStage}。有效范围: 1-8，或 "all"`)
    return
  }

  const stage = STAGES[s]
  phase(`Stage ${s}: ${stage.name}`)

  log(`\n📋 Stage ${s}: ${stage.name}`)
  log(`   ${stage.description}`)
  log(`   论文：${PAPER_TITLE}`)
  if (PAPER_PATH) log(`   文件：${PAPER_PATH}`)
  log(`   涉及：${meta.phases[s-1].detail}`)

  await parallel(
    stage.agents.map(a => () =>
      agent(a.prompt, { label: a.label, phase: `Stage ${s}: ${stage.name}` })
    )
  )

  log(`\n✅ Stage ${s} 完成`)
  log(`🔍 检查点: ${stage.checkpoint}`)

} else {
  log(`❌ 无效的 stage 参数: ${targetStage}`)
  log('用法：')
  log('  全流程: Workflow({scriptPath, args: {stage: "all", paperPath: "...", paperTitle: "...", ...}})')
  log('  单阶段: Workflow({scriptPath, args: {stage: 3, paperPath: "...", paperTitle: "...", ...}})')
  log('  Zotero导入: Workflow({scriptPath: "zotero-import.js", args: {verificationResults: [...], ...}})')
}
