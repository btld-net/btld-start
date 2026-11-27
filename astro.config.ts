import { createBaseDocConfig } from '@btld/utils-doc-template/astro.ts';
import { defineConfig, mergeConfig } from 'astro/config';

process.env.ASTRO_TELEMETRY_DISABLED = '1';

export default defineConfig(
  mergeConfig(
    createBaseDocConfig({
      name: 'Rueberg Site',
      shortName: 'Rueberg',
    }),
    {
      site: 'https://rueberg.eu',
    }
  )
);
