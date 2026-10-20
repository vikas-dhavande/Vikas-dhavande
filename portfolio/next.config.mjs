/** @type {import('next').NextConfig} */
const nextConfig = {
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
