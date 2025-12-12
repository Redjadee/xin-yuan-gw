// babel.config.js
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      compiler: 'webpack5',
    }]
  ],
  plugins: [
    [
      'import',
      {
        libraryName: '@taroify/core',
        libraryDirectory: '', // 注意这里
        style: true,
      },
      '@taroify/core',
    ],
  ],
}