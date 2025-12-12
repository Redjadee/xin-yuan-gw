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