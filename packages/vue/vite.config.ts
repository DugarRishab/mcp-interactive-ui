import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MCPInteractiveUIVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', '@mcp-interactive-ui/types', '@mcp-interactive-ui/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@mcp-interactive-ui/types': 'MCPTypes',
          '@mcp-interactive-ui/core': 'MCPCore',
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
});
