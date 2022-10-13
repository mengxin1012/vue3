<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="appStore.device==='mobile'&&appStore.sidebar.opened" class="drawer-bg" 
      @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header': settingsStore.fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script lang="ts">
// 页面分布分为三块内容:
// sidebar - 左侧侧边栏 - 侧边栏显示用的递归组件实现的
// nav-bar - 顶部导航 - 需要修改"退出登录"的字样
// app-main - 主要显示区域 - component组件使用is属性实现的
export default {
  name: 'Layout'
}
</script>

<script lang="ts" setup>
  import {computed} from 'vue'
  import { Navbar, Sidebar, AppMain } from './components'
  import {useAppStore} from '@/stores/app'
  import {useSettingsStore} from '@/stores/settings'
  import { useResize } from '@/hooks/useResize'
  
  useResize()

  const appStore = useAppStore()
  const settingsStore = useSettingsStore()

  const classObj = computed(() => ({
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    withoutAnimation: appStore.sidebar.withoutAnimation,
    mobile: appStore.device === 'mobile'
  }))

  const handleClickOutside = () => {
    appStore.closeSidebar(false)
  }
</script>

<style lang="scss" scoped>
  @import "../styles/mixin.scss";
  // @import "../styles/variables.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
