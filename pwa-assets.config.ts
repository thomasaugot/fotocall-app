import { defineConfig } from "@vite-pwa/assets-generator/config"

// Icons from the two prints of the mark (ui/BrandMark). Hex is literal here: icons cannot read
// theme.css. White = --color-bg. `any` and `maskable` are separate files (PWA skill §4).
const white = "#ffffff"

export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    transparent: { sizes: [192, 512], padding: 0.04, resizeOptions: { background: white }, favicons: [[48, "favicon.ico"]] },
    maskable: { sizes: [512], padding: 0.2, resizeOptions: { background: white } },
    apple: { sizes: [180], padding: 0.1, resizeOptions: { background: white } },
  },
  images: ["public/assets/icons/source.svg"],
})
