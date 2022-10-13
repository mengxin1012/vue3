<template>
  <section class="app-main">
    
    <!-- router-view 作用域插槽拿到 Component 是配置的路由组件,就是路由对象中配置的 component 属性 -->
    <router-view v-slot="{ Component }" :key="$route.path">
      <transition name="fade-transform" mode="out-in">
        <!-- 
          component组件是一个万能组件,显示哪个组件根据 is绑定的内容显示
          is帮定哪个组件显示哪个组件
        -->
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
  export default {
    name: 'AppMain'
  }
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  padding: 20px;
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
