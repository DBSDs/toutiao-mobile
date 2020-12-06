<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        icon="search"
        type="info"
        round
        size="small"
        class="search-btn"
        to="/search"
        >搜索
      </van-button>
    </van-nav-bar>

    <!-- 文章频道列表 -->
    <van-tabs v-model="active" class="channel-tabls">
      <van-tab
        class="table-item"
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id"
        ><article-list :channel="channel"
      /></van-tab>
      <!-- 汉堡按钮定位把列表最后的位置给挡住了，解决办法就是在这里添加一个占位元素 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div
        slot="nav-right"
        @click="isChannelEditShow = true"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- 弹出层-文章频道 -->
    <van-popup
      v-model="isChannelEditShow"
      position="top"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    ><channel-edit :active='active' :user-channels='channels' @close='isChannelEditShow = false' @update-active='active = $event'/>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './component/article-list'
import ChannelEdit from './component/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: { ArticleList, ChannelEdit },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      if (this.user) {
        const { data } = await getUserChannels()
        this.channels = data.data.channels
      } else {
        const localChannel = getItem('user-channels')
        if (localChannel) {
          this.channels = localChannel
        } else {
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  /deep/ .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .channel-tabls {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      width: 15px !important;
      height: 3px;
      background: #3296fa;
    }
  }
  .channel-edit-popup {
    height: 100%;
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    height: 44px;
    line-height: 44px;
    background-color: #fff;
    opacity: 0.9;
    width: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-icon {
      font-size: 24px;
    }
  }
  .wap-nav-placeholder {
    width: 33px;
    flex-shrink: 0;
  }
}
</style>
