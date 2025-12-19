/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
    // Keep domains for backward compatibility (deprecated but still works)
    domains: [
      'localhost',
      'res.cloudinary.com',
      'static.vecteezy.com',
      'your-azure-blob-storage.blob.core.windows.net',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Increase body size limit for file uploads (20MB for audio files)
  serverActions: {
    bodySizeLimit: '20mb',
  },
}

export default nextConfig
