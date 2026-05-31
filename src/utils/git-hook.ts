import fs from 'node:fs';
import path from 'node:path';
import simpleGit from 'simple-git';

const git = simpleGit();

const HOOK_SCRIPT = `#!/bin/sh
# git-commit-gen hook
npx git-commit-gen --auto
`;

export async function installHook(): Promise<void> {
  const root = await git.revparse(['--show-toplevel']);
  const hooksDir = path.join(root, '.git', 'hooks');
  const hookFile = path.join(hooksDir, 'prepare-commit-msg');

  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  fs.writeFileSync(hookFile, HOOK_SCRIPT, { mode: 0o755 });
}

export async function uninstallHook(): Promise<void> {
  const root = await git.revparse(['--show-toplevel']);
  const hookFile = path.join(root, '.git', 'hooks', 'prepare-commit-msg');

  if (fs.existsSync(hookFile)) {
    const content = fs.readFileSync(hookFile, 'utf-8');
    if (content.includes('git-commit-gen')) {
      fs.unlinkSync(hookFile);
    }
  }
}

export async function isHookInstalled(): Promise<boolean> {
  try {
    const root = await git.revparse(['--show-toplevel']);
    const hookFile = path.join(root, '.git', 'hooks', 'prepare-commit-msg');

    if (fs.existsSync(hookFile)) {
      const content = fs.readFileSync(hookFile, 'utf-8');
      return content.includes('git-commit-gen');
    }
  } catch {
    // ignore
  }
  return false;
}
