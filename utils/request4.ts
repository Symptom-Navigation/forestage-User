/* 封装axios用于发送请求 */

import axios, { type AxiosResponse } from 'axios'


// 方言服务端
// const serviceGuide = axios.create({
//   baseURL: 'http://localhost:8083',
//   timeout: 90000,
// })
const serviceGuide3 = axios.create({
  baseURL: '/api3',
  timeout: 900000,
})
const request = (config: any) => {
  if (getToken()) {
    config.headers['csrf-token'] = getToken()
  }
  if (config.cType) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  if (localStorage.getItem('JWT')) {
    config.headers['token'] = localStorage.getItem('JWT')
  }
  return config
}

const requestError = (error: any) => {
  console.error(error)
  return Promise.reject(error)
}

const response = (response: AxiosResponse) => {
  return response.data
}

// const responseError = async (error: any) => {
//   if (error.response.status === 403) {
//     showFailToast('登录过期')
//     navigateTo('/login')
//     return Promise.reject(error)
//   }
//   if (error.response.data.code === 400) {
//     showFailToast(error.response.data.message)
//     return Promise.reject(error)
//   }
//   if (error.response.status === 500) {
//     return Promise.reject(error)
//   }
//   return Promise.reject(error)
// }

serviceGuide3.interceptors.request.use(request, requestError)
// serviceGuide.interceptors.response.use(response, responseError)


export default serviceGuide3