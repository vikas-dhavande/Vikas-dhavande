import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { connection } from "next/server";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: string;
  views: number;
}

export interface UserItem {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: "active" | "away" | "offline";
  lastActive: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  updatedAt: string;
}

export interface StockTickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  timestamp: string;
}

// Initial in-memory mock datasets
const mockPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Mastering Next.js Cache Components and 'use cache'",
    summary: "Discover how Next.js unifies data-level and UI-level caching into a single directive with Partial Prerendering.",
    category: "Architecture",
    author: "Elena Rostova",
    publishedAt: "2026-10-18T09:00:00Z",
    views: 1420,
  },
  {
    id: "post-2",
    title: "Streaming Uncached Data with React 19 Suspense",
    summary: "Why blocking the entire route is a thing of the past. Ship a static shell instantly and stream dynamic slots.",
    category: "Performance",
    author: "Marcus Chen",
    publishedAt: "2026-10-19T14:30:00Z",
    views: 980,
  },
  {
    id: "post-3",
    title: "Instant Navigation & Partial Prefetching in Production",
    summary: "How link hover prefetching resolves the App Shell and runtime search params before the user even clicks.",
    category: "UX & Routing",
    author: "Sophia Dubois",
    publishedAt: "2026-10-20T08:15:00Z",
    views: 654,
  },
];

const mockUsers: UserItem[] = [
  {
    id: "usr-1",
    name: "Alex Vance",
    role: "Lead Systems Architect",
    email: "alex.vance@blackmesa.internal",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active",
    lastActive: "Just now",
  },
  {
    id: "usr-2",
    name: "Dr. Gordon Freeman",
    role: "Research Scientist",
    email: "gordon@blackmesa.internal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "away",
    lastActive: "5 mins ago",
  },
  {
    id: "usr-3",
    name: "Alyx Williams",
    role: "Security & Cache Governor",
    email: "alyx@whiteforest.io",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "active",
    lastActive: "Just now",
  },
];

const mockProducts: ProductItem[] = [
  {
    id: "prod-1",
    name: "Next.js 15 Pro Enterprise Suite",
    slug: "nextjs-15-pro",
    category: "Framework Tools",
    price: 499,
    stock: 28,
    rating: 4.9,
    description: "Production-ready runtime engine with Partial Prerendering, Cache Components, and distributed remote cache handlers.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Edge Cache CDN Accelerators",
    slug: "edge-cache-cdn",
    category: "Infrastructure",
    price: 249,
    stock: 14,
    rating: 4.8,
    description: "Zero-latency worldwide edge nodes optimized for RSC payload streaming and instant App Shell delivery.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Turbopack Build Optimizer",
    slug: "turbopack-optimizer",
    category: "Developer Tooling",
    price: 189,
    stock: 82,
    rating: 4.7,
    description: "Ultra-fast incremental compilation toolchain designed for massive Next.js App Router applications.",
    updatedAt: new Date().toISOString(),
  },
];

// -------------------------------------------------------------
// 1. DATA-LEVEL CACHING
// -------------------------------------------------------------
export async function getCachedUsers() {
  "use cache";
  cacheLife("hours");
  cacheTag("users");

  // Simulated DB latency
  await new Promise((resolve) => setTimeout(resolve, 80));

  return {
    users: mockUsers,
    fetchedAt: new Date().toISOString(),
    formattedTime: new Intl.DateTimeFormat("en-US", {
      timeStyle: "medium",
      dateStyle: "medium",
    }).format(new Date()),
    source: "Data-level cache ('use cache' + cacheTag('users'))",
  };
}

export async function getCachedPosts() {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    posts: mockPosts,
    fetchedAt: new Date().toISOString(),
    formattedTime: new Intl.DateTimeFormat("en-US", {
      timeStyle: "medium",
      dateStyle: "medium",
    }).format(new Date()),
    source: "Data-level cache ('use cache' + cacheTag('posts'))",
  };
}

export async function getCachedProductBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`product-${slug}`, "products");

  await new Promise((resolve) => setTimeout(resolve, 90));

  const product = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
  return {
    product,
    fetchedAt: new Date().toISOString(),
    formattedTime: new Intl.DateTimeFormat("en-US", {
      timeStyle: "medium",
      dateStyle: "medium",
    }).format(new Date()),
  };
}

export async function searchProducts(query: string) {
  "use cache";
  cacheLife("seconds");
  cacheTag("search");

  await new Promise((resolve) => setTimeout(resolve, 60));

  const q = (query || "").toLowerCase().trim();
  const filtered = q
    ? mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    : mockProducts;

  return {
    results: filtered,
    query,
    count: filtered.length,
    cachedAt: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// 2. PASSING RUNTIME VALUES TO CACHED FUNCTIONS
// -------------------------------------------------------------
export async function getCachedUserProfile(sessionId: string) {
  "use cache";
  // The argument sessionId automatically becomes part of the cache key!
  cacheLife("minutes");
  cacheTag(`profile-${sessionId}`);

  await new Promise((resolve) => setTimeout(resolve, 75));

  const isVip = sessionId.includes("vip");
  return {
    sessionId,
    tier: isVip ? "Platinum Enterprise VIP" : "Standard Developer",
    quotaRemaining: isVip ? 99999 : 500,
    featuresEnabled: isVip
      ? ["Unlimited Instant Prefetching", "Distributed Remote Cache", "Prioritized Edge Streaming"]
      : ["Standard Shell Cache", "In-Memory Instance Store"],
    lastEvaluatedAt: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// 3. CACHED RANDOM VALUES & TIMESTAMPS
// -------------------------------------------------------------
export async function getCachedTimestamp() {
  "use cache";
  cacheLife("minutes");
  cacheTag("timestamp-cached");

  const buildOrCacheId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  return {
    id: buildOrCacheId,
    timestamp,
    readable: new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    }).format(new Date()),
  };
}

// -------------------------------------------------------------
// 4. UNCACHED STREAMING DYNAMIC DATA (with connection())
// -------------------------------------------------------------
export async function getUncachedLiveStockTicker(): Promise<StockTickerItem[]> {
  // Fresh on every single request; never cached
  await connection();
  // Simulated network latency to showcase streaming Suspense fallback UI
  await new Promise((resolve) => setTimeout(resolve, 700));

  const now = new Date();
  const jitter = (base: number) => {
    const delta = (Math.random() - 0.48) * 4;
    return Number((base + delta).toFixed(2));
  };

  return [
    {
      symbol: "NEXT",
      name: "Next.js Core Inc.",
      price: jitter(342.5),
      change: Number((Math.random() * 4 - 1.5).toFixed(2)),
      timestamp: now.toISOString(),
    },
    {
      symbol: "PPR",
      name: "Partial Prerender Global",
      price: jitter(128.9),
      change: Number((Math.random() * 3.2 - 0.8).toFixed(2)),
      timestamp: now.toISOString(),
    },
    {
      symbol: "RSC",
      name: "React Server Components",
      price: jitter(214.3),
      change: Number((Math.random() * 5 - 2.1).toFixed(2)),
      timestamp: now.toISOString(),
    },
  ];
}

export async function getUncachedRequestTimestamp() {
  // connection() signals to Next.js that this must evaluate at request time
  await connection();
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  return {
    id: requestId,
    timestamp,
    readable: new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    }).format(new Date()),
  };
}

// -------------------------------------------------------------
// 5. PREDICTABLE VALUES (Module Scope / Synchronous I/O)
// -------------------------------------------------------------
export const APP_MANIFEST_CONSTANTS = {
  name: "Next.js Cache Components Studio",
  version: "15.5.0-canary / 16-aligned",
  cachingModel: "Cache Components + Partial Prerendering (PPR)",
  defaultCacheLife: "default (stale: 5m, revalidate: 15m, expire: 24h)",
  supportedProfiles: ["seconds", "minutes", "hours", "days", "max"],
  evalStrategy: "Server Component Serialization into RSC Payload",
};
