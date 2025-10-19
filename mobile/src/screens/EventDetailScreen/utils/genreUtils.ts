/**
 * Maps genre names to their corresponding color codes
 * Used for genre chips/badges throughout the app
 */
export const getGenreColor = (genre: string): string => {
  const genreLower = genre.toLowerCase();

  if (genreLower.includes("action")) return "#ef4444"; // Red
  if (genreLower.includes("adventure")) return "#f59e0b"; // Amber
  if (genreLower.includes("comedy")) return "#fbbf24"; // Yellow
  if (genreLower.includes("drama")) return "#8b5cf6"; // Purple
  if (genreLower.includes("sci-fi") || genreLower.includes("science fiction"))
    return "#06b6d4"; // Cyan
  if (genreLower.includes("horror")) return "#dc2626"; // Dark red
  if (genreLower.includes("thriller")) return "#7c3aed"; // Violet
  if (genreLower.includes("romance")) return "#ec4899"; // Pink
  if (genreLower.includes("fantasy")) return "#a855f7"; // Purple
  if (genreLower.includes("mystery")) return "#6366f1"; // Indigo
  if (genreLower.includes("animation")) return "#10b981"; // Green
  if (genreLower.includes("documentary")) return "#0ea5e9"; // Blue

  return "#46D4AF"; // Default - Turquoise from palette
};
