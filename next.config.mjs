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
  // Headers para cache de assets estáticos
  async headers() {
    return [
      {
        source: '/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig