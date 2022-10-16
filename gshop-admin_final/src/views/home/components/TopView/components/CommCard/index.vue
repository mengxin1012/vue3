<template>
 <el-card>
  <div class="title">{{title}}</div>
  <div class="count">{{count}}</div>
  <div class="view">
    <slot name="view"></slot>
  </div>
  <div class="line"></div>
  <div class="bottom">
    <slot name="bottom"></slot>
  </div>
 </el-card>
 
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'CommCard'
  })
</script>
<script lang="ts" setup>
  defineProps(['title','count'])
</script>

<style lang="less" scoped>
  .title{
    font-size: 12px;
    color: #bbb;
  }
  .count{
    margin-top: 5px;
    font-size: 26px;
    letter-spacing: 1px;
    // font-weight: bolder;
  }
  .view{
    height: 50px;
  } 
  .line{
    height: 2px;
    background-color: #aaa;
    margin: 10px 0;
  }
  .bottom{
    
    font-size: 12px;
    color: #bbb;
  }
</style>
