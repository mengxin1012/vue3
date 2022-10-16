<template>
    <div v-if="modelValue==STATUS.SKUFROM">
        skuFrom
        <el-button @click="emit('update:modelValue',1)">spulist</el-button>
    </div>
</template>

<script setup lang="ts">
import {defineEmits,defineProps} from 'vue'
import {STATUS} from "@/views/product/spu/index.vue";

const props=defineProps<{
    modelValue:number
}>()
const emit=defineEmits<{
    (e:'update:modelValue',status:number):void
}>()


</script>

<style scoped>

</style>
