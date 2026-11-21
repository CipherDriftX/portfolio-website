// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.aryanhaghighi.com",
  output: "static",
  trailingSlash: "ignore",
  integrations: [sitemap()],
});
