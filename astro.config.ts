import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import favicons from 'astro-favicons';
import icon from 'astro-icon';
import robotsTxt from 'astro-robots-txt';
import { defineConfig, fontProviders } from 'astro/config';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { fileURLToPath } from 'node:url';

process.env.ASTRO_TELEMETRY_DISABLED = '1';

const integrations = [
  sitemap({ filter: (page) => !page.includes('/hidden/') }),
  robotsTxt({
    policy: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/hidden/'],
      },
    ],
  }),
];

const favicon = favicons({
  name: 'Rueberg Site',
  short_name: 'Rueberg',
  input: {
    favicons: [fileURLToPath(import.meta.resolve('@btld/utils-doc-template/favicon.svg'))],
  },
});

export default defineConfig({
  site: 'https://rueberg.eu',
  srcDir: 'docs',
  output: 'static',
  integrations: [...integrations, favicon, mdx(), icon()],
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: browserslistToTargets(browserslist('baseline widely available')),
      },
    },
    build: {
      rolldownOptions: {
        output: {
          assetFileNames: 'file/[name][extname]',
        },
      },
    },
    resolve: { tsconfigPaths: true },
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
