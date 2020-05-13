import request from '@/utils/request'

// 上传图片
export function upload(data) {
  return request({
    url: '/equips/upload',
    method: 'post',
    data
  })
}

// 添加
export function add(data) {
  return request({
    url: '/equips/add',
    method: 'post',
    data
  })
}

// 列表
export function list(params) {
  return request({
    url: '/equips/list',
    method: 'get',
    params
  })
}

// 列表
export function getMakesList() {
  return request({
    url: '/equips/makesList',
    method: 'get'
  })
}