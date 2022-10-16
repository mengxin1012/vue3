<template>
  测试111
  <el-button type="primary" v-has="'btn.Add1'">添加</el-button>
  <el-button type="warning" v-has="'btn.Add2'">修改</el-button>
  <el-button type="danger" v-has="'btn.Test1.remove'">删除</el-button>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'Test1'
  })
</script>
<script lang="ts" setup>
</script>

<style lang="less" scoped>
</style>
