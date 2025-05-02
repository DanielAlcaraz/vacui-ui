import type { Config } from 'tailwindcss';
import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';
import { join } from 'node:path';

export default {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,md,analog,ag,agx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
