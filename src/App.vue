<template>
  <div id="app">
    <link href="//at.alicdn.com/t/font_2226966_5nt1r6f2kxk.css" rel="stylesheet" type="text/css"/>
      <keep-alive :include="[cachaePages]">
        <router-view/>
      </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachaePages'])
  }
}
</script>

<style lang="less">

</style>
