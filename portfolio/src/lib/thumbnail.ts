const ALLOWED_THUMBNAIL_DOMAINS = [
  "cloud.appwrite.io",
  "appwrite.io",
  "images.unsplash.com",
  "avatars.githubusercontent.com",
  "raw.githubusercontent.com",
];

function isAllowedExternalUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_THUMBNAIL_DOMAINS.some(
      (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

export function resolveThumbnailSrc(thumbnail: string): string | undefined {
  if (!thumbnail || typeof thumbnail !== "string") return undefined;
  const trimmed = thumbnail.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return isAllowedExternalUrl(trimmed) ? trimmed : undefined;
  }

  // Reject traversal or script injections in relative paths
  if (trimmed.includes("..") || trimmed.includes(":") || trimmed.includes("//")) {
    return undefined;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function resolveThumbnailUrl(
  thumbnail: string,
  toAbsolute: (path: string) => string,
): string | undefined {
  const resolved = resolveThumbnailSrc(thumbnail);
  if (!resolved) return undefined;

  if (/^https:\/\//i.test(resolved)) {
    return resolved;
  }

  return toAbsolute(resolved);
}

export function getPostThumbnail(post: {
  thumbnail?: string;
  ogImage?: string;
  coverImage?: string;
}) {
  return post.thumbnail ?? post.coverImage ?? post.ogImage;
}

/** Cover shown on the post page — custom thumbnail or placeholder. */
export function getPostCoverSrc(post: {
  slug: string;
  thumbnail?: string;
  ogImage?: string;
  coverImage?: string;
}) {
  const custom = getPostThumbnail(post);
  if (custom) return resolveThumbnailSrc(custom);
  return undefined;
}


