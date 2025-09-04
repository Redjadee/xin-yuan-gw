import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'

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
