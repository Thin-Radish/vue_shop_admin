import { request } from 'common/utils/request'

export function getParamsData_(id,sel){
  return request({
    method: 'get',
    url: `/categories/${id}/attributes`,
    params: {
      sel: sel
    }
  })
}

export function addParams_(queryInfo){
  return request({
    method: 'post',
    url: `/categories/${queryInfo.id}/attributes`,
    data: queryInfo
  })
}

export function getParamsById_(queryInfo){
  return request({
    method: 'get',
    url: `categories/${queryInfo.id}/attributes/${queryInfo.attrId}`,
    params: {
      attr_sel: queryInfo.attr_sel
    }
  })
}

export function removeParams_(queryInfo){
  return request({
    method: 'delete',
    url: `categories/${queryInfo.id}/attributes/${queryInfo.attrId}`,
  })
}

