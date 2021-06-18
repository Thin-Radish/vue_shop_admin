import { request } from 'common/utils/request'

export function userLogin(loginForm){
  return request({
    method: 'post',
    url: '/login',
    data: {
      username: loginForm.username,
      password: loginForm.password
    }
  })
}