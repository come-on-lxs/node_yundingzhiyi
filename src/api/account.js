import request from '@/utils/request'

// list
export function list(params) {
  return request({
    url: '/accountInfo/list',
    method: 'get',
    params
  })
}

// 添加账户
export function add(data) {
  return request({
    url: '/accountInfo/add',
    method: 'post',
    data
  })
}

// 删除
export function toDelete(data) {
  return request({
    url: '/accountInfo/delete',
    method: 'post',
    data
  })
}

// 修改密码
export function toResetPwd(data) {
  return request({
    url: '/accountInfo/resetPwd',
    method: 'post',
    data
  })
}

// 禁用/启用
export function changeStatus(data) {
  return request({
    url: '/accountInfo/changeStatus',
    method: 'post',
    data
  })
}

// 编辑
export function toEdit(data) {
  return request({
    url: '/accountInfo/edit',
    method: 'post',
    data
  })
}