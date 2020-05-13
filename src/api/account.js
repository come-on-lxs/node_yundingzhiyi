import request from '@/utils/request'

// list
export function list(params) {
  return request({
    url: '/accountInfo/list',
    method: 'get',
    params
  })
}