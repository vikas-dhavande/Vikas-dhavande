export interface Author {
  name: string;
  role?: string;
  avatar?: string;
}

export type TOCHeading = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export type BlogPost = {
  $id?: string;
  slug: string;
  segments: string[];
  href: string;
  title: string;
  description: string;
  excerpt?: string;
  author: Author;
  inspiredBy?: string;
  date: string;
  publishedAt?: string;
  readingTime: string;
  readTimeMinutes?: number;
  isNew?: boolean;
  ogImage?: string;
  thumbnail?: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  status?: "published" | "draft";
  markdown: string;
  content?: string;
  headings: TOCHeading[];
};

export type BlogNavItem = {
  title: string;
  href: string;
  isNew?: boolean;
};

export type BlogCategory = {
  slug: string;
  name: string;
  items: BlogNavItem[];
};

export type BlogLink = {
  title: string;
  href: string;
  category: string;
  description: string;
  searchText: string;
};

export interface BlogReaction {
  likes: number;
  rockets: number;
  hearts: number;
  ideas: number;
  userReactions: string[]; // Reactions active for the current user (e.g. ['like', 'rocket'])
}

export interface BlogComment {
  id: string;
  postSlug: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface BlogFilterOptions {
  category?: string;
  search?: string;
  tag?: string;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}
