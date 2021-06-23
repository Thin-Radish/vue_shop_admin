import { request } from 'common/utils/request'

export function getOrderList_(queryInfo){
  return request({
    method: 'get',
    url: 'orders',
    params:queryInfo
  })
}

export function getProgressInfo_(id){
  return request({
    method: 'get',
    url: `kuaidi/${id}`,
  })
}
