import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function loginOut() {
  return request({
    url: '/login/out',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/accountInfo',
    method: 'get'
  })
}