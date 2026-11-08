import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ship the password-protected trade sell sheet with its download route.
  outputFileTracingIncludes: { "/v2/trade/sell-sheet": ["./trade-assets/**/*"] },
  // The new site's pages live in src/app/v2 but are served from the root. beforeFiles
  // means they win over the old pages at the same addresses. /hi is untouched.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/v2" },
        { source: "/:page(about|contact|faq|trade)", destination: "/v2/:page" },
        { source: "/:section(products|policies|trade)/:rest*", destination: "/v2/:section/:rest*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  // Old /v2 page links go to the clean addresses. Paths with a dot are files in
  // public/v2 (images, video) and must not be redirected.
  async redirects() {
    return [
      // One address for the site: www.eatcrosps.com goes to eatcrosps.com.
      { source: "/:path*", has: [{ type: "host", value: "www.eatcrosps.com" }], destination: "https://eatcrosps.com/:path*", permanent: true },
      { source: "/v2", destination: "/", permanent: true },
      { source: "/v2/:path((?!.*\\.).*)", destination: "/:path", permanent: true },
    ];
  },
  images: {
    // Keep resized photos for a week, so repeat visits don't re-check every image.
    // Replacing a photo? Give the new file a new name so visitors see it straight away.
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.figma.com",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "behold.pictures",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
