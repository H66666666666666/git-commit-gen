import simpleGit from 'simple-git';

const git = simpleGit();

export interface CommitHistory {
  messages: string[];
  stats: {
    total: number;
    types: Record<string, number>;
    avgLength: number;
    mostUsedType: string;
    commonScopes: string[];
  };
}

export async function getCommitHistory(limit: number = 50): Promise<CommitHistory> {
  const log = await git.log({ maxCount: limit });
  const messages = log.all.map(commit => commit.message);

  const types: Record<string, number> = {};
  const scopes: Record<string, number> = {};
  let totalLength = 0;

  for (const msg of messages) {
    totalLength += msg.length;

    // 解析 type(scope): description
    const match = msg.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)/);
    if (match) {
      const [, type, scope] = match;
      types[type] = (types[type] || 0) + 1;
      if (scope) {
        scopes[scope] = (scopes[scope] || 0) + 1;
      }
    } else {
      types['unknown'] = (types['unknown'] || 0) + 1;
    }
  }

  // 找出最常用的 type
  let mostUsedType = 'unknown';
  let maxCount = 0;
  for (const [type, count] of Object.entries(types)) {
    if (count > maxCount) {
      maxCount = count;
      mostUsedType = type;
    }
  }

  // 找出最常见的 scope
  const commonScopes = Object.entries(scopes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([scope]) => scope);

  return {
    messages,
    stats: {
      total: messages.length,
      types,
      avgLength: Math.round(totalLength / messages.length),
      mostUsedType,
      commonScopes,
    },
  };
}

export function formatHistoryReport(history: CommitHistory): string {
  const { stats } = history;

  let report = `📊 Commit 历史分析报告\n`;
  report += `${'='.repeat(40)}\n\n`;

  report += `📈 总提交数: ${stats.total}\n`;
  report += `📏 平均信息长度: ${stats.avgLength} 字符\n`;
  report += `🏆 最常用类型: ${stats.mostUsedType}\n\n`;

  report += `📋 类型分布:\n`;
  const sortedTypes = Object.entries(stats.types).sort((a, b) => b[1] - a[1]);
  for (const [type, count] of sortedTypes) {
    const percentage = Math.round((count / stats.total) * 100);
    const bar = '█'.repeat(Math.round(percentage / 5));
    report += `  ${type.padEnd(12)} ${bar} ${count} (${percentage}%)\n`;
  }

  if (stats.commonScopes.length > 0) {
    report += `\n🎯 常见 Scope:\n`;
    for (const scope of stats.commonScopes) {
      report += `  - ${scope}\n`;
    }
  }

  report += `\n💡 风格建议:\n`;
  if (stats.avgLength > 50) {
    report += `  - 信息偏长，建议精简到 50 字符以内\n`;
  }
  if (stats.types['unknown'] && stats.types['unknown'] > stats.total * 0.3) {
    report += `  - 有 ${stats.types['unknown']} 条信息不符合 Conventional Commits 规范\n`;
  }
  if (stats.commonScopes.length === 0) {
    report += `  - 建议添加 scope 来更好地分类变更\n`;
  }

  return report;
}
