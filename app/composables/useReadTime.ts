import { type MaybeRefOrGetter } from 'vue';

interface ReadTimeStats {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

/**
 * Composable for fetching pre-calculated reading time from API
 *
 * @param slug - The blog post slug
 * @returns Reactive reading time information fetched from server
 */
export const useReadTime = (slug: MaybeRefOrGetter<string>) => {
  const { data: stats, error, pending, refresh } = useFetch<ReadTimeStats>(
    () => `/api/blog/reading-time/${toValue(slug)}`,
    {
      key: `reading-time-${toValue(slug)}`,
      default: () => ({
        text: '0 min read',
        minutes: 0,
        time: 0,
        words: 0,
      }),
      // Cache on client for 1 hour
      server: true,
      client: true,
    }
  );

  return {
    /**
     * Human-readable reading time (e.g., "5 min read")
     */
    text: computed(() => stats.value?.text || '0 min read'),

    /**
     * Reading time in minutes (rounded)
     */
    minutes: computed(() => stats.value?.minutes || 0),

    /**
     * Reading time in milliseconds
     */
    time: computed(() => stats.value?.time || 0),

    /**
     * Word count
     */
    words: computed(() => stats.value?.words || 0),

    /**
     * Loading state
     */
    pending,

    /**
     * Error state
     */
    error,

    /**
     * Refresh function to refetch data
     */
    refresh,
  };
};
