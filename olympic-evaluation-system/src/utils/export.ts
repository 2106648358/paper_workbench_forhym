import type { Project } from '@/types';

export function exportToCSV(projects: Project[], filename: string = 'olympic-rankings.csv'): void {
  const headers = ['排名', '项目名称', '英文名称', '综合评分', '入选概率', '流行度', '性别平等', '可持续性', '包容性', '创新性', '安全性'];
  
  const rows = projects
    .filter((p) => p.score !== undefined)
    .sort((a, b) => (a.rank || 999) - (b.rank || 999))
    .map((p) => [
      p.rank?.toString() || '',
      p.name,
      p.nameEn,
      p.score?.toFixed(3) || '',
      p.probability ? `${(p.probability * 100).toFixed(1)}%` : '',
      p.indicators.popularity.toFixed(2),
      p.indicators.gender_equity.toFixed(2),
      p.indicators.sustainability.toFixed(2),
      p.indicators.inclusivity.toFixed(2),
      p.indicators.innovation.toFixed(2),
      p.indicators.safety.toFixed(2),
    ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

import { toPng } from 'html-to-image';

export function exportChartToPNG(chartElement: HTMLElement, filename: string = 'chart.png'): void {
  toPng(chartElement)
    .then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    })
    .catch((err: Error) => {
      console.error('Failed to export chart:', err);
    });
}

export function generateReport(projects: Project[], weights: Record<string, number>, alpha: number): string {
  const sortedProjects = [...projects]
    .filter((p) => p.score !== undefined)
    .sort((a, b) => (a.rank || 999) - (b.rank || 999));

  const highProbability = sortedProjects.filter((p) => (p.probability || 0) >= 0.7);
  const lowProbability = sortedProjects.filter((p) => (p.probability || 0) < 0.4);

  const report = `# 奥运项目评估报告

## 模型配置

- **评估方法**: AHP-EWM 混合权重模型
- **α 参数**: ${alpha.toFixed(2)}
- **评估日期**: ${new Date().toLocaleDateString('zh-CN')}

## 权重配置

| 指标 | 权重 |
|------|------|
| 流行度 | ${((weights.popularity || 0) * 100).toFixed(1)}% |
| 性别平等 | ${((weights.gender_equity || 0) * 100).toFixed(1)}% |
| 可持续性 | ${((weights.sustainability || 0) * 100).toFixed(1)}% |
| 包容性 | ${((weights.inclusivity || 0) * 100).toFixed(1)}% |
| 创新性 | ${((weights.innovation || 0) * 100).toFixed(1)}% |
| 安全性 | ${((weights.safety || 0) * 100).toFixed(1)}% |

## 项目排名 (前10)

| 排名 | 项目 | 评分 | 入选概率 |
|------|------|------|----------|
${sortedProjects.slice(0, 10).map((p) => `| ${p.rank} | ${p.name} | ${p.score?.toFixed(3)} | ${((p.probability || 0) * 100).toFixed(0)}% |`).join('\n')}

## 预测分析

### 高概率入选项目 (${highProbability.length} 项)

${highProbability.slice(0, 5).map((p) => `- ${p.name} (${((p.probability || 0) * 100).toFixed(0)}%)`).join('\n')}

### 可能被淘汰项目 (${lowProbability.length} 项)

${lowProbability.slice(0, 5).map((p) => `- ${p.name} (${((p.probability || 0) * 100).toFixed(0)}%)`).join('\n')}

---

*报告由奥运项目评估与预测系统自动生成*
`;

  return report;
}

export function downloadMarkdown(content: string, filename: string = 'report.md'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}