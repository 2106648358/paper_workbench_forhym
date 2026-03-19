# 奥运项目数据采集

本目录包含论文第四章所使用的奥运项目六维指标评估数据，以及数据采集脚本。

---

## 一、数据文件

### 1.1 主数据文件

**文件**: `data/olympic_projects_data.json`

包含12个奥运项目的六维指标评估数据，可直接用于论文实验。

### 1.2 数据概览

| 项目 | 性别平等 | 流行度 | 可持续性 | 包容性 | 创新性 | 安全性 | 状态 |
|------|----------|--------|----------|--------|--------|--------|------|
| 田径 | 0.88 | 0.95 | 0.70 | 0.88 | 0.35 | 0.75 | 核心 |
| 游泳 | 0.95 | 0.92 | 0.60 | 0.85 | 0.40 | 0.88 | 核心 |
| 体操 | 0.85 | 0.88 | 0.55 | 0.55 | 0.45 | 0.62 | 核心 |
| 篮球 | 0.92 | 0.93 | 0.75 | 0.82 | 0.50 | 0.55 | 核心 |
| 足球 | 0.80 | 0.98 | 0.80 | 0.90 | 0.40 | 0.50 | 核心 |
| 攀岩 | 0.90 | 0.68 | 0.60 | 0.35 | 0.95 | 0.85 | 新增 |
| 冲浪 | 0.90 | 0.65 | 0.85 | 0.25 | 0.90 | 0.80 | 新增 |
| 滑板 | 0.90 | 0.72 | 0.70 | 0.40 | 0.98 | 0.35 | 新增 |
| 霹雳舞 | 0.92 | 0.55 | 0.90 | 0.45 | 1.00 | 0.70 | 新增 |
| 电子竞技 | 0.65 | 0.95 | 0.85 | 0.55 | 1.00 | 0.95 | 候选 |
| 空手道 | 0.90 | 0.55 | 0.90 | 0.50 | 0.75 | 0.60 | 已移除 |
| 棒球/垒球 | 0.80 | 0.60 | 0.45 | 0.40 | 0.35 | 0.80 | 历史变迁 |

---

## 二、数据来源

### 2.1 性别平等数据

| 项目 | 来源 |
|------|------|
| 田径 | World Athletics; Paris 2024 |
| 游泳 | World Aquatics; Paris 2024 |
| 体操 | FIG Annual Report 2023 |
| 篮球 | FIBA; Paris 2024 |
| 足球 | FIFA; 巴黎奥运男女球队名额差异 |

**关键发现**: Paris 2024 是历史上首届实现性别平等的奥运会，男女运动员名额完全相等。

### 2.2 安全性数据（学术文献）

| 项目 | 文献 | 期刊 |
|------|------|------|
| 田径/足球 | Junge et al. (2009) | Br J Sports Med |
| 游泳 | Mountjoy et al. (2016) | Br J Sports Med |
| 体操 | Caine et al. (2008) | Sports Med |
| 篮球 | McKay et al. (2001) | J Sci Med Sport |
| 攀岩 | Schöffl et al. (2018) | Wilderness Environ Med |
| 冲浪 | Nathanson et al. (2007) | Am J Emerg Med |
| 滑板 | Shuman et al. (2017) | Inj Epidemiol |
| 霹雳舞 | O'Kane et al. (2011) | Int J Sports Phys Ther |
| 电子竞技 | Rudolf et al. (2020) | BMJ Open Sport Exerc Med |
| 空手道 | Arriaza et al. (2016) | Orthop J Sports Med |
| 棒球/垒球 | Posner et al. (2011) | Am J Sports Med |

### 2.3 包容性数据

**来源**: 国际残奥委会 (IPC) 官网

- 夏季残奥会运动: 23个
- 有奥运对应项目: 19个
- 无奥运对应项目: Boccia, Goalball, Wheelchair Rugby, (及 Para Climbing 待LA28)

**奥运项目残奥关联**:
- 有关联: 田径, 游泳, 篮球, 足球
- 无关联: 体操, 攀岩, 冲浪, 滑板, 霹雳舞, 电子竞技, 空手道, 棒球/垒球

---

## 三、数据与论文的对应关系

### 3.1 按论文章节

| 章节 | 使用数据 | 用途 |
|------|----------|------|
| 4.1 数据来源与预处理 | IOC/IPC官方数据、文献数据 | 论证数据可靠性、标准化处理 |
| 4.2 历史奥运项目评估实验 | 六维指标数据 | AHP-EWM模型输入 |
| 4.3 模型验证与对比分析 | 评估结果、奖牌榜 | 验证模型准确性 |

### 3.2 六维指标计算公式

| 指标 | 公式 | 论文用途 |
|------|------|----------|
| 性别平等 | E_gender = 1 - \|P_male - 0.5\| × 2 | 评估项目对性别平等的贡献 |
| 流行度 | E_pop = Norm(participation) + Norm(trends) | 评估全球影响力 |
| 可持续性 | E_sust = 1 - (venue + equipment) / 10 | 评估环境可持续性 |
| 包容性 | E_incl = D_para × 0.5 + D_dev × 0.5 | 评估对残疾人和发展中国家的包容性 |
| 创新性 | E_innov = recency × 0.6 + yog × 0.4 | 评估创新性和年轻化程度 |
| 安全性 | E_safety = 1 - Norm(injury_rate) | 评估安全风险 |

---

## 四、采集脚本

### 4.1 脚本说明

| 脚本 | 功能 |
|------|------|
| `scripts/olympics_data_collector.py` | 从 IOC 官网采集 Paris 2024 数据 |
| `scripts/paralympic_data_collector.py` | 从 IPC 官网采集残奥数据 |
| `scripts/data_integrator.py` | 整合数据，生成最终JSON |
| `scripts/data_validator.py` | 验证数据完整性 |

### 4.2 使用方法

```bash
cd tex_relation/thesis/data_collection

# 运行所有采集脚本
python scripts/olympics_data_collector.py
python scripts/paralympic_data_collector.py
python scripts/data_integrator.py
python scripts/data_validator.py
```

### 4.3 数据更新

如需更新数据，重新运行脚本即可。脚本会自动记录采集日期。

---

## 五、引用建议

### 5.1 正文引用

> 性别平等数据来源于 IOC Paris 2024 官方网站，该届奥运会是历史上首届实现性别平等的奥运会。包容性数据来源于国际残奥委会(IPC)官方网站的残奥运动列表。安全性数据来源于 PubMed 检索的同行评审文献。

### 5.2 参考文献

```bibtex
@misc{ioc_paris2024,
  author = {{International Olympic Committee}},
  title = {Paris 2024 Olympic Games},
  year = {2024},
  url = {https://olympics.com/en/paris-2024},
  note = {Accessed: 2026-03-18}
}

@misc{ipc_sports,
  author = {{International Paralympic Committee}},
  title = {Paralympic Sports},
  year = {2024},
  url = {https://www.paralympic.org/sports},
  note = {Accessed: 2026-03-18}
}

@article{junge2009injuries,
  author = {Junge, A and others},
  title = {Injuries in team sport tournaments during the 2004 Olympic Games},
  journal = {Br J Sports Med},
  year = {2009},
  volume = {43},
  pages = {557--562}
}
```

---

## 六、目录结构

```
data_collection/
├── README.md                    # 本文档
├── scripts/                     # 数据采集脚本
│   ├── olympics_data_collector.py
│   ├── paralympic_data_collector.py
│   ├── data_integrator.py
│   └── data_validator.py
└── data/                        # 数据文件
    └── olympic_projects_data.json
```

---

**创建日期**: 2026-03-18  
**论文章节**: 第四章 实验设计与数据分析