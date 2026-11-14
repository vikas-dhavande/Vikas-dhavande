/** @type {import('next').NextConfig} */
const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://*.appwrite.io https://cloud.appwrite.io https://avatars.githubusercontent.com https://images.unsplash.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://*.appwrite.io https://*.cloud.appwrite.io https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com;
  media-src 'self' https:;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig = {
  compress: true,
  serverExternalPackages: ["node-appwrite"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/:all*(svg|jpg|png|webp|avif|ico|woff2)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: contentSecurityPolicy,
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@phosphor-icons/react",
      "@hugeicons/react",
      "motion",
      "recharts",
      "three",
    ],
    useCache: true,
    serverActions: {
      bodySizeLimit: "1mb",
    },
    cacheLife: {
      seconds: {
        stale: 5,
        revalidate: 10,
        expire: 60,
      },
      minutes: {
        stale: 60,
        revalidate: 120,
        expire: 3600,
      },
      hours: {
        stale: 3600,
        revalidate: 7200,
        expire: 86400,
      },
    },
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
