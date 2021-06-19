import { request } from 'common/utils/request'

export default function (){
  return request({
    method: 'get',
    url: '/menus',
  })
}

