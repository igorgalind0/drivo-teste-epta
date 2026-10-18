import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Gera um servidor Node mínimo em .next/standalone (imagem Docker menor)
  output: 'standalone',
};

export default nextConfig;