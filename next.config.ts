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
        hostname: 'files.cdn.printful.com',
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
  async redirects() {
    return [
      {
        source: '/donate',
        destination: 'https://donate.dabible.com',
        permanent: true,
      },
      {
        source: '/donate/:path*',
        destination: 'https://donate.dabible.com/:path*',
        permanent: true,
      },
      {
        source: '/our-story',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/solar-audio-bible',
        destination: '/products/solar-audio-bible-device',
        permanent: true,
      },
      {
        source: '/bible-study',
        destination: '/',
        permanent: true,
      },
      {
        source: '/donor-wall',
        destination: 'http://donate.dabible.com/donor-wall',
        permanent: true,
      },
      {
        source: '/support/',
        destination: 'https://support.dabible.com',
        permanent: true,
      },
      {
        source: '/products',
        destination: 'https://dabible.com/#products',
        permanent: true,
      },
      {
        source: '/product/solar-audio-bible-device',
        destination: '/products/solar-audio-bible-device',
        permanent: true,
      },
      {
        source: '/donor-dashboard',
        destination: 'https://donate.dabible.com/donor-dashboard',
        permanent: true,
      },
      {
        source: '/shop',
        destination: 'https://donate.dabible.com/shop',
        permanent: true,
      },
      {
        source: '/project/hausa-audio-bible',
        destination: '/products/yoruba-audio-bible',
        permanent: true,
      },
      {
        source: '/project/hausa-audio-bible',
        destination: '/products/hausa-audio-bible',
        permanent: true,
      },
      {
        source: '/project/pidgin-audio-bible',
        destination: '/products/pidgin-audio-bible',
        permanent: true,
      },
      {
        source: '/donations/benita-leviticus-monthly-support',
        destination: 'https://donate.dabible.com',
        permanent: true,
      },
      {
        source: '/product/solar-audio-bible-device-an-easy-to-use-solar-device-for-the-blind-and-elderlies',
        destination: '/products/pidgin-audio-bible',
        permanent: true,
      },
      {
        source: '/solar-powered-audio-bible-player-for-the-elderly',
        destination: '/products/pidgin-audio-bible',
        permanent: true,
      },
      {
        source: '/donations/sponsor-1-solar-device-for-an-elderly',
        destination: 'https://donate.dabible.com/solar-audio-bible',
        permanent: true,
      },
      {
        source: '/donations/emmanuel-gammaliel',
        destination: 'https://donate.dabible.com',
        permanent: true,
      },
      {
        source: '/donations/raising-children-in-northern-nigeria',
        destination: 'https://donate.dabible.com',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
