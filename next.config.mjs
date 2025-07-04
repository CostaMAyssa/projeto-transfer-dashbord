/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com', 'content.app-sources.com'],
  },
  // Otimizações de performance
  experimental: {
    optimizeCss: true,
  },
  output: "export",
}

export default nextConfig