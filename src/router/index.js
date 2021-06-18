import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login' );
const Home = () => import('views/home/Home' );

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: 'login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home',  name: 'Home',  component: Home  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //登录页面直接放行
  if(to.path === '/login') return next();

  //获取token 如果没token回到登录页
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');

  next();

})

export default router
