// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import ownerCheck from "./integrations/owner-check.mjs";

export default defineConfig({
  site: "https://www.aryanhaghighi.com",
  output: "static",
  trailingSlash: "ignore",
  // One HTML request paints the first screen: no render-blocking CSS file.
  build: { inlineStylesheets: "always" },
  integrations: [sitemap(), ownerCheck()],
});
