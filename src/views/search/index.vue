<template>
  <div class="search-containner">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" @search='onSearch($event)'/>
    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search='onSearch'/>
    <!-- 历史记录 -->
    <search-history :search-histories='searchHistories' @search='onSearch' @update-histories='searchHistories =$event' v-else />
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getUserSearchHistories } from '@/api/search'
import { mapState } from 'vuex'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果
      searchHistories: []
    }
  },
  created () {
    this.loadSearchHistories()
  },
  computed: {
    ...mapState(['user'])
  },
  components: { SearchSuggestion, SearchHistory, SearchResult },
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    onSearch (searchText) {
      this.searchText = searchText
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(searchText)

      setItem('search-histories', this.searchHistories)

      this.isResultShow = true
    },
    async loadSearchHistories () {
      const localHistories = getItem('search-histories') || []
      if (this.user) {
        // const { data } = await getUserSearchHistories()
        // this.searchHistories = [...new Set([...localHistories, ...data.data.keywords])]
      } else {
      }
      this.searchHistories = localHistories
    },
    onCancel () {}
  }
}
</script>

<style lang="less" scoped>
</style>
