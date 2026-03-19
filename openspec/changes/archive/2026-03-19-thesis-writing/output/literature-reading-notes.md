# 文献阅读笔记

## 阅读时间：2026-03-18

---

## 一、核心文献 1：Song et al. (2025) ⭐⭐⭐

### 基本信息
- **标题**: Quantifying future Olympic sport selection: a data-driven framework for SDE evaluation and selection
- **作者**: Yunkun Song, Rui Dai, Qiaoyi Zhang, Yizhuo Sun
- **期刊**: Frontiers in Sports and Active Living
- **年份**: 2025
- **Key**: U67BLQ6J

### 研究问题
奥运项目（SDEs - sports, disciplines, events）的选择过程本质上是主观的，需要开发定量决策模型为国际奥委会（IOC）提供科学依据。

### IOC 评估标准（六维指标）
1. **Popularity and accessibility** - 流行度和可及性
2. **Gender equity** - 性别平等
3. **Sustainability** - 可持续性
4. **Inclusivity** - 包容性
5. **Relevance and innovation** - 相关性和创新性
6. **Safety and fair play** - 安全和公平

### 方法论
- **AHP (Analytic Hierarchy Process)** - 计算各因素的相对重要性
  - 层次结构构建
  - 成对比较矩阵
  - 优先向量计算
  - 一致性检验
- **PCA (Principal Component Analysis)** - 特征提取
- **KNN (k-nearest neighbour)** - 分类器

### 一致性指标 RI 表
| n | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|---|---|---|---|---|---|---|---|----|----|----|----|----|----|-----|
| RI | 0.52 | 0.89 | 1.12 | 1.26 | 1.36 | 1.41 | 1.46 | 1.49 | 1.52 | 1.54 | 1.56 | 1.58 | 1.59 | 1.5943 |

### 研究结论
2032 年布里斯班奥运会候选项目排名：
1. Esports（电子竞技）
2. Australian rules football（澳式足球）
3. Pickleball（匹克球）
4. Tug of war（拔河）
5. Bowling（保龄球）
6. Chess（国际象棋）

### 可引用要点
> "The selection process for Olympic sports is inherently subjective... developing a quantitative decision-making model is crucial for the International Olympic Committee (IOC)."

> "Our model employs a scoring and labelling system based on the Analytic Hierarchy Process (AHP), which calculates the relative importance of each factor."

---

## 二、核心文献 2：Saaty (2007)

### 基本信息
- **标题**: The analytic hierarchy and analytic network measurement processes: Applications to decisions under Risk
- **作者**: Thomas L. Saaty
- **期刊**: European Journal of Pure and Applied Mathematics
- **卷期**: Vol. 1, No. 1, pp. 122-196
- **年份**: 2007
- **DOI**: 10.29020/nybg.ejpam.v1i1.6
- **Key**: VEA3XXF8

### 理论要点
- AHP 是决策中的数学测量理论
- 从数值判断表示导出优先级尺度
- 通过合成规则组合不同因素

### 摘要关键句
> "In decision making, there are no set laws to characterize structures in which relations are predetermined for every decision. Understanding is needed to structure a problem and then also to use judgments to represent importance and preference quantitatively."

> "In decision making the priority scales can only be derived objectively after subjective judgments are made. The process is the opposite of what we do in science."

---

## 三、核心文献 3：Wang & Liu (2019)

### 基本信息
- **标题**: Comprehensive Evaluation and Analysis of Maritime Soft Power Based on the Entropy Weight Method(EWM)
- **作者**: Bin Wang, Jing Liu
- **期刊**: Journal of Physics: Conference Series
- **卷期**: Vol. 1168, 032108
- **年份**: 2019
- **DOI**: 10.1088/1742-6596/1168/3/032108
- **Key**: MNSL2BED

### 方法论
- 使用熵权法（EWM）进行综合评价
- 构建评价指标体系
- 通过信息熵确定各指标权重

---

## 四、核心文献 4：李凤梅 (2013)

### 基本信息
- **标题**: 夏季奥运会项目的设置标准及改革原则:基于入选条件的探究
- **作者**: 李凤梅
- **期刊**: 首都体育学院学报
- **卷期**: 第25卷第3期
- **年份**: 2013
- **DOI**: 10.14036/j.cnki.cn11-4513.2013.03.013
- **Key**: 36U2EI7D

### 研究要点
- 夏季奥运会项目设置条件分析
- 定性和定量标准研究
- 改革原则：社会性、经济性、人文性

### 评估维度
- 人文取向
- 经济价值
- 社会属性

### 关键词
奥运会、入选条件、设置标准、项目设置

---

## 方法论对比分析

| 方法 | Song (2025) | 本研究计划 |
|------|-------------|------------|
| 主观权重 | AHP | AHP ✅ |
| 客观权重 | - | EWM ✅ |
| 混合策略 | - | AHP-EWM 组合 ✅ |
| 特征提取 | PCA | - |
| 分类器 | KNN | - |

### 本研究的创新点
Song et al. (2025) 使用 AHP + PCA + KNN 方法，而本研究计划采用 **AHP + EWM 混合权重模型**，这是一个方法上的差异和创新机会。

---

## 下一步行动
1. 深入阅读 AHP-EWM 组合方法文献（陈家金、尚天成等）
2. 提取熵权计算的完整公式
3. 确定混合权重组合系数 α 的确定方法
4. 导出 BibTeX 文献库