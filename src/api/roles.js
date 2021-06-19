import { request } from 'common/utils/request'

export function getRoleList_(){
  return request({
    method: "get",
    url: "/roles",
  })
}

export function deleteRightById_(roleId, rightId){
  return request({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}

export function setRoleRights_(roleId, keyStr){
  return request({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data:{
      rids: keyStr
    }
  })
}