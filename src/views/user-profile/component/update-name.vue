<template>
  <div class="update-name">
    <van-nav-bar
      title="修改昵称"
      left-text="返回"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    >
    </van-nav-bar>

    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textare"
        maxlength="7"
        placeholder="请输入资料"
        show-word-limit
      >
      </van-field>
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  data () {
    return {
      localName: this.name
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        await updateUserProfile({
          name: this.localName
        })
        this.$toast.success('保存成功')
        this.$('update-name', this.localName)
        this.$emit('close')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.name-field-wrap {
  padding: 10px;
}
</style>
