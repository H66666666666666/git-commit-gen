import { describe, it, expect } from 'vitest';
import { parseCommitMessage, isValidConventionalCommit, suggestFix } from '../../src/core/parser.js';

describe('parser', () => {
  describe('parseCommitMessage', () => {
    it('should extract valid conventional commit', () => {
      const input = 'feat(auth): add login functionality';
      expect(parseCommitMessage(input)).toBe('feat(auth): add login functionality');
    });

    it('should clean markdown code blocks', () => {
      const input = '```\nfeat: add feature\n```';
      expect(parseCommitMessage(input)).toBe('feat: add feature');
    });

    it('should return first line only', () => {
      const input = 'feat: add feature\n\nThis is a longer description';
      expect(parseCommitMessage(input)).toBe('feat: add feature');
    });
  });

  describe('isValidConventionalCommit', () => {
    it('should validate correct format', () => {
      expect(isValidConventionalCommit('feat: add feature')).toBe(true);
      expect(isValidConventionalCommit('fix(auth): resolve login issue')).toBe(true);
      expect(isValidConventionalCommit('docs: update README')).toBe(true);
    });

    it('should reject invalid format', () => {
      expect(isValidConventionalCommit('added feature')).toBe(false);
      expect(isValidConventionalCommit('FEAT: uppercase')).toBe(false);
    });
  });

  describe('suggestFix', () => {
    it('should suggest feat for add-related messages', () => {
      expect(suggestFix('add login feature')).toBe('feat: add login feature');
    });

    it('should suggest fix for bug-related messages', () => {
      expect(suggestFix('fix the login bug')).toBe('fix: the login bug');
    });

    it('should suggest docs for documentation', () => {
      expect(suggestFix('update README')).toBe('docs: update README');
    });

    it('should default to chore', () => {
      expect(suggestFix('random change')).toBe('chore: random change');
    });
  });
});
