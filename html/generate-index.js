const fs = require('fs');
const path = require('path');

const SKILL_DIR = path.resolve(__dirname, '../skills');
const INDEX_HTML = path.join(__dirname, 'index.html');

// 从目录名前缀推断 category
function inferCategory(dirName) {
  const rules = [
    ['marketing-', 'marketing'],
    ['paid-media-', 'marketing'],
    ['engineering-', 'engineering'],
    ['design-', 'design'],
    ['academic-', 'academic'],
    ['game-', 'game'],
    ['finance-', 'finance'],
    ['hr-', 'hr'],
    ['legal-', 'legal'],
    ['product-', 'product'],
    ['project-management-', 'product'],
    ['sales-', 'specialized'],
    ['specialized-', 'specialized'],
    ['spatial-', 'spatial'],
    ['supply-chain-', 'specialized'],
    ['support-', 'specialized'],
    ['testing-', 'specialized'],
    ['unity-', 'game'],
    ['unreal-', 'game'],
    ['visionos-', 'spatial'],
    ['xr-', 'spatial'],
    ['zk-', 'specialized'],
    ['roblox-', 'game'],
    ['godot-', 'game'],
    ['macos-spatial-', 'spatial'],
    ['lsp-', 'engineering'],
    ['terminal-', 'engineering'],
    ['blockchain-', 'specialized'],
    ['agentic-', 'specialized'],
    ['agents-', 'specialized'],
    ['automation-', 'specialized'],
    ['compliance-', 'legal'],
    ['corporate-', 'hr'],
    ['data-consolidation-', 'specialized'],
    ['identity-graph-', 'specialized'],
    ['report-distribution-', 'specialized'],
    ['recruitment-', 'hr'],
    ['technical-artist-', 'game'],
    ['technical-translator-', 'specialized'],
    ['healthcare-', 'specialized'],
    ['hospitality-', 'specialized'],
    ['real-estate-', 'specialized'],
    ['study-abroad-', 'academic'],
    ['language-translator-', 'specialized'],
    ['government-', 'specialized'],
    ['gaokao-', 'academic'],
    ['narrative-designer', 'game'],
    ['prompt-engineer', 'specialized'],
    ['level-designer', 'game'],
    ['accounts-payable-agent', 'finance'],
    ['loan-officer-assistant', 'finance'],
    ['retail-customer-returns', 'specialized'],
    ['guizang-ppt-skill', 'design'],
  ];
  for (const [prefix, cat] of rules) {
    if (dirName === prefix || dirName.startsWith(prefix)) return cat;
  }
  return 'specialized';
}

function defaultIcon(category) {
  const map = {
    engineering: '⚙️',
    design: '🎨',
    marketing: '📣',
    product: '📋',
    academic: '🎓',
    game: '🎮',
    finance: '💰',
    hr: '👥',
    legal: '⚖️',
    spatial: '🥽',
    specialized: '🔧',
  };
  return map[category] || '📦';
}

function parseSkillMd(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = { title: '', description: '', icon: '', activation: '', category: '' };

  // 提取 front matter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    for (const line of fmMatch[1].split('\n')) {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        if (key === 'name') result.name = val;
        if (key === 'description') result.description = val;
        if (key === 'icon') result.icon = val;
        if (key === 'category') result.category = val;
        if (key === 'activation') result.activation = val;
      }
    }
  }

  // 提取 H1 标题（在 front matter 之后，找第一个 # 开头的行）
  const body = content.replace(/^---\n[\s\S]*?\n---/, '');
  const h1Matches = body.match(/^# (.+)$/gm);
  if (h1Matches && h1Matches.length > 0) {
    // 跳过模板类标题，取第一个看起来像真正标题的 H1
    const skipTitles = [
      '你的身份与记忆', '你的身份', '沟通风格', '关键规则', '核心使命',
      '你的沟通风格', '必须遵守的关键规则', '技术交付物', '工作流程',
      '成功指标', '你的核心使命', '你的关键规则'
    ];
    let foundTitle = null;
    for (const h of h1Matches) {
      const t = h.replace(/^# /, '').trim();
      if (!skipTitles.includes(t) && !t.startsWith('你的') && t.length > 2 && t.length < 30) {
        foundTitle = t;
        break;
      }
    }
    if (!foundTitle) {
      // 所有 H1 都是模板文字，尝试从 description 提取标题
      foundTitle = extractTitleFromDescription(result.description);
      if (!foundTitle) foundTitle = h1Matches[0].replace(/^# /, '').trim();
    }
    result.title = foundTitle;
  } else {
    // 没有 H1，从 description 提取
    result.title = extractTitleFromDescription(result.description) || '';
  }

  return result;
}

function main() {
  // 读取现有 HTML
  const existingHtml = fs.readFileSync(INDEX_HTML, 'utf8');

  // 从现有 HTML 的 skills 数组中提取补充数据（icon、title、activation 等）
  const existingSkills = {};
  const skillsArrayMatch = existingHtml.match(/const skills = \[([\s\S]*?)\n        \];/);
  if (skillsArrayMatch) {
    // 用正则逐个提取对象字段
    const objSrc = skillsArrayMatch[1];
    // 匹配每个 { ... } 块
    const objRegex = /\{\s*name:\s*"([^"]*)"\s*,\s*icon:\s*"([^"]*)"\s*,\s*category:\s*"([^"]*)"\s*,\s*title:\s*"([^"]*)"\s*,\s*desc:\s*"([^"]*)"\s*,\s*activation:\s*"([^"]*)"\s*\}/g;
    let m;
    while ((m = objRegex.exec(objSrc)) !== null) {
      existingSkills[m[1]] = {
        icon: m[2],
        category: m[3],
        title: m[4],
        desc: m[5],
        activation: m[6],
      };
    }
  }
  console.log('从现有 HTML 读取了 ' + Object.keys(existingSkills).length + ' 个技能的补充数据');

  // 扫描所有技能目录
  const dirs = fs.readdirSync(SKILL_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  const skills = [];
  for (const dir of dirs) {
    const skillMdPath = path.join(SKILL_DIR, dir, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) continue;

    const parsed = parseSkillMd(skillMdPath);
    const existing = existingSkills[dir] || {};

    const category = parsed.category || existing.category || inferCategory(dir);
    const title = parsed.title || existing.title || parsed.name || dir;
    const icon = parsed.icon || existing.icon || defaultIcon(category);
    const desc = parsed.description || existing.desc || '';
    const activation = parsed.activation || existing.activation || '用' + title + '模式帮我完成这个任务';

    skills.push({
      name: dir,
      icon: icon,
      category: category,
      title: title,
      desc: desc,
      activation: activation,
    });
  }

  console.log('共扫描到 ' + skills.length + ' 个技能');

  // 按 category 统计
  const categoryCount = {};
  for (const s of skills) {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
  }
  console.log('分类统计: ' + JSON.stringify(categoryCount));

  // 生成 skills 数组 JS 代码（注意转义）
  const lines = skills.map(function(s) {
    const descEscaped = s.desc.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const actEscaped = s.activation.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return '            {name: "' + s.name + '", icon: "' + s.icon + '", category: "' + s.category + '", title: "' + s.title + '", desc: "' + descEscaped + '", activation: "' + actEscaped + '"}';
  });

  const skillsBlock = '        const skills = [\n' + lines.join(',\n') + '\n        ];';

  // 替换 HTML 中的 skills 数组
  const newHtml = existingHtml.replace(
    /const skills = \[[\s\S]*?\n        \];/,
    skillsBlock
  );

  // 更新分类 tab 数量（使用 new RegExp 避免正则字面量中的 / 问题）
  const labelMap = {
    engineering: '工程开发',
    design: '设计创意',
    marketing: '市场营销',
    product: '产品管理',
    academic: '学术研究',
    game: '游戏开发',
    finance: '金融财务',
    hr: '人力资源',
    legal: '法务合规',
    spatial: '空间计算',
    specialized: '专项专家',
  };

  let updatedHtml = newHtml;
  for (const [cat, count] of Object.entries(categoryCount)) {
    const label = labelMap[cat];
    if (label) {
      const re = new RegExp('data-category="' + cat + '">' + label + '<span class="count">[0-9]+</span>', 'g');
      updatedHtml = updatedHtml.replace(
        re,
        'data-category="' + cat + '">' + label + '<span class="count">' + count + '</span>'
      );
    }
  }

  // 更新"全部"数量
  updatedHtml = updatedHtml.replace(
    /data-category="all">全部<span class="count">[0-9]+<\/span>/,
    'data-category="all">全部<span class="count">' + skills.length + '</span>'
  );

  // 更新统计数字（智能体总数）
  updatedHtml = updatedHtml.replace(
    /<div class="stat-value">[0-9]+<\/div>\n\s*<div class="stat-label">智能体总数<\/div>/,
    '<div class="stat-value">' + skills.length + '</div>\n                <div class="stat-label">智能体总数</div>'
  );

  fs.writeFileSync(INDEX_HTML, updatedHtml, 'utf8');
  console.log('已更新 ' + INDEX_HTML);
  console.log('总计 ' + skills.length + ' 个技能写入完成');
}

main();
