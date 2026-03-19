## ADDED Requirements

### Requirement: 系统可加载静态 JSON 数据

系统 SHALL 从 public/data/ 目录加载静态 JSON 数据文件。

#### Scenario: 加载配置文件
- **WHEN** 应用启动
- **THEN** 系统从 /data/config.json 加载全局配置

#### Scenario: 加载项目数据
- **WHEN** 进入项目评估页面
- **THEN** 系统从 /data/projects/*.json 加载项目数据

#### Scenario: 加载权重数据
- **WHEN** 进入权重分析页面
- **THEN** 系统从 /data/ahp/ 和 /data/ewm/ 加载权重数据

---

### Requirement: 系统支持数据格式验证

系统 SHALL 验证加载的 JSON 数据格式是否符合预期。

#### Scenario: 配置数据验证
- **WHEN** 加载 config.json
- **THEN** 系统验证必需字段（version、defaultAlpha、dimensions）存在且类型正确

#### Scenario: 项目数据验证
- **WHEN** 加载项目 JSON
- **THEN** 系统验证每个项目包含 id、name、indicators 字段

#### Scenario: 数据格式错误处理
- **WHEN** JSON 数据格式不符合预期
- **THEN** 系统在控制台输出错误信息并显示用户友好提示

---

### Requirement: 系统支持数据更新

系统 SHALL 支持通过替换 JSON 文件更新数据，无需修改代码。

#### Scenario: 更新项目数据
- **WHEN** 用户替换 /data/projects/ 目录下的 JSON 文件
- **THEN** 系统在下次加载时使用新数据

#### Scenario: 更新权重数据
- **WHEN** 用户替换 /data/ahp/ 或 /data/ewm/ 目录下的 JSON 文件
- **THEN** 系统在下次加载时使用新权重