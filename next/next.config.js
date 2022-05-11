/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack5: true,
    webpack: (config, { isServer }) => {
      config.ignoreWarnings = [
        {
          message: /(magic-sdk|@walletconnect\/web3-provider|@web3auth\/web3auth)/,
        }
      ]
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
        }
      }
      return config
    },
    experimental: {
      emotion:
        true |
        {
          // default is true. It will be disabled when build type is production.
          sourceMap: true,
          // default is 'dev-only'.
          autoLabel: 'dev-only',
          // default is '[local]'.
          // Allowed values: `[local]` `[filename]` and `[dirname]`
          // This option only works when autoLabel is set to 'dev-only' or 'always'.
          // It allows you to define the format of the resulting label.
          // The format is defined via string where variable parts are enclosed in square brackets [].
          // For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
          labelFormat: '[local]',
        },
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }
  module.exports = nextConfig
    
  