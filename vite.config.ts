import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html", // will be saved in project's root
    }),
  ],
  define: {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
