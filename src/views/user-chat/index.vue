<template>
  <div class="user-chat">
    <van-nav-bar
      class="app-nav-bar"
      title="注册/登录"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="message-list">
      <van-cell :title='item' v-for="(item,index) in messages" :key='index'></van-cell>
    </van-cell-group>

    <van-cell-group class="send-message-wrap">
      <van-field
        v-model="message"
        placeholder="请输入消息"
        :border='false'
      />
      <van-button type="primary" size="small" @click="onSend">发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'
// 建立连接

// socket.emit('消息类型',消息内容)
export default {
  name: 'UserChat',
  data () {
    return {
      message: '',
      socket: null,
      messages: []
    }
  },
  watch: {
    messages () {
      // 数据改变影响视图更新这件事不是立即的
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  mounted () {
    this.scrollToBottom()
  },
  created () {
    this.socket = io('http://ttapi.research.itcast.cn')

    this.socket.on('connect', () => {
      console.log('连接建立成功了')
    })

    this.socket.on('disconnect', () => {
      console.log('断开连接了')
    })

    // 监听message
    this.socket.on('message', data => {
      this.messages.push(data)
    })
    window.socket = this.socket
  },
  methods: {
    onSend () {
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      this.messages.push(data)
    },
    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>
<style lang="less" scoped>
.message-list{
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;

}
.send-message-wrap{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 0 14px;
  align-items: center;
}
</style>
