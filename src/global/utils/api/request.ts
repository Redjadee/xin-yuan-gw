import axios, { AxiosError } from 'axios'
import { store } from '@/store'
import { logout } from '@/store/authSlice'
import Taro from '@tarojs/taro'

const instance = axios.create({
  baseURL: process.env.TARO_APP_API || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
})

// 请求拦截：注入 token
instance.interceptors.request.use((config) => {
  const { token } = store.getState().auth
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// 401未授权 拦截器
instance.interceptors.response.use(
  (res) => res.data, //2xx
  (error: AxiosError) => { //out of 2xx
    if(error.response?.status === 401) {
      store.dispatch(logout())
      Taro.reLaunch({
        url: '/loginPkg/pages/login/index'
      })
    }
    return Promise.reject(error)
  }
)

export { instance as http }