import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: !options.watch,
  minify: !options.watch,
  format: ['cjs', 'esm'],
  target: ['esnext'],
}));
