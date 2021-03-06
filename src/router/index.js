import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login' );
const Home = () => import('views/home/Home' );
const Welcome = () => import('views/welcome/Welcome' );
const Users = () => import('views/users/Users' );
const Rights = () => import('views/power/Rights' );
const Roles = () => import('views/power/Roles' );
const Category = () => import('views/goods/Category' );
const Params = () => import('views/goods/Params' );
const GoodsList = () => import('views/goods/List' );
const AddGoods = () => import('views/goods/Add' );
const Orders = () => import('views/orders/Orders' );
const Report = () => import('views/report/Report' );

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: 'login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home',  name: 'Home',  component: Home, redirect: '/welcome',
    children:[
      { path: '/welcome',  name: 'Welcome',  component: Welcome, },
      { path: '/users',  name: 'Users',  component: Users, },
      { path: '/rights',  name: 'Rights',  component: Rights, },
      { path: '/roles',  name: 'Roles',  component: Roles, },
      { path: '/categories',  name: 'Category',  component: Category, },
      { path: '/params',  name: 'Params',  component: Params, },
      { path: '/goods',  name: 'GoodsList',  component: GoodsList, },
      { path: '/goods/add',  name: 'AddGoods',  component: AddGoods, },
      { path: '/orders',  name: 'Orders',  component: Orders, },
      { path: '/reports',  name: 'Report',  component: Report, },
    ]  
  },
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
