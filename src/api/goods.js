import { request } from 'common/utils/request'

export function getCateList_(queryInfo){
  return request({
    method: 'get',
    url: 'categories',
    params: queryInfo
  })
}

export function addCate_(addCateForm){
  return request({
    method: 'post',
    url: 'categories',
    data: addCateForm
  })
}

export function getGoodsList_(queryInfo){
  return request({
    method: 'get',
    url: 'goods',
    params: queryInfo
  })
}

export function removeGoodsById_(id){
  return request({
    method: 'delete',
    url: `goods/${id}`,
  })
}


