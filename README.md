# AI 专家技能库 (Agent Skills)

> 212+ 即插即用的 AI 专家角色，覆盖工程、设计、营销、学术等 18 个领域

[![GitHub stars](https://img.shields.io/github/stars/treexxx/agent_skill?style=social)](https://github.com/treexxx/agent_skill)
[![Skills Count](https://img.shields.io/badge/skills-212+-blue)](https://github.com/treexxx/agent_skill)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/treexxx/agent_skill/blob/main/LICENSE)

## 📖 简介

这是一个开源的 AI 专家技能库，包含 212+ 个即插即用的专家角色定义。每个技能都是一个独立的专家角色，可以让 AI 助手（如 Claude、Cursor、Windsurf 等）瞬间变身为特定领域的专家。

### ✨ 特点

- 🎯 **即插即用**：只需一键安装，无需复杂配置
- 🌐 **多工具支持**：支持 16 种主流 AI 编程工具
- 📚 **领域全面**：覆盖工程、设计、营销、学术等 18 个专业领域
- 🇨🇳 **中文优化**：专为中文用户设计，理解中国市场和语境
- 🔧 **持续更新**：社区驱动，不断添加新的专家角色 

## 📊 技能统计

| 领域 | 技能数量 | 说明 |
|------|---------|------|
| 工程开发 | 28 | 前端、后端、AI、安全、DevOps 等 |
| 市场营销 | 40 | 社交媒体、SEO、内容营销、红人营销等 |
| 游戏开发 | 15 | Unity、Unreal、游戏设计、QA 等 |
| 设计创意 | 9 | UI/UX、品牌、视觉叙事等 |
| 专项专家 | 25 | 提示词工程、销售、供应链等 |
| 学术研究 | 6 | 人类学、地理学、历史学等 |
| 产品管理 | 5 | 产品经理、MVP 规划、定价策略等 |
| 空间计算 | 5 | AR/VR、visionOS、XR 等 |
| 其他 | 64 | 金融、人力资源、法务、测试等 |

**总计**：212+ 个专家技能

## 🚀 快速开始

### 一键安装

```bash
git clone https://github.com/treexxx/agent_skill.git
cd agent_skill
./scripts/install.sh
```

安装脚本会自动：
1. 检测你已安装的 AI 工具
2. 选择要安装的智能体
3. 生成对应的集成文件（可选择只生成已安装工具的）
4. 安装到对应工具
5. 自动打开本地安装指南

安装目录统一放在 `~/.agent_skill/`：
```
~/.agent_skill/
├── index.html           # 本地安装指南
├── installed_tools.txt  # 已安装工具记录
└── integrations/        # 各工具的集成文件
```

重启 AI 工具使配置生效。

## 🛠️ 支持的工具

| 工具 | 状态 | 说明 |
|------|------|------|
| Claude Code | ✅ | Anthropic 官方 CLI 工具 |
| OpenClaw | ✅ | 开源 AI 编程助手 |
| Cursor | ✅ | AI-first 代码编辑器 |
| Trae | ✅ | 字节跳动 AI IDE |
| Windsurf | ✅ | Codeium 推出的 AI 编辑器 |
| Aider | ✅ | 命令行 AI 编程工具 |
| WorkBuddy | ✅ | 企业级 AI 编程助手 |
| Copilot | 🔄 | GitHub Copilot |
| Kiro | 🔄 | AWS AI 编程助手 |
| Qwen | 🔄 | 阿里云 AI 编程助手 |
| Codex | 🔄 | OpenAI 代码生成模型 |
| Gemini CLI | 🔄 | Google AI CLI 工具 |
| DeerFlow | 🔄 | 开源 AI 工作流工具 |
| Hermes Agent | 🔄 | 开源 AI Agent 框架 |
| Antigravity | 🔄 | AI 编程实验性工具 |
| OpenCode | 🔄 | 开源代码助手 |

✅ = 已支持，🔄 = 开发中

## 📚 技能使用示例

### 示例 1：召唤前端开发专家

```
用前端开发者模式帮我构建一个 React 组件，实现用户登录表单
```

### 示例 2：召唤品牌战略师

```
用品牌战略师思维帮我制定这个新消费品牌的市场定位策略
```

### 示例 3：召唤学术论文导师

```
用学术论文导师模式帮我优化这篇 AI 论文的论证结构
```

## 🤝 贡献指南

我们欢迎任何形式的贡献！

### 如何贡献新技能

1. Fork 本仓库
2. 创建你的技能分支 (`git checkout -b feature/new-skill`)
3. 提交你的修改 (`git commit -am 'Add new skill: XXX'`)
4. 推送到分支 (`git push origin feature/new-skill`)
5. 创建一个 Pull Request

### 技能文件格式

每个技能应该包含一个 `SKILL.md` 文件，格式如下：

```markdown
# 技能名称

## 角色定义
你是...

## 专业技能
- 技能1
- 技能2

## 工作方式
...

## 输出要求
...
```

## 📁 项目结构

```
agent_skill/
├── scripts/              # 安装和转换脚本
│   ├── install.sh        # 主安装脚本（交互式安装/卸载）
│   └── convert.sh        # 格式转换脚本
├── skills/               # 技能定义源文件（212+）
│   └── <领域>-<名称>/    # 每个技能一个目录
│       └── SKILL.md      # 技能定义
├── html/                 # 技能展示页面
├── integrations/         # 仓库级集成文件（模板）
└── README.md            # 本文件
```

> 安装后文件会复制到用户本地 `~/.agent_skill/` 目录

### 卸载智能体

```bash
./scripts/install.sh
```
选择 **2) 卸载已安装的智能体**，然后选择要卸载的工具。

或者单独卸载指定工具：
```bash
./scripts/install.sh --tool claude-code --uninstall
```

## 🌟 社区和资源

- **技能展示**：访问 [index.html](https://treexxx.github.io/agent_skill/) 查看所有技能
- **问题反馈**：[GitHub Issues](https://github.com/treexxx/agent_skill/issues)
- **讨论区**：[GitHub Discussions](https://github.com/treexxx/agent_skill/discussions)
- **项目示例**：访问  https://ai.squp.cn

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢所有贡献者的努力
- 基于 [agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) 项目启发
- 感谢开源社区的支持



⭐ 如果这个项目对你有帮助，请给它一个星标！
