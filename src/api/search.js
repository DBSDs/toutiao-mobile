/**
 * 搜索请求相关模块
 */
import request from '@/utils/request'

/**
 * 获取联想结果
 */
export const getSearchSuggestions = q => {
  return request({
    methods: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}
/**
 * 获取搜索结果
 */
export const getSearchResults = params => {
  return request({
    methods: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
/**
 * 获取搜索用户历史
 */
export const getUserSearchHistories = () => {
  return request({
    methods: 'GET',
    url: '/app/v1_0/search/histories'
  })
}
