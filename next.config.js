/** @type {import('next').NextConfig} */

import nextPWA from 'next-pwa';

const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    runtimeCaching: [
        {
            urlPattern: /\/$/,  // Root path
            handler: 'StaleWhileRevalidate',  // Faster than NetworkFirst for main routes
            options: {
                cacheName: 'html-cache',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                },
            },
        },
        {
            urlPattern: /\/_next\/static\/.*/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'static-assets',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
            },
        },
        {
            urlPattern: /\/_next\/image\?.*/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'next-image',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
            },
        },
        {
            urlPattern: /\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60, // 1 hour
                },
            },
        },
        // Default cache
        {
            urlPattern: /.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'others',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
            },
        },
    ],
});

const nextConfig = withPWA({
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/json',
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                ],
            },
        ];
    },
});

export default nextConfig;
