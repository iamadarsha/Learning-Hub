export const THUMBNAIL_PALETTES = [
  { bg: "#E8D5FF", text: "#5B21B6" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#FFE4CC", text: "#92400E" },
  { bg: "#FCE7F3", text: "#9D174D" },
] as const;

export function getThumbnailPalette(thumbnailUrl: string | null | undefined) {
  if (!thumbnailUrl || !thumbnailUrl.startsWith("preset:")) return null;
  const index = parseInt(thumbnailUrl.replace("preset:", ""), 10);
  return THUMBNAIL_PALETTES[index] ?? THUMBNAIL_PALETTES[0];
}
