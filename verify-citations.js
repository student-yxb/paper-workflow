export const meta = {
  name: 'verify-citations',
  description: '验证论文参考文献的真实性：通过DOI检索、标题搜索等方式逐条核实',
  phases: [
    { title: 'Citation Verification', detail: '逐条验证参考文献是否存在' },
    { title: 'Report', detail: '生成验证报告，分类标记VERIFIED/MISSING/UNCERTAIN' },
  ],
}

// ================================================================
// 参考文献真实性验证工作流
//
// 读取论文中的参考文献列表，逐条验证：
// 1. 通过 DOI 链接验证
// 2. 通过标题+作者+年份搜索验证
// 3. 分类标记：VERIFIED / MISSING / UNCERTAIN
// ================================================================

const PAPER_PATH = args?.paperPath || 'D:\\综述-ai修改\\TBM-ML-地层识别\\基于机器学习的TBM掘进地层识别研究现状及展望.md'

// Step 1: 读取论文并提取参考文献列表
phase('Citation Verification')

const extractionPrompt = `请读取以下论文文件，提取所有参考文献（[1]到[163]），输出为JSON数组格式。每个元素包含：
- id: 序号（数字）
- authors: 作者名
- year: 年份
- title: 文章标题
- journal: 期刊名
- volume: 卷号（如有）
- pages: 页码（如有）
- doi: DOI（如有，从文中判断）

文件路径：${PAPER_PATH}

只输出JSON数组，不要其他内容。`

log('📖 正在提取论文中的参考文献列表...')

const extractionResult = await agent(extractionPrompt, {
  label: 'extract-references',
  phase: 'Citation Verification',
})

// Step 2: 分批验证参考文献
log('🔍 开始逐条验证参考文献...')

const verificationPrompt = `你是一位学术文献验证专家。请验证以下参考文献列表中的每篇文献是否真实存在。

验证方法：
1. 如果有DOI，检查DOI格式是否合理（10.1016/...、10.1200/... 等格式）
2. 通过标题和作者搜索，判断是否为真实发表的论文
3. 检查期刊名是否为真实存在的期刊
4. 检查作者名是否合理

对于每篇文献，输出：
- id: 序号
- status: VERIFIED（确认存在）/ MISSING（确认不存在）/ UNCERTAIN（无法确定）
- reason: 判断理由
- suggestion: 如果缺失，建议的替代文献（如知道的话）

参考文献列表：
${extractionResult}

请逐条验证，输出JSON格式结果。`

log('⏳ 验证可能需要几分钟，请耐心等待...')

const verificationResult = await agent(verificationPrompt, {
  label: 'verify-references',
  phase: 'Citation Verification',
})

// Step 3: 生成验证报告
phase('Report')

log('📊 生成验证报告...')

const reportPrompt = `基于以下验证结果，生成一份详细的参考文献验证报告。

验证结果：
${verificationResult}

请生成报告，包含：
1. 总体统计：已确认/缺失/不确定的数量和比例
2. 详细列表：按分类列出每篇文献的状态和理由
3. 具体建议：对于缺失或不确定的文献，建议如何处理（删除/替换/进一步核实）
4. 优先级排序：哪些文献最需要优先处理

输出为Markdown格式。`

const report = await agent(reportPrompt, {
  label: 'generate-report',
  phase: 'Report',
})

log('\n✅ 参考文献验证完成！')
log(report)
