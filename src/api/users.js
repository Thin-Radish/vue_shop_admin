import { request } from 'common/utils/request'

export function getUserList_(queryInfo){
  return request({
    method: "get",
    url: "/users",
    params:queryInfo
  })
}

export function userStateChanged_(userInfo){
  return request({
    method: "put",
    url: `/users/${userInfo.id}/state/${userInfo.mg_state}`,
  })
}

export function addUser_(userInfo){
  return request({
    method: "post",
    url: "/users",
    data:userInfo
  })
}

export function addUserById_(id){
  return request({
    method: "get",
    url: `/users/${id}`,
  })
}

export function editUser_(userInfo){
  return request({
    method: "put",
    url: `/users/${userInfo.id}`,
    data: {
      email: userInfo.email,
      mobile: userInfo.mobile,
    }
  })
}

export function deleteUserById_(id){
  return request({
    method: "delete",
    url: `/users/${id}`,
  })
}

export function setUserRole_(id, roleId){
  return request({
    method: "put",
    url: `/users/${id}/role`,
    data: {
      rid: roleId
    }
  })
}