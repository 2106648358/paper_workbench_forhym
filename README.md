# 奥运项目评估与预测系统

基于混合权重模型（AHP-EWM）的奥运项目评估决策支持系统。

## 项目结构

```
paper_workbench_hym/
├── olympic-evaluation-system/    # 预测系统（React + TypeScript）
│   ├── src/                      # 前端源码
│   │   ├── components/           # UI 组件
│   │   ├── lib/                  # 计算库（AHP, EWM）
│   │   ├── store/                # 状态管理（Zustand）
│   │   └── utils/                # 工具函数
│   └── public/data/              # 系统运行数据
│
├── thesis-workspace/             # 论文工作区
│   ├── thesis/                   # LaTeX 论文正文
│   │   ├── main.tex              # 主文件
│   │   ├── chapters/             # 六章内容
│   │   ├── bibs/                 # 参考文献
│   │   ├── data/                 # 论文用数据
│   │   └── scripts/              # 计算脚本
│   ├── data-collection/          # 数据收集工作
│   ├── reference/                # 参考文献 PDF
│   └── goal.md                   # 项目目标
│
└── openspec/                     # 变更管理
```

## 论文题目

基于混合权重模型的奥运项目评估与预测系统设计

## 主要内容

1. 构建包含流行度、性别平等、可持续性、包容性、创新性、安全性等六维指标的评价体系
2. 实现 AHP 与熵权法的混合权重计算模块，开发可视化评分系统
3. 利用历史奥运数据验证模型预测准确性，并对 2032 年奥运项目进行预测
4. 开发交互式 Web 应用，展示项目评分与推荐结果