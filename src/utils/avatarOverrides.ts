export function getProfilePicture(username: string, originalUrl: string, platform?: string, handle?: string): string {
  // Apply overrides ONLY for YouTube platform usernames or if the original URL is a Google User Content URL
  const isYoutube = platform === "youtube" || originalUrl.includes("googleusercontent.com") || originalUrl.includes("ggpht.com");
  
  if (isYoutube) {
    // Use the handle if available (removing the leading @ if present), or fall back to the username
    const target = (handle || username || "").trim().replace(/^@/, "");
    if (target) {
      return `https://unavatar.io/youtube/${target}`;
    }
  }
  
  return originalUrl;
}
