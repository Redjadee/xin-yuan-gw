/**
 * ====================================
 * Taro 构建配置说明
 * ====================================
 *
 * 本文件包含了项目的核心构建配置，经过大量优化以解决小程序主包体积限制问题。
 *
 * 【核心配置项】
 *
 * 1. 设计稿宽度与设备比例
 *    - designWidth: 375 (设计稿基准宽度)
 *    - deviceRatio: 配置不同设备的像素转换比例
 *    - 自动将 px 转换为 rpx（小程序）或 rem（H5）
 *
 * 2. 分包预下载策略 (preloadRule)
 *    - 进入首页时预下载：myPkg, loginPkg
 *    - 进入"我的"页面时预下载：myPkg
 *    - 目的：提升用户体验，减少二次加载等待时间
 *
 * 3. Webpack 分包优化策略
 *
 *    【问题背景】
 *    微信小程序主包大小限制为 2MB，项目依赖较多容易超限。
 *
 *    【优化方案】
 *    a) 关闭预编译 (prebundle: false)
 *       - 解决体积大和拆包干扰问题
 *
 *    b) 关闭主包优化 (optimizeMainPackage: false)
 *       - 防止 Taro 自动优化导致的不可控拆包
 *
 *    c) 锁定输出文件名
 *       output: { filename: '[name].js', chunkFilename: '[name].js' }
 *       - 防止文件名变成 index-123.js，确保路径稳定
 *
 *    d) 黑名单策略（重要！）
 *       以下库不打入主包 vendors，而是允许在各分包中冗余：
 *       - @taroify (Taro 版 Vant 组件库，体积大)
 *       - @vant (Vant 微信小程序组件)
 *       - js-sha1, js-base64 (加密库)
 *
 *       【为什么允许冗余？】
 *       - 这些库体积较大，各分包按需引入
 *       - 虽然会有少量冗余，但能大幅减少主包体积
 *       - 提升首屏加载速度，符合小程序性能优化最佳实践
 *
 *    e) vendors 策略
 *       - React、Taro、Core-JS 等核心库打入主包 vendors
 *       - 只拆分异步模块 (chunks: 'async')
 *       - 保护页面入口不被拆碎
 *
 * 4. 生产环境配置 (prod.ts)
 *    - Terser 压缩：移除 console 和 debugger
 *    - 保留类名和函数名 (keep_classnames, keep_fnames)
 *      原因：Taro 需要通过函数名识别组件类型，混淆后会导致页面无法渲染
 *
 * 【环境配置】
 * - 开发环境 (dev.ts): 不压缩，保留调试信息
 * - 生产环境 (prod.ts): 完整压缩优化，移除日志
 *
 * 【注意事项】
 * - 修改分包策略后务必测试主包体积
 * - 使用微信开发者工具查看代码依赖分析
 * - 生产构建必须保留类名和函数名，否则会白屏
 */

import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import devConfig from './dev';
import prodConfig from './prod';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
process.env.BROWSERSLIST_ENV = process.env.NODE_ENV
export default defineConfig<'webpack5'>(async (merge, {
  command,
  mode
}) => {
  const path = require('path'); // 记得引入 path
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'xygw',
    date: '2025-8-7',
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
      393: 1.91 / 1
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ["@tarojs/plugin-generator", '@tarojs/plugin-http'],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false
      }
    },
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module',
            // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },      
      // 1. 关闭预编译 (解决体积大/拆包干扰问题)
      compiler: {
        type: 'webpack5',
        prebundle: { enable: false },
      },

      // 2. 关闭主包优化
      optimizeMainPackage: { enable: false },
      
      // 3. 【防盗锁1】强制锁定输出文件名
      // 保证 pages/index/index.js 永远叫这个名字，不会变成 index-123.js
      output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
      },

      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);

        chain.optimization.splitChunks({
          // 1. 全局策略：只拆异步，保护页面入口不被拆碎
          chunks: 'async', 
          minSize: 0,
          minChunks: 1,
          maxSize: 0,
          
          cacheGroups: {
            default: false,
            common: false, 

            vendors: {
              chunks: 'all', 
              name: 'vendors',
              priority: 20,
              enforce: true,
              
              test: (module) => {
                const path = module.resource;
                if (!path) return false;
                
                const isNodeModules = /[\\/]node_modules[\\/]/.test(path);
                
                // --- 黑名单 (踢出 Taroify sha1 base64) ---
                const isTaroify = /[\\/]node_modules[\\/]@taroify[\\/]/.test(path);
                const isVant = /[\\/]node_modules[\\/]@vant[\\/]/.test(path);
                const isCrypto = /[\\/]node_modules[\\/](sha1|js-base64)[\\/]/.test(path);
                
                if (isTaroify || isVant || isCrypto) {
                  return false; // 坚决踢出，去分包冗余
                }

                // --- 默认策略 ---
                // 其他 node_modules 只要不是黑名单，都进主包
                // 这会把 React, Taro, Core-JS 都带进去
                return isNodeModules;
              },
            },
          }
        });
      },

      compile: {
        include: [(filename: string) => /node_modules\/(?!(.pnpm|@babel|core-js|style-loader|css-loader|react|react-dom))(@?[^/]+)/.test(filename)]
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module',
            // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
      },
      compile: {
        include: [(filename: string) => /node_modules\/(?!(.pnpm|@babel|core-js|style-loader|css-loader|react|react-dom))(@?[^/]+)/.test(filename)]
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  };
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});