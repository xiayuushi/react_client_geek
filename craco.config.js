const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}

// 01、该文件是craco用于覆盖默认webpack配置，可以不释放webpack目录的情况下进行覆盖配置操作（可参考antd官网的使用）
// 02、alias用于配置路径别名
