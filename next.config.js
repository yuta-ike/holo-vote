module.exports = {
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
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