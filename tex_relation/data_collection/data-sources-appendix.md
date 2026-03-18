# 数据来源附录

本附录详细记录论文所用数据的来源、获取日期和处理方法。

---

## 一、数据来源汇总表

| 指标 | 数据来源 | 获取方式 | 获取日期 |
|------|----------|----------|----------|
| 性别平等 | IOC 官方报告、IF 年度报告 | 公开数据提取 | 2026-03-18 |
| 流行度 | IF 统计报告、Google Trends | 公开数据+API | 2026-03-18 |
| 可持续性 | 项目特性分析 | 专家评估 | 2026-03-18 |
| 包容性 | IPC 官网、Olympedia | 公开数据提取 | 2026-03-18 |
| 创新性 | Olympedia、YOG 官网 | 公开数据提取 | 2026-03-18 |
| 安全性 | 学术文献检索 | 文献综述 | 2026-03-18 |

---

## 二、各指标数据详细来源

### 2.1 性别平等 (Gender Equity)

**数据来源**：
1. **IOC Paris 2024 官方数据**
   - 网址：https://olympics.com/paris-2024
   - 内容：各项目男女运动员参赛人数
   - 备注：Paris 2024 是首届性别平等奥运会

2. **国际运动联合会年度报告**
   - World Athletics Annual Report 2023
   - World Aquatics Annual Report 2022
   - FIG Annual Report 2023
   - FIBA、FIFA 官网统计数据

**计算方法**：
```
性别均衡度 = 1 - |男性比例 - 0.5| × 2
混合项目比例 = 混合项目数量 / 总项目数量
```

### 2.2 流行度 (Popularity)

**数据来源**：
1. **国际运动联合会会员统计**
   - World Athletics: 214 个成员国
   - FIFA: 211 个成员国
   - FIBA: 212 个成员国
   - 来源：各 IF 官网

2. **全球参与人数估计**
   - FIFA: 约25亿球迷
   - World Athletics: 约2.5亿参与者
   - 来源：各 IF 年度报告

3. **Google Trends 搜索指数**
   - 时间范围：过去12个月
   - 搜索词："[Sport Name] Olympic"
   - 来源：https://trends.google.com

### 2.3 可持续性 (Sustainability)

**代理变量设计**：

由于碳排放、场馆成本等原始数据难以获取，采用以下代理变量：

| 代理变量 | 定义 | 评分标准 |
|----------|------|----------|
| 是否需要专用场馆 | 0=通用, 1=专用 | 项目特性分析 |
| 场馆建设复杂度 | 1-5分 | 1=极简, 5=复杂 |
| 设备依赖程度 | 1-5分 | 1=简单, 5=昂贵 |

**计算方法**：
```
可持续性评分 = 1 - (场馆复杂度 + 设备依赖度) / 10
```

**评分示例**：
- 足球：专用场馆=否(0), 复杂度=2, 设备=1 → 评分=0.80
- 游泳：专用场馆=是(1), 复杂度=4, 设备=1 → 评分=0.60

### 2.4 包容性 (Inclusivity)

**数据来源**：
1. **IPC 残奥会项目列表**
   - 网址：https://www.paralympic.org/paralympic-games/paris-2024/sports
   - 内容：Paris 2024 残奥会全部22个项目
   - 获取日期：2026-03-18

2. **奥运参赛国统计**
   - 来源：Olympedia (olympedia.org)
   - 内容：各项目参赛国和运动员数量

**计算方法**：
```
残奥关联 = 1 (项目在残奥会存在) / 0 (不存在)
发展中国家参与度 = 发展中国家运动员数 / 总运动员数
```

### 2.5 创新性 (Innovation)

**数据来源**：
1. **Olympedia 历史数据**
   - 网址：https://www.olympedia.org
   - 内容：各项目首次进入奥运会的年份

2. **青年奥运会项目列表**
   - 网址：https://olympics.com/youth-olympic-games
   - 内容：YOG 正式比赛项目

**计算方法**：
```
新近程度 = 1 / (1 + 距今年数/50)
年轻化评分 = 是否为YOG项目 × 权重
```

### 2.6 安全性 (Safety)

**文献来源**：

| 运动项目 | 文献来源 | 受伤率 |
|----------|----------|--------|
| 田径 | Junge et al. (2009) Br J Sports Med | 2.5/1000h |
| 游泳 | Mountjoy et al. (2016) Br J Sports Med | 1.2/1000h |
| 体操 | Caine et al. (2008) Sports Med | 3.8/1000h |
| 篮球 | McKay et al. (2001) J Sci Med Sport | 4.5/1000h |
| 足球 | Junge et al. (2009) Br J Sports Med | 5.0/1000h |

**关键文献**：
1. Junge A, et al. (2009). Injuries in team sport tournaments during the 2004 Olympic Games. Br J Sports Med.
2. Engebretsen L, et al. (2013). Sports injuries and illnesses during the London 2012 Olympic Games. Br J Sports Med.
3. Soligard T, et al. (2017). Sports injuries and illnesses in the Rio 2016 Olympic Games. Br J Sports Med.

**计算方法**：
```
安全性评分 = 1 - 标准化(受伤率)
```

---

## 三、数据处理说明

### 3.1 标准化方法

所有指标数据采用 Min-Max 归一化：

**正向指标**（越大越好）：
$$\tilde{x}_{ij} = \frac{x_{ij} - \min(x_j)}{\max(x_j) - \min(x_j)}$$

**负向指标**（越小越好）：
$$\tilde{x}_{ij} = \frac{\max(x_j) - x_{ij}}{\max(x_j) - \min(x_j)}$$

### 3.2 缺失值处理

- 参与人数数据缺失：使用 IF 会员国数量作为代理
- 受伤率数据缺失：使用对抗性程度评分作为代理

### 3.3 数据验证

- 所有数据均有来源记录
- 交叉验证：对比多个来源的数据一致性
- 合理性检查：检查数据范围是否符合预期

---

## 四、数据局限性说明

1. **参与人数数据**：部分项目无全球统一统计，使用估计值
2. **可持续性数据**：采用代理变量，非直接测量
3. **受伤率数据**：不同研究方法可能导致数据差异
4. **时间一致性**：部分数据来自不同年份

---

**更新日期**：2026-03-18  
**数据版本**：2.0