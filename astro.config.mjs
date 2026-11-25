// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import favicons from 'astro-favicons';
import icon from 'astro-icon';
import robotsTxt from 'astro-robots-txt';
import { defineConfig, fontProviders } from 'astro/config';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sitemapInt = sitemap({ filter: (page) => !page.includes('/hidden/') });

const robotsInt = robotsTxt({
  policy: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/hidden/'],
    },
  ],
});

const faviconInt = favicons({
  name: 'Rueberg Site',
  short_name: 'Rueberg',
  input: {
    favicons: [fileURLToPath(import.meta.resolve('@btld/utils-doc-template/favicon.svg'))],
  },
});

process.env.ASTRO_TELEMETRY_DISABLED = '1';

// REFERENCE: https://astro.build/config

export default defineConfig({
  srcDir: 'docs',
  site: 'https://rueberg.eu',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [sitemapInt, robotsInt, faviconInt, mdx(), icon()],
  devToolbar: {
    enabled: false,
  },
  vite: {
    resolve: {
      alias: {
        '@root': resolve(import.meta.dirname),
        '@components': resolve(import.meta.dirname, './src/components'),
      },
    },

    /*server: {
      fs: {
        allow: [resolve(import.meta.dirname), resolve(import.meta.dirname, '../btld-utils')],
      },
    },*/

    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: browserslistToTargets(
          browserslist('baseline widely available'),
        ),
      },
    },

    build: {
      cssMinify: 'lightningcss',
      cssTarget: 'es2022',
      rollupOptions: {
        output: {
          assetFileNames: 'file/[name][extname]',
        },
      },
    },

    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [500],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta-sans',
      weights: [400, 500, 700],
    },
  ],
});
