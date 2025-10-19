/*===============================================
 * YouTube Utilities
 * ==============================================
 * Helper functions for working with YouTube URLs.
 * ==============================================
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, etc.
 * @param url - YouTube URL
 * @returns Video ID or null if not found
 */
export const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
