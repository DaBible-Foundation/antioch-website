import type { NextConfig } from "next";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
    serverExternalPackages: ['nodemailer'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
      },
      {
        protocol: 'https',
        hostname: 'developers.dabible.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc'
      },
      {
        protocol: 'https',
        hostname: 'api.dabible.com'
      }
    ],
  },
    webpack: (config) => {
      config.plugins = config.plugins || [];
      config.plugins.push(new MiniCssExtractPlugin());
      return config;
    },
};

export default nextConfig;
