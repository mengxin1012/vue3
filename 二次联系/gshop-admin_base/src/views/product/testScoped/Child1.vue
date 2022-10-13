<template>
  <div>
    <h2>这是子组件</h2>
    <Child2></Child2>
  </div>
</template>

<script setup lang="ts">
import Child2 from './Child2.vue'


/*
1. 不加 scoped 的style标签设置样式是全局的
2. 加上 scoped 的style标签设置样式是给 当前组件 和 当前组件的子组件的根元素 设置样式
  通过给当前组件的所有标签 和 给子组件的根元素标签上添加了一个唯一的 哈希值来做区分的
  加了 scoped 到底做了什么事?
  当加了 scoped 之后 标签中增加了一个东西
    data-v-d63a1a50
    v-后面的内容是一个哈希值,为了保证唯一
    这个属性会给当前组件的所有标签 和 当前组件的子组件根节点加上
  
    此时的css长什么样子
    h2[data-v-d63a1a50] {
      color: pink;
    }
    这是一个属性选择器,只要符合这个选择器的标签都会应用样式
*/
</script>

<style scoped>
h2 {
  color: pink;
}

</style>