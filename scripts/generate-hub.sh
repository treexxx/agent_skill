#!/usr/bin/env bash
#
# generate-hub.sh -- 从所有技能目录自动生成统一入口 SKILL.md
#
# 用法：
#   ./scripts/generate-hub.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/skills"
OUTPUT="$SKILLS_DIR/SKILL.md"

# --- 颜色 ---
C_GREEN='\033[0;32m'; C_RESET='\033[0m'

echo "正在生成统一技能入口..."

# 分类关键词映射
DESIGN_KEYWORDS="design"
ACADEMIC_KEYWORDS="academic"
AGENT_KEYWORDS="agent"
TECH_KEYWORDS="blender|blockchain|data"
BUSINESS_KEYWORDS="accounts|compliance|corporate|automation"

# 生成 SKILL.md
cat > "$OUTPUT" << 'HEADER'
---
name: agent-skills-hub
description: 智能体技能中心，提供 200+ 专业领域专家技能的统一入口。
allowed-tools: Read Write Edit Bash Grep Glob
---

# 智能体技能中心

你是一个技能路由专家，可以根据用户需求精准调用对应的专业技能。

## 激活口令

当用户说以下任意口令时，立即激活专家模式：

- **"专家模式"**
- **"激活专家模式"**
- **"开启专家模式"**
- **"进入专家模式"**
- **"切换到专家模式"**
- **"我想用专家模式"**
- **"请以专家模式..."**
- **"用 XX 专家/角色/身份"**（如：用历史学家思维、用设计师视角）

激活后：
1. 根据用户需求从下方索引中匹配最合适的技能
2. 读取对应技能的 SKILL.md
3. 切换到专家身份执行任务

HEADER

# 按类别分组输出
for dir in "$SKILLS_DIR"/*/; do
  skill_name=$(basename "$dir")
  
  # 跳过汇总文件自身
  [[ "$skill_name" == "SKILL.md" ]] && continue
  
  # 读取描述
  desc=$(grep -m1 "^description:" "$dir/SKILL.md" 2>/dev/null | sed 's/^description: *//' || echo "未分类技能")
  
  # 确定类别
  category="其他"
  if [[ "$skill_name" =~ $DESIGN_KEYWORDS ]]; then
    category="设计类"
  elif [[ "$skill_name" =~ $ACADEMIC_KEYWORDS ]]; then
    category="学术研究类"
  elif [[ "$skill_name" =~ $AGENT_KEYWORDS ]]; then
    category="智能体协作类"
  elif [[ "$skill_name" =~ $TECH_KEYWORDS ]]; then
    category="技术工程类"
  elif [[ "$skill_name" =~ $BUSINESS_KEYWORDS ]]; then
    category="企业服务类"
  fi
  
  echo "| $skill_name | $desc |"
done >> "$OUTPUT"

# 添加调用说明
cat >> "$OUTPUT" << 'FOOTER'

## 调用方法

当用户请求使用某技能时：

1. **直接匹配**：如果用户提到具体技能名，直接读取对应 SKILL.md
   ```bash
   cat skills/<技能名>/SKILL.md
   ```

2. **关键词匹配**：根据用户意图匹配最合适的技能
   ```bash
   ls skills/ | grep -i "<关键词>"
   ```

3. **按需加载**：读取目标技能的完整内容后，按其规范执行任务
FOOTER

echo -e "${C_GREEN}✓${C_RESET} 已生成: $OUTPUT"
echo "  共 $(find "$SKILLS_DIR" -maxdepth 2 -name "SKILL.md" | grep -v "^$OUTPUT$" | wc -l | tr -d ' ') 个技能"
