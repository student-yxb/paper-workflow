export const meta = {
  name: 'tbm-paper-workflow',
  description: '基于机器学习的TBM掘进地层识别综述论文 - 8阶段全流程工作流',
  phases: [
    { title: 'Stage 1: 规划与研究地图', detail: '论文结构优化、研究范围确认' },
    { title: 'Stage 2: 文献调研', detail: '补充真实文献、建立文献矩阵' },
    { title: 'Stage 3: 写作润色', detail: '逐章节语言润色、逻辑优化' },
    { title: 'Stage 4: 引文验证', detail: '逐条验证163篇参考文献真实性' },
    { title: 'Stage 5: 图表制作', detail: '设计并生成论文所需图表' },
    { title: 'Stage 6: 审稿自查', detail: '模拟审稿人严格审查' },
    { title: 'Stage 7: 修改回复', detail: '根据审稿意见修改' },
    { title: 'Stage 8: 投稿输出', detail: '格式转换、投稿文件包' },
  ],
}

const PAPER_PATH = 'D:\\综述-ai修改\\TBM-ML-地层识别\\基于机器学习的TBM掘进地层识别研究现状及展望.md'
const OUTPUT_DIR = 'D:\\综述-ai修改\\TBM-ML-地层识别'

// 代理配置：网络搜索和API调用需要使用代理
const PROXY_HINT = `重要：网络请求需要使用代理，端口7890。
- Bash curl 命令加 -x http://127.0.0.1:7890 参数
- WebSearch 和 WebFetch 工具会自动使用系统代理
- Zotero MCP 工具无需代理（本地运行）
- 如果 WebSearch 失败，改用 Bash curl + 代理访问 API（如 CrossRef: https://api.crossref.org/works?query=xxx）`

const STAGES = {
  1: {
    name: '规划与研究地图',
    description: '审视论文整体结构，优化章节安排',
    agents: [
      {
        label: 'structure-review',
        prompt: `你是一位岩石力学与工程学报的资深审稿人。请审视以下综述论文的结构：

论文路径：${PAPER_PATH}

请检查：
1. 章节结构是否合理？是否有遗漏或冗余？
2. 各章节篇幅是否均衡？
3. 逻辑链条是否完整（背景→方法→应用→挑战→展望）？
4. 是否符合岩石力学与工程学报的综述论文规范？
5. 与同类综述相比，本文的创新点在哪里？

输出具体的修改建议（按章节列出）。`,
        phase: 'Stage 1: 规划与研究地图',
      },
      {
        label: 'research-map',
        prompt: `为这篇"基于机器学习的TBM掘进地层识别研究现状及展望"综述创建研究全景图：

论文路径：${PAPER_PATH}

请分析：
1. 本文覆盖了哪些研究方向？是否有遗漏的重要方向？
2. 各方向的研究成熟度如何？（起步期/发展期/成熟期）
3. 哪些方向是当前热点？哪些是未来趋势？
4. 本文的知识图谱应该包含哪些核心节点和连接？

输出结构化的研究全景图。`,
        phase: 'Stage 1: 规划与研究地图',
      },
    ],
    checkpoint: '确认论文结构满意后，进入 Stage 2',
  },

  2: {
    name: '文献调研',
    description: '补充真实文献、建立文献矩阵',
    agents: [
      {
        label: 'lit-search',
        prompt: `你是学术文献检索专家。请为以下综述主题检索真实存在的文献：

综述题目：基于机器学习的TBM掘进地层识别研究现状及展望

${PROXY_HINT}

检索要求：
1. 使用 Zotero MCP 工具搜索已有文献（本地，无需代理）
2. 用 WebSearch 搜索以下关键词组合：
   - "TBM" "machine learning" "rock classification"
   - "tunnel boring machine" "deep learning" "geological prediction"
   - "shield TBM" "stratum identification" "neural network"
   - "TBM掘进参数" "机器学习" "地层识别"
   - "TBM围岩分级" "深度学习"
3. 如果 WebSearch 失败，用 Bash curl 通过代理访问 CrossRef API：
   curl -x http://127.0.0.1:7890 -sL "https://api.crossref.org/works?query=TBM+machine+learning+rock+classification&rows=20"
4. 每个方向找到 5-10 篇高引论文
5. 输出文献列表：作者、年份、标题、期刊、DOI、引用数
6. 重点标注哪些文献可以替换论文中现有的虚假引用`,
        phase: 'Stage 2: 文献调研',
      },
      {
        label: 'ref-matrix',
        prompt: `基于检索到的真实文献，为这篇综述建立文献矩阵：

论文路径：${PAPER_PATH}

请：
1. 将论文现有163篇引用按主题分类
2. 标注每篇引用的可信度（已验证/待验证/疑似虚假）
3. 为每个章节推荐需要补充的真实文献
4. 输出文献矩阵表格（按主题×年份排列）

目标：将虚假引用替换为真实存在的文献。`,
        phase: 'Stage 2: 文献调研',
      },
    ],
    checkpoint: '文献矩阵完成后，进入 Stage 3',
  },

  3: {
    name: '写作润色',
    description: '逐章节语言润色、逻辑优化',
    agents: [
      {
        label: 'polish-abstract',
        prompt: `对以下综述论文的摘要和引言进行语言润色：

论文路径：${PAPER_PATH}

润色要求：
1. 岩石力学与工程学报的学术中文风格
2. 修正语法错误和不完整句子
3. 确保专业术语准确（如TBM、ML、CNN等）
4. 消除翻译腔和生硬表达
5. 保持原意不变
6. 输出修改对照（原文→修改后）`,
        phase: 'Stage 3: 写作润色',
      },
      {
        label: 'polish-body',
        prompt: `对以下综述论文的主体章节（2-6章）进行语言润色：

论文路径：${PAPER_PATH}

润色要求：
1. 岩石力学与工程学报的学术中文风格
2. 技术描述准确、逻辑清晰
3. 表格和公式编号规范
4. 章节之间过渡自然
5. 消除重复表达
6. 输出各章节的修改建议`,
        phase: 'Stage 3: 写作润色',
      },
    ],
    checkpoint: '润色完成后，进入 Stage 4',
  },

  4: {
    name: '引文验证',
    description: '逐条验证参考文献真实性',
    agents: [
      {
        label: 'verify-batch1',
        prompt: `你是学术文献验证专家。请验证以下论文中[1]-[40]号参考文献的真实性：

论文路径：${PAPER_PATH}

${PROXY_HINT}

验证方法：
1. 用 Zotero 搜索每篇文献的标题（本地，无需代理）
2. 用 WebSearch 搜索 "作者名 标题 期刊名"
3. 如果 WebSearch 失败，用 Bash curl 通过代理访问 CrossRef API 验证：
   curl -x http://127.0.0.1:7890 -sL "https://api.crossref.org/works?query=作者名+标题&rows=5"
4. 检查 DOI 是否可访问
5. 检查期刊名是否真实存在

对于每篇文献，输出：
- 序号
- 状态：VERIFIED（确认存在）/ MISSING（确认不存在）/ UNCERTAIN（无法确定）
- 理由
- 如缺失，建议的替代文献

输出为Markdown表格。`,
        phase: 'Stage 4: 引文验证',
      },
      {
        label: 'verify-batch2',
        prompt: `你是学术文献验证专家。请验证以下论文中[41]-[80]号参考文献的真实性：

论文路径：${PAPER_PATH}

${PROXY_HINT}

验证方法：
1. 用 Zotero 搜索每篇文献的标题（本地，无需代理）
2. 用 WebSearch 搜索 "作者名 标题 期刊名"
3. 如果 WebSearch 失败，用 Bash curl 通过代理访问 CrossRef API 验证
4. 检查 DOI 是否可访问
5. 检查期刊名是否真实存在

对于每篇文献，输出：
- 序号
- 状态：VERIFIED / MISSING / UNCERTAIN
- 理由
- 如缺失，建议的替代文献

输出为Markdown表格。`,
        phase: 'Stage 4: 引文验证',
      },
      {
        label: 'verify-batch3',
        prompt: `你是学术文献验证专家。请验证以下论文中[81]-[120]号参考文献的真实性：

论文路径：${PAPER_PATH}

${PROXY_HINT}

验证方法：
1. 用 Zotero 搜索每篇文献的标题（本地，无需代理）
2. 用 WebSearch 搜索 "作者名 标题 期刊名"
3. 如果 WebSearch 失败，用 Bash curl 通过代理访问 CrossRef API 验证
4. 检查 DOI 是否可访问
5. 检查期刊名是否真实存在

对于每篇文献，输出：
- 序号
- 状态：VERIFIED / MISSING / UNCERTAIN
- 理由
- 如缺失，建议的替代文献

输出为Markdown表格。`,
        phase: 'Stage 4: 引文验证',
      },
      {
        label: 'verify-batch4',
        prompt: `你是学术文献验证专家。请验证以下论文中[121]-[163]号参考文献的真实性：

论文路径：${PAPER_PATH}

${PROXY_HINT}

验证方法：
1. 用 Zotero 搜索每篇文献的标题（本地，无需代理）
2. 用 WebSearch 搜索 "作者名 标题 期刊名"
3. 如果 WebSearch 失败，用 Bash curl 通过代理访问 CrossRef API 验证
4. 检查 DOI 是否可访问
5. 检查期刊名是否真实存在

对于每篇文献，输出：
- 序号
- 状态：VERIFIED / MISSING / UNCERTAIN
- 理由
- 如缺失，建议的替代文献

输出为Markdown表格。`,
        phase: 'Stage 4: 引文验证',
      },
    ],
    checkpoint: '引文验证完成后，根据报告替换虚假文献',
  },

  5: {
    name: '图表制作',
    description: '设计并生成论文所需图表',
    agents: [
      {
        label: 'figure-design',
        prompt: `为这篇综述论文设计需要的图表：

论文路径：${PAPER_PATH}

请设计以下图表（输出详细的设计方案，包括坐标轴、数据来源、配色方案）：

1. **图1**：TBM掘进参数分类体系图（思维导图/树状图）
2. **图2**：机器学习方法发展时间线（2016-2026）
3. **图3**：各ML方法性能对比雷达图（准确率、训练速度、可解释性等维度）
4. **图4**：多源数据融合框架示意图
5. **图5**：国内外典型TBM工程案例分布图
6. **表1**：传统ML方法性能对比表（已有，检查格式）
7. **表2**：深度学习方法性能对比表（已有，检查格式）
8. **表3**：工程案例汇总表

对每个图表给出具体的数据建议和实现方式。`,
        phase: 'Stage 5: 图表制作',
      },
      {
        label: 'figure-generate',
        prompt: `基于以下设计方案，用Python生成论文图表：

论文路径：${PAPER_PATH}
输出目录：${OUTPUT_DIR}\\figures\\

请生成以下图表的Python代码并执行：

1. 各ML方法在不同数据集上的准确率对比柱状图
2. TBM掘进参数时间序列示例图
3. 深度学习模型架构示意图（CNN-LSTM）
4. 研究热点关键词共现网络图

要求：
- matplotlib/seaborn 绑定中文显示
- 300 DPI，适合投稿
- 专业配色方案
- 保存为PNG和SVG格式`,
        phase: 'Stage 5: 图表制作',
      },
    ],
    checkpoint: '图表制作完成后，进入 Stage 6',
  },

  6: {
    name: '审稿自查',
    description: '模拟审稿人严格审查',
    agents: [
      {
        label: 'reviewer-technical',
        prompt: `以岩石力学与工程学报审稿人身份，从技术严谨性角度审查这篇综述：

论文路径：${PAPER_PATH}

重点审查：
1. ML方法的技术描述是否准确？
2. 各方法的优缺点分析是否客观？
3. 工程案例的引用是否准确？
4. 技术术语使用是否规范？
5. 是否有明显的事实错误？
6. 参考文献格式是否统一？

输出详细的审稿意见（按严重程度：致命/重要/一般/建议）。`,
        phase: 'Stage 6: 审稿自查',
      },
      {
        label: 'reviewer-content',
        prompt: `以岩石力学与工程学报审稿人身份，从内容完整性角度审查这篇综述：

论文路径：${PAPER_PATH}

重点审查：
1. 是否覆盖了该领域的主要研究方向？
2. 文献调研是否充分？是否有重要遗漏？
3. 各章节的论述深度是否足够？
4. 挑战与展望部分是否有前瞻性？
5. 综述的创新点是否明确？
6. 结论是否准确概括了全文？

输出详细的审稿意见。`,
        phase: 'Stage 6: 审稿自查',
      },
    ],
    checkpoint: '审稿意见汇总后，进入 Stage 7',
  },

  7: {
    name: '修改回复',
    description: '根据审稿意见修改',
    agents: [
      {
        label: 'revision-plan',
        prompt: `根据Stage 6的审稿意见，制定修改路线图：

论文路径：${PAPER_PATH}

请：
1. 将所有审稿意见按严重程度排序
2. 对每条意见给出修改方案
3. 标注哪些可以快速修改、哪些需要深入修改
4. 建议哪些意见可以合理反驳

输出Markdown表格。`,
        phase: 'Stage 7: 修改回复',
      },
      {
        label: 'apply-revisions',
        prompt: `根据审稿意见和修改路线图，对论文进行修改：

论文路径：${PAPER_PATH}

请：
1. 逐条落实修改意见
2. 修改论文内容
3. 确保修改后逻辑通顺
4. 输出修改说明（修改了什么、为什么这样修改）`,
        phase: 'Stage 7: 修改回复',
      },
    ],
    checkpoint: '修改完成后，进入 Stage 8',
  },

  8: {
    name: '投稿输出',
    description: '格式转换、投稿文件包',
    agents: [
      {
        label: 'format-prep',
        prompt: `为论文准备投稿就绪文件包：

论文路径：${PAPER_PATH}
输出目录：${OUTPUT_DIR}\\submission-package\\

目标期刊：岩石力学与工程学报

需要准备：
1. 期刊格式检查清单
2. Cover Letter（中文）
3. Highlights（3-5条）
4. 作者贡献声明模板
5. 利益冲突声明
6. 数据可用性声明
7. AI 使用声明

输出所有文件到指定目录。`,
        phase: 'Stage 8: 投稿输出',
      },
    ],
    checkpoint: '🎉 投稿文件包完成！',
  },
}

// ================================================================
// 主流程
// ================================================================

const targetStage = args?.stage || 'all'

if (targetStage === 'all') {
  log('=== TBM综述论文全流程启动 ===')
  log(`论文：${PAPER_PATH}`)
  log('共 8 个阶段，每阶段完成需人工确认')

  for (let s = 1; s <= 8; s++) {
    const stage = STAGES[s]
    phase(`Stage ${s}: ${stage.name}`)

    log(`\n📋 Stage ${s}: ${stage.name}`)
    log(`   ${stage.description}`)

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

  log('\n🎉 全流程完成！')

} else {
  const s = parseInt(targetStage)
  if (!STAGES[s]) {
    log(`❌ 无效的阶段编号: ${targetStage}。有效范围: 1-8`)
    return
  }

  const stage = STAGES[s]
  phase(`Stage ${s}: ${stage.name}`)

  log(`\n📋 Stage ${s}: ${stage.name}`)
  log(`   ${stage.description}`)

  await parallel(
    stage.agents.map(a => () =>
      agent(a.prompt, { label: a.label, phase: `Stage ${s}: ${stage.name}` })
    )
  )

  log(`\n✅ Stage ${s} 完成`)
  log(`🔍 检查点: ${stage.checkpoint}`)
}
