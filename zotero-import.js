export const meta = {
  name: 'zotero-import',
  description: '引文验证后，将分类为 VERIFIED 的文献批量导入 Zotero，跳过 MISMATCH/NOT_FOUND',
  phases: [
    { title: 'Filter', detail: '筛选 VERIFIED 状态的文献' },
    { title: 'Import', detail: '逐条通过 DOI/URL 导入 Zotero' },
    { title: 'Report', detail: '输出导入报告（成功/跳过/失败分类）' },
  ],
}

// ================================================================
// Zotero 文献导入工作流
//
// 用法:
//   传入验证结果数组:
//     Workflow({scriptPath, args: {verificationResults: [...], collectionName: "SEPA-refs"}})
//
//   传入验证报告路径（让 agent 自行提取）:
//     Workflow({scriptPath, args: {verificationReportPath: "D:\\...\\citation-verification-report.md", collectionName: "SEPA-refs"}})
//
// 依赖:
//   Zotero MCP 工具: zotero_add_by_doi, zotero_add_by_url, zotero_create_collection,
//                    zotero_batch_update_tags, zotero_find_duplicates,
//                    zotero_search_collections, zotero_get_collections
// ================================================================

const verificationResults = args?.verificationResults || null
const verificationReportPath = args?.verificationReportPath || null
const collectionName = args?.collectionName || 'paper-refs'
const tags = args?.tags || []
const paperTitle = args?.paperTitle || ''

if (!verificationResults && !verificationReportPath) {
  log('❌ 错误：缺少 verificationResults 或 verificationReportPath 参数')
  log('用法示例：')
  log('  Workflow({scriptPath, args: {verificationResults: [{status:"VERIFIED", doi:"10.xxx/yyy", ...}], collectionName: "SEPA-refs"}})')
  log('  Workflow({scriptPath, args: {verificationReportPath: "D:\\\\path\\\\to\\\\report.md", collectionName: "SEPA-refs"}})')
} else {
  // ================================================================
  // Phase 1: Filter — 筛选 VERIFIED 文献
  // ================================================================
  phase('Filter')

  const filterPrompt = verificationResults
    ? `你是一位文献管理助手。请筛选以下引文验证结果，只保留 status 为 "VERIFIED" 的条目。

验证结果数据：
\`\`\`json
${JSON.stringify(verificationResults, null, 2)}
\`\`\`

请：
1. 过滤出所有 status === "VERIFIED" 的条目
2. 统计数量：VERIFIED / MISMATCH / NOT_FOUND 各多少
3. 对 VERIFIED 条目，提取：序号、标题、DOI、作者、年份、期刊
4. 对 MISMATCH 条目，记录跳过原因和建议修正方案
5. 对 NOT_FOUND 条目，记录跳过原因

输出 JSON 格式：
{
  "verified": [{ "id": 1, "title": "...", "doi": "10.xxx/yyy", "authors": "...", "year": 2024, "journal": "..." }],
  "mismatch": [{ "id": 2, "title": "...", "reason": "...", "suggestion": "..." }],
  "notFound": [{ "id": 3, "title": "...", "reason": "..." }],
  "summary": { "total": 0, "verified": 0, "mismatch": 0, "notFound": 0 }
}`
    : `你是一位文献管理助手。请读取以下引文验证报告文件，提取所有引用及其验证状态，然后筛选出 status 为 "VERIFIED" 的条目。

验证报告路径：${verificationReportPath}

请读取该文件，提取引文列表，然后：
1. 过滤出所有 status === "VERIFIED" 的条目
2. 统计数量：VERIFIED / MISMATCH / NOT_FOUND 各多少
3. 对 VERIFIED 条目，提取：序号、标题、DOI、作者、年份、期刊
4. 对 MISMATCH 条目，记录跳过原因
5. 对 NOT_FOUND 条目，记录跳过原因

输出 JSON 格式：
{
  "verified": [{ "id": 1, "title": "...", "doi": "10.xxx/yyy", "authors": "...", "year": 2024, "journal": "..." }],
  "mismatch": [{ "id": 2, "title": "...", "reason": "...", "suggestion": "..." }],
  "notFound": [{ "id": 3, "title": "...", "reason": "..." }],
  "summary": { "total": 0, "verified": 0, "mismatch": 0, "notFound": 0 }
}`

  log('🔍 正在筛选 VERIFIED 文献...')

  const filterResult = await agent(filterPrompt, {
    label: 'filter-verified',
    phase: 'Filter',
  })

  // ================================================================
  // Phase 2: Import — 逐条导入 VERIFIED 文献到 Zotero
  // ================================================================
  phase('Import')

  const importPrompt = `你是一位 Zotero 文献管理专家。请将以下 VERIFIED 文献逐条导入 Zotero。

筛选结果：
${filterResult}

导入步骤：

**步骤 2.1 — 创建/确认 Zotero Collection**
1. 使用 zotero_get_collections 列出所有现有 collection
2. 使用 zotero_search_collections 搜索 "${collectionName}"
3. 如不存在，使用 zotero_create_collection 创建名为 "${collectionName}" 的 collection
4. 记录 collection key

**步骤 2.2 — 逐条导入 VERIFIED 文献**
对每篇 VERIFIED 文献：
1. 如果有 DOI：调用 zotero_add_by_doi，参数：
   - doi: 文献的 DOI
   - collections: ["${collectionName}"]
   - tags: ${JSON.stringify([...tags, 'verified'])}
2. 如果没有 DOI 但有 URL：调用 zotero_add_by_url
3. 两条都没有：标注为 IMPORT_FAILED，说明缺少 DOI/URL

**步骤 2.3 — 去重检查**
导入完毕后：
1. 使用 zotero_find_duplicates 在 collection 中检查重复
2. 如有重复，不自动合并，在报告中列出重复项供人工判断

**重要提示：**
- 不要导入 MISMATCH 或 NOT_FOUND 的文献
- 导入前检查 DOI 格式是否合法（应以 10. 开头）
- 如果某条导入失败，记录原因并继续下一条
- 批量操作不要一次发太多请求，逐条处理

输出导入结果 JSON：
{
  "imported": [{ "id": 1, "title": "...", "doi": "...", "zoteroStatus": "success" }],
  "skippedMismatch": [{ "id": 2, "title": "...", "reason": "MISMATCH: 作者年份不匹配" }],
  "skippedNotFound": [{ "id": 3, "title": "...", "reason": "NOT_FOUND: 文献不存在" }],
  "importFailed": [{ "id": 4, "title": "...", "doi": "...", "reason": "DOI 解析失败" }],
  "duplicates": [{ "id": 5, "title": "...", "existingKey": "ABC123" }],
  "collectionKey": "集合的key",
  "summary": { "total": 0, "imported": 0, "skippedMismatch": 0, "skippedNotFound": 0, "importFailed": 0, "duplicates": 0 }
}`

  log('📥 正在导入 VERIFIED 文献到 Zotero...')
  log(`   目标 Collection: ${collectionName}`)
  log(`   标签: ${[...tags, 'verified'].join(', ')}`)

  const importResult = await agent(importPrompt, {
    label: 'import-to-zotero',
    phase: 'Import',
  })

  // ================================================================
  // Phase 3: Report — 生成导入报告
  // ================================================================
  phase('Report')

  log('📊 生成导入报告...')

  const reportPrompt = `基于以下导入结果，生成一份简洁的 Zotero 导入报告。

导入结果：
${importResult}

论文：${paperTitle || '（未指定）'}
目标 Collection：${collectionName}

请生成 Markdown 格式报告，包含：

## 📊 Zotero 导入报告

### 总体统计
| 分类 | 数量 |
|------|------|
| ✅ 已导入 | N 篇 |
| ⚠️ 跳过（MISMATCH） | M 篇 |
| ❌ 跳过（NOT_FOUND） | K 篇 |
| ⛔ 导入失败 | P 篇 |
| 🔄 发现重复 | D 篇 |

### ✅ 已导入文献
（列出每篇标题 + DOI）

### ⚠️ 待人工处理（MISMATCH）
（列出每篇 + 修正建议）

### ❌ 未找到（NOT_FOUND）
（列出每篇 + 替代建议）

### ⛔ 导入失败
（列出每篇 + 失败原因）

### 下一步操作
1. 在 Zotero 中检查 "${collectionName}" collection
2. 人工处理 MISMATCH 文献（修正信息后手动导入）
3. 为 NOT_FOUND 文献寻找替代文献
4. 如有重复项，手动判断合并

输出为 Markdown。`

  const report = await agent(reportPrompt, {
    label: 'generate-report',
    phase: 'Report',
  })

  log('\n=== Zotero 导入完成 ===')
  log(report)
}
