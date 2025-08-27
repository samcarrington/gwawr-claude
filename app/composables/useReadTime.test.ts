import { describe, it, expect } from 'vitest';

describe('useReadTime', () => {
  it('should return composable with expected structure', async () => {
    const { useReadTime } = await import('~/composables/useReadTime');
    const readTime = useReadTime('test-slug');

    // Check that the composable returns the expected structure
    expect(readTime).toHaveProperty('text');
    expect(readTime).toHaveProperty('minutes');
    expect(readTime).toHaveProperty('time');
    expect(readTime).toHaveProperty('words');
    expect(readTime).toHaveProperty('pending');
    expect(readTime).toHaveProperty('error');
    expect(readTime).toHaveProperty('refresh');

    // Check that all properties are reactive refs/computed
    expect(readTime.text).toHaveProperty('value');
    expect(readTime.minutes).toHaveProperty('value');
    expect(readTime.time).toHaveProperty('value');
    expect(readTime.words).toHaveProperty('value');
    expect(readTime.pending).toHaveProperty('value');
  });

  it('should have default fallback values', async () => {
    const { useReadTime } = await import('~/composables/useReadTime');
    const readTime = useReadTime('nonexistent-slug');

    // These should be the fallback values when data is not available
    expect(typeof readTime.text.value).toBe('string');
    expect(typeof readTime.minutes.value).toBe('number');
    expect(typeof readTime.time.value).toBe('number');
    expect(typeof readTime.words.value).toBe('number');
    expect(typeof readTime.pending.value).toBe('boolean');
  });

  it('should handle different slug formats', async () => {
    const { useReadTime } = await import('~/composables/useReadTime');
    
    // Test with different slug formats
    const readTime1 = useReadTime('blog-post-1');
    const readTime2 = useReadTime('another-post');
    const readTime3 = useReadTime('');

    // All should return the same structure
    expect(readTime1).toHaveProperty('text');
    expect(readTime2).toHaveProperty('text');
    expect(readTime3).toHaveProperty('text');

    // All should have reactive values
    expect(readTime1.text).toHaveProperty('value');
    expect(readTime2.text).toHaveProperty('value');
    expect(readTime3.text).toHaveProperty('value');
  });
});
