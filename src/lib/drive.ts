export function getDriveEmbedUrl(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return null;
}

export function getDriveThumbnailUrl(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
  }
  return null;
}
