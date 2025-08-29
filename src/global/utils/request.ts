import axios from 'axios'
// import token
const AUTH_TOKEN = 123
export const instance = axios.create({
  baseURL: 'https://xygdufs.298686.xyz:38888/api/user',//~pending：测试环境
  timeout: 10000,
  headers: {
    'Authorization': AUTH_TOKEN
  }
})

export const post = instance({
  method: 'post',
  data: {

  }
})