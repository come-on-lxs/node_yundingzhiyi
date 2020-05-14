import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: false, // send cookies when cross-domain requests
  timeout: 50000, // request timeout,
  header: {
    'Accept':'application/json', 
    'Content-Type': 'application/json'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // token 验证白名单
    let whiteUrl = ['/admin/login']

    if(whiteUrl.indexOf(config.url) === -1) {
      config.headers.authorization = localStorage.getItem('token')
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 100, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 2 * 1000
      })
      if(res.code === 403 || res.code === 401 || res.code === 402) {
        // 重新登录
        Message.error(res.message || '请重新登录')
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
