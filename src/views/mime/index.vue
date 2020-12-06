<template>
  <div class="my-container">
    <van-cell-group class="my-info" v-if="user">
      <van-cell center :border='false' class="base-info">
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{currentUser.name}}</div>
        <van-button size="small" class="update-btn" round to="/user/profile">编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border='false'>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <div v-else class="not-login">
      <div @click="$router.push({
        name: 'login',
        query: {
          redirect: '/mime'
        }
      })" >
        <i class="iconfont icon-shouji" src="" ></i>
      </div>
      <div class="text">登陆 / 注册</div>
    </div>
    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        icon-prefix="iconfont icon"
        icon="shoucang"
        text="收藏"
      ></van-grid-item>
      <van-grid-item
        icon-prefix="iconfont icon"
        icon="shizhong"
        text="历史"
      ></van-grid-item>
    </van-grid>
    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="/user/chat" />
    <van-cell v-if="user" class="logout-cell" title="退出登录" @click="onLogout" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'
export default {
  name: 'MyIndex',
  components: {},
  data () {
    return {
      currentUser: {} // 当前登陆用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadCurrentUser()
  },
  methods: {
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    },
    onLogout () {
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => { // 确认执行这里
        // 清除用户状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {

        })
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .my-info {
    background: url('./banner.jpg') no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-left: 11px;
      .avatar {
        box-sizing: border-box;
        width:66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 20px;
        color: #666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-warp {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
          font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
  .not-login{
    height: 180px;
    background: url('./banner.jpg') no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text{
      font-size: 14px;
      color: #fff;
    }
    .icon-shouji{
      background-color: #fff;
      border-radius: 100%;
      font-size: 36px;
      color: #156ab2;
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
