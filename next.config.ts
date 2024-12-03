import type { NextConfig } from "next";
import path from 'path';
const nextConfig: NextConfig = {
  /* config options here */
  webpack(config, { isServer }) {
    // Add a CSV loader to process .csv files
    config.module.rules.push({
      test: /\.csv$/,
      use: [
        {
          loader: 'csv-loader',
          options: {
            dynamicTyping: true, // Automatically cast values like numbers and booleans
            header: true,        // Treat the first row as headers
            skipEmptyLines: true, // Ignore empty lines
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
