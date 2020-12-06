/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store/'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router/'

const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      // console.log('转换失败', err)
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state

  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完注资后一定要把 config 返回，否则请求机会停在这里
  return config
}, async function (error) {
  const status = error.response.status
  if (status === 400) {
    // 客户端请求参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token 无效
    // 如果没有user或者user.token， 直接去登录
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转到登录页
      return redirectLogin()
    }
    // 如果有refresh_token，则请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      user.token = data.data.token
      store.commit('setUser', user)

      return request(error.config)
    } catch (err) {
      // 刷新token都失败了，直接跳转登录页
      return redirectLogin()
    }
    // 拿到新的token之后把它更新到容器中
    // 把失败的请求重新发出去
  } else if (status === 403) {
    // 没有操作权限
    Toast.fail('没有权限操作')
  } else if (status === 500) {
    // 服务端错误
    Toast.fail('服务端异常，请稍后重试')
  }
  // 任何超过2xx的状态码都会进入这里
  return Promise.reject(error)
})
function redirectLogin () {
  router.replace({
    name: 'login',
    // 查询参数会以问好作为分隔符放到url后面
    query: {
      // 数据名是自己起的
      redirect: router.currentRoute.fullPath
    }
  })
}
// 响应拦截器

// 导出
export default request
