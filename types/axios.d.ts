import 'axios'

declare module 'axios' {
  interface AxiosResponse<T = any> {
    msg: string
  }
}