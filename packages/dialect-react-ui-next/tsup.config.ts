import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/index.css'],
  outDir: 'lib',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: {
    entry: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
});
