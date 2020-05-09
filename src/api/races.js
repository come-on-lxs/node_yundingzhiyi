import request from '@/utils/request'

// 上传图片
export function upload(data) {
  return request({
    url: '/races/upload',
    method: 'post',
    data
  })
}

// 添加
export function add(data) {
  return request({
    url: '/races/add',
    method: 'post',
    data
  })
}

// 列表
export function list() {
  return request({
    url: '/races/list',
    method: 'get'
  })
}

// 删除
export function remove(data) {
  return request({
    url: '/races/delete',
    method: 'post',
    data
  })
}

// 修改
export function edit(data) {
  return request({
    url: '/races/edit',
    method: 'post',
    data
  })
}

// 禁用启用
export function changeStatus(data) {
  return request({
    url: '/races/change_status',
    method: 'post',
    data
  })
}