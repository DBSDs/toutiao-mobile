<template>
  <div class="article-list">
    <van-pull-refresh
    v-model="isPullDownLoading"
    :success-text='refreshSuccessText'
    :success-duration="1000"
    @refresh='onRefresh'
    >
      <van-list
      v-model="loading"
      :finished='finished'
      finished-text='没有更多了'
      @load="onLoad"
      >
      <article-item v-for="(item, index) in articles" :article='item' :key='index'/>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null,
      isPullDownLoading: false,
      refreshSuccessText: ''
    }
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onLoad () {
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })
      const { results } = data.data
      this.articles.push(...results)

      this.loading = false

      if (results.length !== 0) {
        this.timestamp = data.data.prettyprint
      } else {
        this.finished = true
      }
    },
    async onRefresh () {
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      const { results } = data.data
      this.articles.unshift(...data.data.results)
      this.isPullDownLoading = false
      this.refreshSuccessText = `更新了${results.length} 数据`
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
