import { request } from 'common/utils/request'

export function getRightsList_(type){
  return request({
    method: 'get',
    url: `/rights/${type}`
  })
}

