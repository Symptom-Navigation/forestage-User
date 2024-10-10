/* 封装axios用于发送请求 */

import axios, { type AxiosResponse } from 'axios'

// const service = axios.create({
//   baseURL: 'http://localhost:8080',
//   timeout: 90000,
// })

const service = axios.create({
  baseURL: '/api0',
  timeout: 900000,
})
const request = (config: any) => {
  if (getToken()) {
    config.headers['csrf-token'] = getToken();
  }
  if (config.cType) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  }
  const token = localStorage.getItem('JWT');
  if (token) {
    config.headers['token'] = token;
    console.log('JWT token:', token); // 添加日志
  }
  return config;
};


const requestError = (error: any) => {
  console.error(error)
  return Promise.reject(error)
}

const response = (response: AxiosResponse) => {
  return response.data
}

const responseError = async (error: any) => {
  console.error('Response error:', error); // 添加日志
  if (error.response.status === 403) {
    showFailToast('登录过期');
    navigateTo('/login');
    return Promise.reject(error);
  }
  if (error.response.data.code === 400) {
    showFailToast(error.response.data.message);
    return Promise.reject(error);
  }
  if (error.response.status === 500) {
    showFailToast('服务器内部错误，请稍后重试。'); // 添加用户友好的提示
    return Promise.reject(error);
  }
  return Promise.reject(error);
};

service.interceptors.request.use(request, requestError)
service.interceptors.response.use(response, responseError)


export default service