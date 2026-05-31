import simpleGit from 'simple-git';
import type { GitDiff } from '../types.js';

const git = simpleGit();

export async function getStagedDiff(): Promise<GitDiff> {
  const diff = await git.diff(['--staged']);
  const diffStat = await git.diff(['--staged', '--stat']);

  const files = diffStat
    .split('\n')
    .filter(line => line.includes('|'))
    .map(line => line.split('|')[0].trim());

  const insertions = (diff.match(/^\+[^+]/gm) || []).length;
  const deletions = (diff.match(/^-[^-]/gm) || []).length;

  return {
    staged: diff,
    files,
    insertions,
    deletions,
  };
}

export async function isGitRepo(): Promise<boolean> {
  try {
    await git.status();
    return true;
  } catch {
    return false;
  }
}

export async function hasStagedChanges(): Promise<boolean> {
  const status = await git.status();
  return status.staged.length > 0;
}
