module.exports = {
  images: {
    domains: ['i.ytimg.com'],
  },
  experimental: {
    optimizeFonts: true,
  },
  webpack: config => {
    config.node = {
      fs: 'empty',
      child_process: 'empty',
      net: 'empty',
      dns: 'empty',
      tls: 'empty',
    }
    return config
  },
}