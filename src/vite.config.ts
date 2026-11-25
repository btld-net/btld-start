import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lastTargetUrl = new URL('http://base.invalid');

const isLocalRequest = (url: string) => {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);

  // Vite's own endpoints (/@vite, /@fs, /@id, /node_modules, /__vite_ping, ...)
  if (pathname.startsWith('/@') || pathname.startsWith('/__') || pathname.startsWith('/node_modules/')) return true;
  return existsSync(path.join(__dirname, pathname)) || existsSync(path.join(__dirname, 'public', pathname));
};

const mergeRemoteHtml: Plugin = {
  name: 'vite-proxy-html-merge',
  apply: 'serve',
  transformIndexHtml: {
    order: 'pre',
    async handler(html) {
      const local = cheerio.load(html);
      const target = local('meta[name="vite-proxy-html-merge" i]').remove().attr('target');
      if (!target) return html;

      lastTargetUrl.href = new URL(target).origin;

      const response = await fetch(target, {
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept-Encoding': 'identity',
        },
      }).catch(() => null);

      if (!response?.ok) return html;

      let remoteHtml = await response.text();
      const remote = cheerio.load(remoteHtml);

      // A CSP would block the injected client and module scripts.
      remote('meta[http-equiv="content-security-policy" i]').remove();
      remote('script').attr('vite-ignore', '');
      remote('head').append(local('head').html() ?? '');
      local('body')
        .contents()
        .each((_, el) => {
          const replace = local(el).attr('proxy-replace-target');
          if (replace) {
            remote(replace).first().replaceWith(local.html(el));
            return;
          }
          const prepend = local(el).attr('proxy-prepend-target');
          if (prepend) {
            remote(prepend).first().prepend(local.html(el));
            return;
          }
          remote('body').append(local.html(el));
        });

      return remote.html();
    },
  },
};

export default defineConfig(({ mode }) => {
  const isLocalhost = mode === 'localhost';

  return {
    plugins: [mergeRemoteHtml],
    resolve: {
      alias: {
        '@btld/core': path.resolve(__dirname, '../core/index.ts'),
        '@btld/core/base': path.resolve(__dirname, '../core/base.ts'),
      },
    },
    server: {
      port: 5173,
      cors: true,
      allowedHosts: true,
      hmr: isLocalhost ? undefined : { clientPort: 443 },
      proxy: {
        // Anything that isn't served by Vite locally belongs to the remote page.
        '^/': {
          target: lastTargetUrl,
          changeOrigin: true,
          secure: false,
          bypass(req) {
            return isLocalRequest(req.url ?? '/') ? req.url : undefined;
          },
        },
      },
    },
  };
});
