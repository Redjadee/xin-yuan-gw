// 1. 引入我们自己写的类
import { AbortController as LocalAbortController } from '@/global/utils/api/AbortController'

// 2. 挂载到全局环境
// 这样无论你的代码哪里写了 new AbortController()，用的都是我们这个不会报错的版本
const globalScope = (typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : {}));
(globalScope as any).AbortController = LocalAbortController;
// 有些库可能会检查 AbortSignal，也补上
(globalScope as any).AbortSignal = LocalAbortController.prototype.signal?.constructor;

import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import 'abortcontroller-polyfill'

import { Provider } from 'react-redux'
import { store } from './store'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // Taro.loadFontFace({ //加载字体
  //   family: 'FZHei-B01S',
  //   source: 'url("https://ziti-1376542992.cos.ap-guangzhou.myqcloud.com/%E6%96%B9%E6%AD%A3%E9%BB%91%E4%BD%93%E7%AE%80%E4%BD%93.TTF")',
  //   success: console.log
  // })

  // children 是将要会渲染的页面
  return (
    <Provider store={store}>
    {children}
    </Provider>
  )
} 

export default App
