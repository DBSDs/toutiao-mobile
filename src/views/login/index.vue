<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册/登录"
      left-arrow
      @click-left="$router.back()"
    />

    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="iconfont icon"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        icon-prefix="iconfont icon"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down v-if="isCountDownShow" :time='1000 * 60' format="ss s" @finish='isCountDownShow = false'/>
          <van-button v-else size="small" type="primary" round @click.prevent="onSendSms" :loading='isSendSmsLoading'>发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-warp">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '17090086870',
        code: '246810'
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[1|3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false,
      isSendSmsLoading: false
    }
  },
  methods: {
    async onLogin () {
      Toast.loading({
        message: '登录中',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await login(this.user)

        // 清楚layout的缓存
        this.$store.commit('removeCachePage', 'LayoutIndex')
        Toast.success('登录成功')
        // 将后端返回的登录状态（token等数据）放到VueX容器中
        this.$store.commit('setUser', data.data)
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        Toast.fail('登录失败')
      }
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendSms () {
      try {
        await this.$refs['login-form'].validate('mobile')
        this.isSendSmsLoading = true
        await sendSms(this.user.mobile)
        this.isCountDownShow = true
      } catch (err) {
        let message = ''
        if (err && err.response && err.response.status === 429) {
          message = '发送太频繁了'
        } else if (err.name === 'mobile') {
          message = err.message
        } else {
          message = '发送失败'
        }
        this.$toast({
          message: message,
          position: 'top'
        })
      }
      this.isSendSmsLoading = false

      // 校验手机号码
      // 请求
      // 按钮倒计时
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .login-btn-warp {
    margin: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
