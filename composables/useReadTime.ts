import readingTime from 'reading-time';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Composable for calculating estimated reading time from text content
 *
 * @param content - The text content (Markdown, HTML, or plain text)
 * @returns Reactive computed reading time information
 */
export const useReadTime = (content: MaybeRefOrGetter<string>) => {
  const stats = computed(() => {
    const text = toValue(content);

    if (!text || text.trim().length === 0) {
      return {
        text: '0 min read',
        minutes: 0,
        time: 0,
        words: 0,
      };
    }

    // Strip HTML/Markdown for more accurate word count
    const plainText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown images
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
      .replace(/[#*_`~]/g, '') // Remove markdown formatting
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    return readingTime(plainText);
  });

  return {
    /**
     * Human-readable reading time (e.g., "5 min read")
     */
    text: computed(() => stats.value.text),

    /**
     * Reading time in minutes (rounded)
     */
    minutes: computed(() => stats.value.minutes),

    /**
     * Reading time in milliseconds
     */
    time: computed(() => stats.value.time),

    /**
     * Word count
     */
    words: computed(() => stats.value.words),
  };
};
