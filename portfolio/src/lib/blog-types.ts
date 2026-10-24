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
