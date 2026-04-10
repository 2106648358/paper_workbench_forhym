# 奥运评估系统 UI 改造设计方案

**日期**: 2026-04-10  
**状态**: 已批准  
**类型**: UI/UX 设计

## 背景

当前系统使用标准的 Tailwind 蓝白色调，缺乏独特的设计个性。需要基于 Claude 设计系统进行改造，营造温暖、学术感的视觉风格。

## 设计目标

1. 应用 Claude 温暖羊皮纸色调
2. 引入 Serif 字体增强学术感
3. 统一组件设计语言
4. 简化设计（移除暗色模式）

## 设计决策

### 颜色系统

| 用途 | 颜色代码 | 说明 |
|------|----------|------|
| 主色调 | `#c96442` | Terracotta Brand，用于 CTA 和强调 |
| 页面背景 | `#f5f4ed` | Parchment，温暖羊皮纸色调 |
| 卡片背景 | `#faf9f5` | Ivory，略微抬升的表面 |
| 主文字 | `#141413` | Near Black，暖黑色 |
| 次文字 | `#5e5d59` | Olive Gray，暖灰色 |
| 边框 | `#f0eee6` | Border Cream，柔和边界 |
| 按钮背景 | `#e8e6dc` | Warm Sand，温暖沙色 |
| 深色强调 | `#30302e` | Dark Surface，深色组件 |

### 字体方案

- **标题**: Playfair Display (Serif)，weight 500
- **正文/UI**: Inter (Sans-serif)
- **代码**: system monospace

### 圆角系统

| 元素 | 圆角 |
|------|------|
| 按钮 | 8px |
| 卡片 | 12px |
| 输入框 | 12px |
| 标签页 | 16px |
| 大容器 | 32px |

### 阴影系统

- **环状阴影**：`0px 0px 0px 1px #d1cfc5`（交互状态）
- **轻提升**：`rgba(0,0,0,0.05) 0px 4px 24px`（卡片）

## 实现计划

### Phase 1: 全局样式
1. 修改 `index.html` 添加 Google Fonts
2. 重写 `index.css` CSS 变量和全局样式

### Phase 2: 核心布局组件
3. 改造 `Layout.tsx` - Parchment 背景
4. 改造 `Sidebar.tsx` - 温暖色调、Serif 标题

### Phase 3: 通用组件
5. 改造 `PieChart.tsx` - 新配色
6. 改造 `AlphaSlider.tsx` - 新配色和圆角

### Phase 4: 业务组件
7. 改造 `JudgmentMatrix.tsx` - 温暖卡片
8. 改造 `RankingTable.tsx` - 暖色表格

### Phase 5: App 层
9. 改造 `App.tsx` - Tab 样式、颜色统一

## ECharts 配色

```javascript
['#c96442', '#d97757', '#5e5d59', '#87867f', '#4d4c48', '#3d3d3a']
```

## 验收标准

- [ ] 页面背景为 Parchment (#f5f4ed)
- [ ] 卡片背景为 Ivory (#faf9f5)
- [ ] 标题使用 Playfair Display Serif 字体
- [ ] 主色调为 Terracotta (#c96442)
- [ ] 所有圆角统一为设计方案
- [ ] 移除所有冷色调（蓝色系）
