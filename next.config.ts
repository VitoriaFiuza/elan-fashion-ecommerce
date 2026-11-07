import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/produtos": ["./backend/produtos.json"],
    "/api/produtos/[id]": ["./backend/produtos.json"],
  },
};

export default nextConfig;
