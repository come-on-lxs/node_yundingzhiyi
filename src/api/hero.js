import request from '@/utils/request'

// 上传图片
export function upload(data) {
  return request({
    url: '/hero/upload',
    method: 'post',
    data
  })
}

// 添加
export function add(data) {
  return request({
    url: '/hero/add',
    method: 'post',
    data
  })
}

// 修改
export function edit(data) {
  return request({
    url: '/hero/edit',
    method: 'post',
    data
  })
}

// 列表
export function list(params) {
  return request({
    url: '/hero/list',
    method: 'get',
    params
  })
}

// 删除
export function remove(data) {
  return request({
    url: '/hero/delete',
    method: 'post',
    data
  })
}

// 修改状态
export function changeStatus(data) {
  return request({
    url: '/hero/change_status',
    method: 'post',
    data
  })
}