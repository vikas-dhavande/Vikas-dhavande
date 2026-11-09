export function resolveThumbnailSrc(thumbnail: string) {
  if (/^https?:\/\//i.test(thumbnail)) {
    return thumbnail;
  }

  return thumbnail.startsWith("/") ? thumbnail : `/${thumbnail}`;
}

export function resolveThumbnailUrl(
  thumbnail: string,
  toAbsolute: (path: string) => string,
) {
  if (/^https?:\/\//i.test(thumbnail)) {
    return thumbnail;
  }

  return toAbsolute(resolveThumbnailSrc(thumbnail));
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

