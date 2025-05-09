import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts', 'src/index.css'],
  splitting: false,
  sourcemap: true,
  clean: !options.watch,
  minify: !options.watch,
  dts: {
    entry: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  target: ['esnext'],
}));
