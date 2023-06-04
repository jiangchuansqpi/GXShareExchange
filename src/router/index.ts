import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/home/index.vue'
// import ElementUi from 'element-ui'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  /*const isLogin = localStorage.getItem('login')
  const loginTime = localStorage.getItem('loginTime')
  let diffTime = 0
  let diffTimeStatus = true
  if (loginTime) {
    diffTime = new Date().getTime() - parseInt(loginTime, 10)
    // 一周免登陆逻辑，首次登陆后，一周内免密登陆
    diffTimeStatus = diffTime < 1000 * 7 * 24 * 60 * 60 ? Boolean(1) : Boolean(0)
    // 测试用 10s 判断
    // diffTimeStatus = diffTime < 1000 * 10 ? true : false
  }
  if (isLogin === '1') { // 判断该路由是否需要登录权限
    // 如果需要就执行下面的代码
    // localStorage 获取当前的isLogin的值 将我们保存的isLogin的值赋给isLogin,isLogin是顺便取的名称，可以换
    // 我们在登录界面，我们使用请求，请求成功后，我们就使用localStorage为‘isLogin’保存一个值  1，如果请求失败，就不保存‘isLogin’的值
    // 如果请求成功，num的值就是1，请求失败就是null，所以下面进行判断
    if (diffTimeStatus) {
      // 如果登录了，就跳转到'/index'路径
      if (to.path === '/login') {
        next('/')
      } else {
        next()
      }
      // 可选更新，登陆过程中刷新页面，更新登陆时间戳
      localStorage.setItem('loginTime', (new Date() as any).getTime())
    } else {
      ElementUi.Message.error('登录已超过7天，请重新登录！！！！')
      // 取消已登陆标记
      localStorage.clear()
      next('/login')
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }*/

  // if (to.fullPath === '/' && localStorage.getItem('login') === '1') {
  //   next()
  // } else if (to.fullPath === '/login') {
  //   next()
  // } else {
  //   next({
  //     name: 'Login'
  //   })
  // }
  // if (to.fullPath !== '/login' && localStorage.getItem('login') === '1') {
  //   next('/')
  // } else {
  //   if (to.fullPath === '/login') {
  //     next()
  //   }
  //   next({ name: 'Login' })
  // }
  next()
})

export default router
