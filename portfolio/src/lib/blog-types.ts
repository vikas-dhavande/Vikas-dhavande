export interface Author {
  name: string;
  role: string;
  avatar?: string;
}

export interface BlogPost {
  $id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  coverImage?: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: "Aerospace Avionics" | "Embedded Systems" | "HIL Simulation" | "RTOS & Firmware" | "Hardware Design" | string;
  tags: string[];
  featured?: boolean;
  status?: "published" | "draft";
}

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
