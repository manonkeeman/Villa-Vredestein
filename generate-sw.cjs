// Script om de service worker te genereren na de Vite build
const { generateSW } = require('./node_modules/workbox-build/build/index.js');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');

generateSW({
  swDest: path.join(distDir, 'sw.js'),
  globDirectory: distDir,
  globPatterns: [
    '**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot,webp,json}'
  ],
  globIgnores: [
    'node_modules/**/*',
    'sw.js',
    'workbox-*.js',
  ],
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/\/api\//],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'gstatic-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60,
        },
      },
    },
  ],
})
  .then(({ count, size, warnings }) => {
    if (warnings.length > 0) {
      console.warn('Workbox waarschuwingen:\n', warnings.join('\n'));
    }
    console.log(
      `✓ Service worker gegenereerd: ${count} bestanden, ~${Math.round(size / 1024)} KB`
    );
  })
  .catch((err) => {
    console.error('Fout bij genereren service worker:', err);
    process.exit(1);
  });