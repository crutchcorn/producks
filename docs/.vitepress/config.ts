import {defineConfig} from "vitepress";

const {description} = require("../../package.json");

const ogImage = "https://crutchcorn.github.io/producks/social-banner.png";

export default defineConfig({
  lang: "en-US",
  title: "Producks",
  description: description,
  base: "/producks/",
  lastUpdated: true,
  head: [
    ["meta", {property: "og:image", content: ogImage}],
    ["meta", {name: "twitter:image", content: ogImage}],
    ["meta", {name: "theme-color", content: "#DBCAFF"}],
    ["meta", {property: "twitter:card", content: "summary_large_image"}],
    ["link", {rel: "icon", href: "/logo.svg", type: "image/svg+xml"}],
    ["link", {rel: "mask-icon", href: "/logo.svg", color: "#ffffff"}],
  ],
  themeConfig: {
    logo: "/logo.svg",
    socialLinks: [
      {icon: "github", link: "https://github.com/crutchcorn/producks"}
    ],
    editLink: {
      pattern: "https://github.com/crutchcorn/producks/edit/main/docs/:path",
    },
    nav: [
      {text: "Introduction", link: "/introduction"},
      {
        text: "v0",
        items: [
          // Change to `Changelog` when we have one
          {
            text: "Releases",
            link: "https://github.com/crutchcorn/producks/releases",
          },
          {
            text: "Contributing",
            link: "https://github.com/crutchcorn/producks/blob/main/CONTRIBUTING.md",
          },
        ],
      },
    ],
    sidebar: [
      {
        text: "Introduction",
        link: "/introduction",
      },
    ],
  },
});
