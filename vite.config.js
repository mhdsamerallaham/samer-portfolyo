import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

function vercelDevApiPlugin() {
  return {
    name: 'vercel-dev-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost');
        const apiPath = urlObj.pathname.replace(/^\/api\//, '');

        const possibleFiles = [
          path.resolve(__dirname, 'api', `${apiPath}.js`),
          path.resolve(__dirname, 'api', apiPath, 'index.js'),
          path.resolve(__dirname, 'api', apiPath),
        ];

        let targetFile = possibleFiles.find((f) => fs.existsSync(f) && fs.statSync(f).isFile());

        if (!targetFile) {
          return next();
        }

        try {
          const query = Object.fromEntries(urlObj.searchParams.entries());
          req.query = query;

          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const bodyStr = Buffer.concat(buffers).toString();
            try {
              req.body = JSON.parse(bodyStr);
            } catch {
              req.body = bodyStr;
            }
          } else {
            req.body = {};
          }

          res.status = function (code) {
            res.statusCode = code;
            return res;
          };
          res.json = function (data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(data));
            return res;
          };

          delete require.cache[targetFile];
          const handler = require(targetFile);

          await handler(req, res);
        } catch (err) {
          console.error('[API Middleware Error]:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), react(), vercelDevApiPlugin()],
  build: {
    // Target modern browsers only (drops legacy polyfills)
    target: 'es2020',
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching and parallel loading
        manualChunks(id) {
          // React core — cached separately
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          // Routing — cached separately
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // i18n framework
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
          // Locale JSON files (large data blobs)
          if (id.includes('/locales/')) {
            return 'locales';
          }
          // GSAP animation library
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
            return 'vendor-gsap';
          }
          // Lenis smooth scroll
          if (id.includes('node_modules/lenis')) {
            return 'vendor-lenis';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
})
