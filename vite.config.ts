import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Ensures the final single-file dist/index.html uses a classic IIFE <script>
 * placed at the end of <body> with no `type="module"` or `crossorigin` attributes,
 * guaranteeing offline file:// execution in Chrome and Microsoft Edge on Windows
 * without CORS module loader errors.
 */
function ensureClassicOfflineScript(): Plugin {
  return {
    name: 'ensure-classic-offline-script',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const asset = bundle[fileName];
        if (asset.type === 'asset' && fileName.endsWith('.html') && typeof asset.source === 'string') {
          let html = asset.source;
          // Remove crossorigin attributes on any tags
          html = html.replace(/\s+crossorigin(?:="[^"]*")?/gi, '');
          // Convert inline <script type="module"> to classic <script>
          html = html.replace(/<script\s+type="module"\s*>/gi, '<script id="tracker-app-bundle">');
          html = html.replace(/<script\s+type="module"\s+([^>]*)>/gi, '<script id="tracker-app-bundle" $1>');
          // If the inlined app bundle script ended up inside <head>, move it before </body> so #root exists
          const headEndIdx = html.indexOf('</head>');
          const bundleMatch = html.match(/<script id="tracker-app-bundle"[^>]*>[\s\S]*?<\/script>/i);
          if (bundleMatch && headEndIdx !== -1 && html.indexOf(bundleMatch[0]) < headEndIdx) {
            html = html.replace(bundleMatch[0], '');
            html = html.replace('</body>', () => `${bundleMatch[0]}\n</body>`);
          }
          asset.source = html;
        }
      }
    },
  };
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      ...(isBuild
        ? [viteSingleFile({ removeViteModuleLoader: true }), ensureClassicOfflineScript()]
        : []),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
          }
        },
      },
    ],
    build: {
      target: 'es2020',
      assetsInlineLimit: 100000000,
      cssCodeSplit: false,
      modulePreload: false,
      rollupOptions: {
        output: {
          format: 'iife',
          inlineDynamicImports: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
