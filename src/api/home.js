import request from '@/utils/request'

// info
export function getInfo() {
  return request({
    url: '/home',
    method: 'get'
  })
}