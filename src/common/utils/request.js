import axios from 'axios'
axios.defaults.withCredentials = true; 

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

    return config                             
  })


  //2.2.响应拦截
  instance.interceptors.response.use(res=>{      
  
    return res.data
  },err=>{

  })


  //3.发送真正的网络请求   
  return instance(config)

}


