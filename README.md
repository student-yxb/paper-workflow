# Paper Workflow Skill

模块化 8 阶段学术论文写作全流程 — 从规划到投稿。

组合 nature-skills + academic-research-skills + Zotero MCP + Omniscale 最佳能力。

## 依赖

| 依赖 | GitHub |
|------|--------|
| nature-skills | https://github.com/Yuan1z0825/nature-skills |
| academic-research-skills | https://github.com/Imbad0202/academic-research-skills |
| Zotero MCP | https://github.com/54yyyu/zotero-mcp |

## 文件

| 文件 | 说明 |
|------|------|
| `SKILL.md` | Skill 定义 |
| `paper-workflow.js` | 通用 8 阶段工作流脚本 |
| `zotero-import.js` | Zotero 导入脚本（仅导入 VERIFIED 文献） |
| `paper-writing-workflow-guide.md` | 完整中文使用手册 |
| `verify-citations.js` | 独立引文验证脚本 |
| `tbm-paper-workflow.js` | 项目实例（TBM-ML 综述） |

## 使用

```js
// 全流程
Workflow({scriptPath: "paper-workflow.js", args: {
  stage: "all", paperPath: "/path/to/paper.docx", paperTitle: "标题",
  collectionName: "paper-refs"
}})

// 仅 Zotero 导入
Workflow({scriptPath: "zotero-import.js", args: {
  verificationReportPath: "/path/to/report.md", collectionName: "paper-refs"
}})
```
