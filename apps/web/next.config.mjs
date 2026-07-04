// When building for GitHub Pages (a project subpath), set basePath/assetPrefix
// so links and assets resolve under /<repo>. Cloudflare / local serve at root
// (GITHUB_PAGES unset), so those keep working unchanged.
const repo = "Nabulines-academy";
const isPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(isPages ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` } : {}),
};

export default nextConfig;
