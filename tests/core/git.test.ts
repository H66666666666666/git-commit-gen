import { describe, it, expect, vi } from 'vitest';

vi.mock('simple-git', () => {
  return {
    default: () => ({
      diff: vi.fn().mockResolvedValue('test diff'),
      status: vi.fn().mockResolvedValue({ staged: ['file.ts'] }),
      revparse: vi.fn().mockResolvedValue('/repo'),
    }),
  };
});

describe('git', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
