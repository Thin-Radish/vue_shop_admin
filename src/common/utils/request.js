import axios from 'axios'
axios.defaults.withCredentials = true; 

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css' 

export function request(config) {

  //1.创建axios实例
  const instance = axios.create({
    baseURL: '/api',
    // baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    
    timeout: 5000
  })

  //2.axois的拦截器(interceptors)

  //2.1.请求拦截

  instance.interceptors.request.use(config=>{
    //为请求对象，添加token验证的Authorization
    config.headers.Authorization = window.sessionStorage.getItem('token');

    //发起请求显示加载进度条
    Nprogress.start();

    return config                             
  })


  //2.2.响应拦截
  instance.interceptors.response.use(res=>{   
    
    //响应成功隐藏进度条
    Nprogress.done();
    return res;
  },err=>{
    
  })


  //3.发送真正的网络请求   
  return instance(config)

}


