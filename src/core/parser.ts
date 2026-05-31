const CONVENTIONAL_COMMIT_REGEX =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)(\(.+\))?!?: .{1,72}$/;

export function parseCommitMessage(message: string): string {
  const cleaned = message
    .trim()
    .replace(/^```.*\n?/gm, '')
    .replace(/\n```$/m, '')
    .trim();

  const lines = cleaned.split('\n');
  const firstLine = lines[0]?.trim() || '';

  if (CONVENTIONAL_COMMIT_REGEX.test(firstLine)) {
    return firstLine;
  }

  return firstLine;
}

export function isValidConventionalCommit(message: string): boolean {
  return CONVENTIONAL_COMMIT_REGEX.test(message);
}

export function suggestFix(message: string): string {
  const lower = message.toLowerCase();

  let type = 'chore';
  if (lower.includes('fix') || lower.includes('bug')) type = 'fix';
  else if (lower.includes('add') || lower.includes('feat')) type = 'feat';
  else if (lower.includes('doc') || lower.includes('readme')) type = 'docs';
  else if (lower.includes('refactor')) type = 'refactor';
  else if (lower.includes('test')) type = 'test';
  else if (lower.includes('style') || lower.includes('format')) type = 'style';
  else if (lower.includes('perf') || lower.includes('optimize')) type = 'perf';

  const description = message
    .replace(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)[:(]?/i, '')
    .trim();

  return `${type}: ${description}`;
}
