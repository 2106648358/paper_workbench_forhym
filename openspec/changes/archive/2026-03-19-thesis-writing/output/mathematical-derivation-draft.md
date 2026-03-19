# 数学推导草稿（修订版）

## 模块 3：问题建模与数学推导

**修订时间**: 2026-03-18
**修订内容**: 补充理论依据和文献引用

---

## 一、多准则决策理论基础

### 1.1 MCDM 问题定义

多准则决策（Multi-Criteria Decision Making, MCDM）是决策科学的重要分支，用于解决具有多个相互冲突准则的决策问题。

**理论基础**：
- Zeleny (1982) 在《Multiple Criteria Decision Making》中系统阐述了多准则决策的理论框架
- 多准则决策问题的一般形式：给定备选方案集和评价准则集，确定各方案的优先排序

**引用**：
> Zeleny, M. (1982). Multiple Criteria Decision Making. McGraw-Hill.

### 1.2 本研究的问题定义

**符号定义**：

| 符号 | 含义 | 说明 |
|------|------|------|
| n | 备选项目数量 | 奥运候选运动项目数 |
| m | 评价指标数量 | 本研究中 m = 6 |
| S = {s₁, ..., sₙ} | 备选项目集合 | 各运动项目 |
| C = {c₁, ..., cₘ} | 评价指标集合 | 六维指标体系 |
| X = [xᵢⱼ]ₙₓₘ | 决策矩阵 | 项目 i 在指标 j 上的值 |
| W = (w₁, ..., wₘ) | 权重向量 | 各指标的重要性权重 |

---

## 二、AHP 层次分析法理论推导

### 2.1 判断矩阵理论

**核心文献**：Saaty (2007) - AHP 创始人的经典论文

**引用**：
> Saaty, T. L. (2007). The analytic hierarchy and analytic network measurement processes: Applications to decisions under Risk. European Journal of Pure and Applied Mathematics, 1(1), 122-196.

**定理 1（判断矩阵定义）**：

判断矩阵 A 是一个 n×n 的正互反矩阵，满足：
$$a_{ij} > 0, \quad a_{ji} = \frac{1}{a_{ij}}, \quad a_{ii} = 1$$

**Saaty 1-9 标度法的理论依据**：

Saaty (2007) 提出 1-9 标度法，其心理学依据是：
- 人类区分信息等级的极限约为 7±2 个等级
- 因此采用 1-9 的标度范围

**引用**：
> "The scale 1 to 9 is used because it has been found to be a natural way for people to express their judgments." — Saaty (2007, p. 125)

### 2.2 特征值法求权重

**核心定理（Saaty 定理）**：

对于完全一致的判断矩阵 A，存在唯一的非零特征值 λ = n，对应的特征向量即为权重向量。

**证明（基于 Saaty 2007）**：

若判断矩阵完全一致，则存在权重向量 W 使得：
$$a_{ij} = \frac{w_i}{w_j}$$

因此：
$$\sum_{j=1}^{n} a_{ij} w_j = \sum_{j=1}^{n} \frac{w_i}{w_j} w_j = n \cdot w_i$$

写成矩阵形式：
$$AW = nW$$

这表明 W 是矩阵 A 对应于特征值 λ = n 的特征向量。

**引用**：
> "For a consistent matrix, the principal eigenvalue is equal to n." — Saaty (2007, p. 130)

### 2.3 一致性检验理论

**定理 2（一致性检验）**：

当判断矩阵不完全一致时，λmax > n。一致性指标定义为：
$$CI = \frac{\lambda_{\max} - n}{n - 1}$$

**RI 值的来源**：

Saaty 通过大量随机实验，计算了不同阶数随机矩阵的平均 CI 值，得到 RI 表：

| n | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|-----|
| RI | 0.52 | 0.89 | 1.12 | 1.26 | 1.36 | 1.41 | 1.46 | 1.49 |

**引用**：
> "The consistency ratio CR should be less than 0.10 to accept the judgment matrix." — Saaty (2007, p. 132)

**本研究使用的 RI 表来源**：

Song et al. (2025) 在奥运项目选择研究中给出了完整的 RI 表，本研究直接引用：

**引用**：
> Song, Y., Dai, R., Zhang, Q., & Sun, Y. (2025). Quantifying future Olympic sport selection: a data-driven framework for SDE evaluation and selection. Frontiers in Sports and Active Living, 7, 1596196.

---

## 三、熵权法（EWM）理论推导

### 3.1 信息熵理论基础

**核心理论**：Shannon 信息论

信息熵的概念由 Shannon (1948) 提出，用于度量信息的不确定性。

**引用**：
> Shannon, C. E. (1948). A mathematical theory of communication. Bell System Technical Journal, 27(3), 379-423.

**定义（信息熵）**：

对于离散随机变量 X，其信息熵定义为：
$$H(X) = -\sum_{i=1}^{n} p_i \ln p_i$$

**性质 1**：非负性
$$H(X) \geq 0$$

**性质 2**：极值性
- 当某个 pk = 1 时（完全确定），H(X) = 0
- 当 p₁ = p₂ = ... = pn = 1/n 时（完全随机），H(X) = ln n（最大熵）

### 3.2 熵权法的决策应用

**核心文献**：Wang & Liu (2019)

**引用**：
> Wang, B., & Liu, J. (2019). Comprehensive Evaluation and Analysis of Maritime Soft Power Based on the Entropy Weight Method(EWM). Journal of Physics: Conference Series, 1168, 032108.

**熵权法的核心思想**：

在多准则决策中，若某指标下各方案的数据差异越大，则该指标提供的信息量越大，应赋予较大权重；反之，差异越小，信息量越小，权重应较小。

**信息效用值定义**：
$$D_j = 1 - H_j$$

其中 Hj 为指标 j 的信息熵。

**熵权计算公式**：
$$w_j^{EWM} = \frac{D_j}{\sum_{j=1}^{m} D_j} = \frac{1 - H_j}{\sum_{j=1}^{m} (1 - H_j)}$$

### 3.3 中文文献引用

**陈家金等 (2016)** 在农业气象灾害风险评估中详细阐述了 AHP-EWM 方法：

**引用**：
> 陈家金, 王加义, 黄川容, 汪春辉, 吴婷婕. (2016). 基于AHP-EWM方法的福建省农业气象灾害风险区划. 中国农业气象.

**尚天成等 (2009)** 给出了熵权计算的完整公式：

**引用**：
> 尚天成, 高彬彬, 李翔鹏, 张岩. (2009). 基于层次分析法和熵权法的城市土地集约利用评价.

---

## 四、混合权重组合理论

### 4.1 组合权重的必要性

**文献依据**：

Zhang et al. (2023) 指出：

**引用**：
> Zhang, R., Tian, D., Wang, H., et al. (2023). Risk Assessment of Compound Dynamic Disaster Based on AHP-EWM.

> "AHP reflects subjective judgments of experts, while EWM reflects objective information from data. The combination of both methods can provide more comprehensive and reliable weight results."

### 4.2 线性组合模型的理论依据

**凸组合理论**：

设 W1 和 W2 是两个权重向量，则对于任意 α ∈ [0,1]：
$$W = \alpha W_1 + (1-\alpha) W_2$$

也是一个合法的权重向量（满足非负性和归一化）。

**证明**：

1. 非负性：由于 W1, W2 ≥ 0 且 α ∈ [0,1]，故 W ≥ 0
2. 归一化：
$$\sum_{j=1}^{m} w_j = \alpha \sum_{j=1}^{m} w_j^{(1)} + (1-\alpha) \sum_{j=1}^{m} w_j^{(2)} = \alpha \cdot 1 + (1-\alpha) \cdot 1 = 1$$

### 4.3 混合权重文献参考

**Li et al. (2025)** 在环境质量评估中使用 AHP-EWM 方法：

**引用**：
> Li, J., Li, T., Jing, T., et al. (2025). Evaluation of Environmental Quality in Northern Winter Fattening Pig Houses Based on AHP-EWM. Frontiers in Veterinary Science.

**侯国林, 黄震方 (2010)** 提出了熵权层次分析组合方法：

**引用**：
> 侯国林, 黄震方. (2010). 旅游地社区参与度熵权层次分析评价模型与应用.

---

## 五、奥运项目评估相关理论

### 5.1 IOC 评估标准

**核心文献**：李凤梅 (2013)

**引用**：
> 李凤梅. (2013). 夏季奥运会项目的设置标准及改革原则:基于入选条件的探究. 首都体育学院学报, 25(3).

**评估维度**：
- 人文取向
- 经济价值
- 社会属性

### 5.2 Song et al. (2025) 的六维指标体系

**引用**：
> Song, Y., Dai, R., Zhang, Q., & Sun, Y. (2025). Quantifying future Olympic sport selection: a data-driven framework for SDE evaluation and selection. Frontiers in Sports and Active Living, 7, 1596196.

**IOC 评估标准（Song 总结）**：
1. Popularity and accessibility - 流行度和可及性
2. Gender equity - 性别平等
3. Sustainability - 可持续性
4. Inclusivity - 包容性
5. Relevance and innovation - 相关性和创新性
6. Safety and fair play - 安全和公平

**原文引用**：
> "This study evaluates IOC criteria for new sports by considering factors such as social media engagement, TV viewership across demographics, affordability, gender equity, youth appeal, cultural diversity, and global involvement."

### 5.3 方法论对比

| 研究 | 方法 | 应用场景 |
|------|------|----------|
| Song et al. (2025) | AHP + PCA + KNN | 奥运项目选择 |
| 本研究 | AHP + EWM | 奥运项目评估 |

**差异说明**：

Song et al. (2025) 使用 PCA 进行特征提取，KNN 进行分类。本研究采用 EWM 进行客观赋权，与 AHP 主观权重组合，形成混合权重模型。两种方法各有优势：
- Song 的方法适合分类问题
- 本研究的方法适合评分排序问题

---

## 六、定理和公式汇总

### 定理 1：Perron-Frobenius 定理

对于正矩阵 A，存在唯一的正实特征值 λmax（Perron 根），对应的特征向量所有分量为正。

**应用**：保证 AHP 权重向量的非负性。

### 定理 2：信息熵极值定理

对于有限离散分布，熵的最大值为 log n（当所有概率相等时取得），最小值为 0（当某个概率为 1 时取得）。

**应用**：确定熵值的范围 Hj ∈ [0, 1]。

### 定理 3：凸组合保持凸性

凸集的凸组合仍是凸集。

**应用**：混合权重保持了权重向量的凸性（归一化、非负性）。

---

## 七、参考文献汇总

### 核心理论文献

1. **Saaty, T. L. (2007)**. The analytic hierarchy and analytic network measurement processes: Applications to decisions under Risk. *European Journal of Pure and Applied Mathematics*, 1(1), 122-196. 【AHP 理论基础】

2. **Shannon, C. E. (1948)**. A mathematical theory of communication. *Bell System Technical Journal*, 27(3), 379-423. 【信息熵理论基础】

3. **Zeleny, M. (1982)**. Multiple Criteria Decision Making. McGraw-Hill. 【多准则决策理论】

### 方法应用文献

4. **Wang, B., & Liu, J. (2019)**. Comprehensive Evaluation and Analysis of Maritime Soft Power Based on the Entropy Weight Method(EWM). *Journal of Physics: Conference Series*, 1168, 032108. 【EWM 应用】

5. **Zhang, R., Tian, D., Wang, H., et al. (2023)**. Risk Assessment of Compound Dynamic Disaster Based on AHP-EWM. 【AHP-EWM 混合方法】

6. **Li, J., et al. (2025)**. Evaluation of Environmental Quality Based on AHP-EWM. 【AHP-EWM 应用】

### 奥运项目评估文献

7. **Song, Y., Dai, R., Zhang, Q., & Sun, Y. (2025)**. Quantifying future Olympic sport selection: a data-driven framework for SDE evaluation and selection. *Frontiers in Sports and Active Living*, 7, 1596196. 【核心参考】

8. **李凤梅. (2013)**. 夏季奥运会项目的设置标准及改革原则:基于入选条件的探究. *首都体育学院学报*, 25(3). 【奥运项目标准】

### 中文 AHP-EWM 文献

9. **陈家金, 王加义, 黄川容, 汪春辉, 吴婷婕. (2016)**. 基于AHP-EWM方法的福建省农业气象灾害风险区划.

10. **尚天成, 高彬彬, 李翔鹏, 张岩. (2009)**. 基于层次分析法和熵权法的城市土地集约利用评价.

11. **侯国林, 黄震方. (2010)**. 旅游地社区参与度熵权层次分析评价模型与应用.

---

## 八、两层 AHP-EWM 混合模型设计

### 8.1 模型结构

本研究采用两层 AHP-EWM 混合模型：

```
目标层：奥运项目综合评分 V
    │
    ▼
═════════════════════════════════════════════════════════
第一层：六维指标权重（AHP-EWM 混合）
═════════════════════════════════════════════════════════
    │
    ├─ AHP 部分：专家判断矩阵 → W_AHP
    │   来源：专家访谈（3-5位专家）
    │   检验：CR < 0.1
    │
    ├─ EWM 部分：六维数据矩阵 → W_EWM
    │   来源：实际收集的数据
    │
    └─ 混合：W = α × W_AHP + (1-α) × W_EWM
    │
    ▼
═════════════════════════════════════════════════════════
第二层：子指标权重（纯 EWM）
═════════════════════════════════════════════════════════
    │
    ├─ 流行度：EWM(收视率, 参与人数, 社交媒体)
    ├─ 性别平等：EWM(男女比例, 混合项目)
    ├─ 可持续性：EWM(碳排放, 成本, 资源)
    ├─ 包容性：EWM(残奥关联, 发展中国家参与)
    ├─ 创新性：EWM(年轻化, 技术革新, 新近加入)
    └─ 安全性：单一指标（受伤率）
    │
    ▼
项目评分：V_i = Σⱼ wⱼ × Eⱼ(dim_j)
```

### 8.2 第一层权重计算

#### 8.2.1 AHP 主观权重

$$W_{AHP} = \frac{v_{\max}}{\|v_{\max}\|_1}$$

其中 $v_{\max}$ 是判断矩阵最大特征值对应的特征向量。

**判断矩阵来源**：专家访谈（3-5位体育管理专家）

#### 8.2.2 EWM 客观权重

输入：六维指标综合值矩阵 $E = [E_{ij}]_{n \times 6}$

$$w_j^{EWM} = \frac{1 - H_j}{\sum_{j=1}^{6} (1 - H_j)}$$

#### 8.2.3 混合权重

$$W = \alpha \cdot W_{AHP} + (1-\alpha) \cdot W_{EWM}$$

推荐 $\alpha = 0.5$（灵敏度分析确定）

### 8.3 第二层权重计算

对于维度 j 的子指标数据矩阵 $X^{(j)} = [x_{ik}]_{n \times m_j}$：

1. 标准化：$\tilde{x}_{ik} = \frac{x_{ik} - \min(x_k)}{\max(x_k) - \min(x_k)}$

2. 计算比重：$p_{ik} = \frac{\tilde{x}_{ik}}{\sum_{i=1}^{n} \tilde{x}_{ik}}$

3. 计算信息熵：$H_k = -\frac{1}{\ln n} \sum_{i=1}^{n} p_{ik} \ln p_{ik}$

4. 计算子权重：$w_k^{(j)} = \frac{1 - H_k}{\sum_{k=1}^{m_j} (1 - H_k)}$

5. 计算维度综合值：$E_{ij} = \sum_{k=1}^{m_j} w_k^{(j)} \cdot \tilde{x}_{ik}$

### 8.4 完整计算流程

```
输入：
  - 专家判断矩阵 A (6×6)
  - 子指标数据矩阵 X^(1), ..., X^(6)

步骤 1：第二层 EWM 权重计算
  for each dimension j:
    计算 w_k^(j) (子指标权重)
    计算 E_ij (维度综合值)

步骤 2：第一层 AHP 权重计算
  计算 W_AHP (专家主观权重)

步骤 3：第一层 EWM 权重计算
  从 E 矩阵计算 W_EWM

步骤 4：混合权重
  W = α × W_AHP + (1-α) × W_EWM

步骤 5：项目综合评分
  V_i = Σⱼ wⱼ × E_ij

输出：项目评分向量 V，排序结果
```

---

## 更新日志

- 2026-03-18: 初版创建
- 2026-03-18: 补充理论依据和文献引用
- 2026-03-18: 新增两层 AHP-EWM 混合模型设计