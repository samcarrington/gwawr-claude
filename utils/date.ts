/**
 * Format a date string to a human-readable format
 * @param dateString - The date string to format (e.g., '2024-12-15')
 * @returns Formatted date string (e.g., 'December 15, 2024')
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
