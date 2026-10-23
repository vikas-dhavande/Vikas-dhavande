/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
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
      ],
    },
  ],
  experimental: {
    useCache: true,
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
