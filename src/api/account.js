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
