import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: !options.watch,
  minify: !options.watch,
  dts: true,
  format: ['cjs', 'esm'],
  target: ['esnext'],
}));
