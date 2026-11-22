// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import ownerCheck from "./integrations/owner-check.mjs";
import { lastmodFor } from "./src/lib/lastmod.ts";

export default defineConfig({
  site: "https://www.aryanhaghighi.com",
  output: "static",
  trailingSlash: "ignore",
  // One HTML request paints the first screen: no render-blocking CSS file.
  build: { inlineStylesheets: "always" },
  integrations: [
    sitemap({
      // Bing and Google trust lastmod only when it is honest: real dates only.
      serialize(item) {
        const lastmod = lastmodFor(new URL(item.url).pathname);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
    ownerCheck(),
  ],
});
