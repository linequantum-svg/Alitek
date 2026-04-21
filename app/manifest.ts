import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Каталог товарів",
    short_name: "Каталог",
    description: "Каталог товарів",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f5f9",
    theme_color: "#2f63f6",
    lang: "uk",
    icons: [
      {
        src: "/favicon.svg?v=4",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
