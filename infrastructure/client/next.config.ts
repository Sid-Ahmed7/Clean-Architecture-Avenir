import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 180
    }
  }
};

const withNextIntl = createNextIntlPlugin();


export default withNextIntl(nextConfig);
