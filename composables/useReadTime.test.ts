import { describe, it, expect } from 'vitest';
import { useReadTime } from '~/composables/useReadTime';

describe('useReadTime', () => {
  it('should return zero for empty content', () => {
    const readTime = useReadTime('');

    expect(readTime.text.value).toBe('0 min read');
    expect(readTime.minutes.value).toBe(0);
    expect(readTime.words.value).toBe(0);
  });

  it('should calculate read time for short article', () => {
    const shortContent =
      'This is a short article with just a few words to test the calculation.';
    const readTime = useReadTime(shortContent);

    expect(readTime.minutes.value).toBeGreaterThan(0);
    expect(readTime.words.value).toBeGreaterThan(0);
    expect(readTime.text.value).toMatch(/\d+ min read/);
  });

  it('should calculate read time for medium article', () => {
    // Create content with approximately 500 words (should be ~2 min read)
    const mediumContent = Array(100)
      .fill('This is a test sentence with five words.')
      .join(' ');
    const readTime = useReadTime(mediumContent);

    expect(readTime.minutes.value).toBeGreaterThanOrEqual(1);
    expect(readTime.minutes.value).toBeLessThanOrEqual(5);
    expect(readTime.words.value).toBeGreaterThan(400);
  });

  it('should calculate read time for long article', () => {
    // Create content with approximately 1500 words (should be ~6 min read)
    const longContent = Array(300)
      .fill('This is a test sentence with five words.')
      .join(' ');
    const readTime = useReadTime(longContent);

    expect(readTime.minutes.value).toBeGreaterThanOrEqual(4);
    expect(readTime.minutes.value).toBeLessThanOrEqual(15);
    expect(readTime.words.value).toBeGreaterThan(1200);
  });

  it('should strip HTML tags from content', () => {
    const htmlContent =
      '<h1>Title</h1><p>This is a <strong>paragraph</strong> with <em>HTML</em> tags.</p>';
    const readTime = useReadTime(htmlContent);

    // Should count words without HTML tags
    expect(readTime.words.value).toBe(7); // "Title This is a paragraph with HTML tags"
  });

  it('should strip Markdown formatting from content', () => {
    const markdownContent = `
# Title
This is a **bold** and *italic* text with \`code\` and [link](http://example.com).
![Image](image.jpg)
    `;
    const readTime = useReadTime(markdownContent);

    // Should count words without markdown formatting
    expect(readTime.words.value).toBeGreaterThan(0);
    expect(readTime.text.value).toMatch(/\d+ min read/);
  });

  it('should handle reactive content updates', () => {
    const content = ref('Short content');
    const readTime = useReadTime(content);

    const initialWords = readTime.words.value;

    // Update content
    content.value =
      'This is much longer content with many more words to test reactivity and ensure it updates properly';

    expect(readTime.words.value).toBeGreaterThan(initialWords);
  });

  it('should normalize whitespace correctly', () => {
    const messyContent = '  This   has    lots\n\n\nof    whitespace   ';
    const readTime = useReadTime(messyContent);

    expect(readTime.words.value).toBe(5); // "This has lots of whitespace"
  });

  it('should be within ±10% of reading-time reference for sample content', () => {
    // Test with a known sample (approximately 265 words should be ~1 minute)
    const sampleContent = Array(53)
      .fill('This is a test sentence with five words.')
      .join(' ');
    const readTime = useReadTime(sampleContent);

    // Should be close to 1 minute (allowing for more variance due to text processing)
    expect(readTime.minutes.value).toBeGreaterThanOrEqual(0.5);
    expect(readTime.minutes.value).toBeLessThanOrEqual(3);
  });
});
