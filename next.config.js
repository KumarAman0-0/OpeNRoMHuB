/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: builds to /out, deployable free on GitHub Pages, Vercel, Netlify, Cloudflare Pages
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
