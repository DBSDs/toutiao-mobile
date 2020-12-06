<template>
  <div class="user-profile">
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    >
    </van-nav-bar>

    <van-cell title="头像" is-link center>
      <input
        type="file"
        hidden
        ref="file"
        accept="image/*"
        @change="onFileChange"
      />
      <van-image
        round
        width="30"
        height="30"
        fit="cover"
        :src="user.photo"
        @click="$refs.file.click()"
      />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isEditNameShow = true"
    />
    <van-cell title="性别" is-link :value="user.gender === '0' ? '男' : '女'" />
    <van-cell title="生日" is-link :value="user.birthday" />

    <van-popup
      v-model="isEditNameShow"
      position="top"
      :style="{ height: '100%' }"
    >
      <!-- v-model='user.name'
    1.默认传递一个名字叫value的数据
    :value='user.name'
    默认监听input事件 @input='user.name = $event'
    *v-model的本质还是父子组件通信，它仅仅是简化了父组件的使用

    2.v-model只能使用一次

    3.如果有多个数据需要保持同步，使用.sync 修饰符

    -->
      <update-name
        v-if="isEditNameShow"
        @close="isEditNameShow = false"
        :name="user.name"
        @update-name="user.name = $event"
      ></update-name>
    </van-popup>

    <!-- 修改头像 -->
    <van-popup class="photo-popup" v-model="isEditPhotoShow" position="bottom" style="height: 100%">
      <update-photo
        v-if="isEditPhotoShow"
        :file="previewImage"
        @close="isEditPhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './component/update-name'
import UpdatePhoto from './component/update-photo'
export default {
  name: 'UserProfile',
  data () {
    return {
      user: {},
      isEditNameShow: false,
      isEditPhotoShow: false,
      previewImage: null
    }
  },
  components: {
    UpdateName,
    UpdatePhoto
  },
  created () {
    this.loadUserProfile()
  },
  methods: {

    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange () {
      this.isEditPhotoShow = true
      const file = this.$refs.file.files[0]
      this.previewImage = file
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background-color: #f5f7f9;
}
.photo-popup{
  background-color: #000;
}
</style>
