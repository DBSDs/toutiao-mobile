import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/'
Vue.use(VueRouter)

// 路由表
const routes = [{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login/'),
  meta: { requiresAuth: false }
},
{
  path: '/',
  component: () => import('@/views/layout/'),
  children: [
    {
      path: '',
      name: 'home',
      component: () => import('@/views/home/'),
      meta: { requiresAuth: false }
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('@/views/qa/'),
      meta: { requiresAuth: false }
    },
    {
      path: '/video',
      name: 'video',
      component: () => import('@/views/video/'),
      meta: { requiresAuth: false }
    },
    {
      path: '/mime',
      name: 'mime',
      component: () => import('@/views/mime/'),
      meta: { requiresAuth: false }
    }
  ]
},
{
  path: '/search',
  name: 'search',
  component: () => import('@/views/search/'),
  meta: { requiresAuth: false }
},
{
  path: 'article/:articleId',
  name: 'article',
  component: () => import('@/views/article/'),
  meta: { requiresAuth: false },
  props: true
},
{
  path: '/user/profile',
  name: 'user-profile',
  component: () => import('@/views/user-profile'),
  meta: { requiresAuth: false }
},
{
  path: '/user/chat',
  name: 'user-chat',
  component: () => import('@/views/user-chat'),
  meta: { requiresAuth: true }
}]

const router = new VueRouter({
  routes
})

// to： 要访问的页面路由信息
// from: 来自哪个页面的路由信息
// next: 放行的标记
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.state.user) {
      return next()
    }
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗'
    }).then(() => {
      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }).catch(() => {
      // 取消了，停止路由导航
      next(false)
    })
  } else {
    next()
  }
})
export default router
