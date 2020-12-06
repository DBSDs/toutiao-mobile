<template>
  <div class="update-photo">
    <img class="iamge" :src="image" ref="image">
    <van-nav-bar
    class="toolbar"
    left-text="取消"
    right-text="确认"
    @click-left="$emit('close')"
    @click-right='onConfirm'
    >
    </van-nav-bar>
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  props: {
    file: {
      required: true
    }
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null
    }
  },
  mounted () {
    // 获取需要裁切的图片DOM

    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    getCorppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCorppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      const file = await this.getCorppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // 如果要求Content-type 是multipart/form-data， 则一定要提交FormData数据对象,专门用于文件上传
      await updateUserPhoto(fd)
      this.$toast.success('保存成功')
      this.$emit('update-photo', window.URL.createObjectURL(file))
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}
.image {
  display: block;
  max-width: 100%;
}
</style>
