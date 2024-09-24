/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: ''
      }
    ],
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
    ]
  }
};

export default nextConfig;
