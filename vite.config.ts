import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },

  build: {
    lib: {
      entry: resolve(new URL('./src/index.ts', import.meta.url).pathname),
      formats: ['es'],
      fileName: 'index',
    },
    sourcemap: true,
    rollupOptions: {
      /* Externalizamos todo lo que no queremos embeber en el bundle final.
         Los consumidores deberán tener estas deps instaladas. */
      external: [
        'lit',
        /^lit\//,
        /^@lit\//,
        /^@lit-labs\//,
        'contentful',
        '@contentful/rich-text-html-renderer',
      ],
    },
  },
});
