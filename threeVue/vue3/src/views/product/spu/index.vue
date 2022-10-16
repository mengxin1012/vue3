<template>
    <div>
        <!--    三级分类-->
        <CateGory></CateGory>
        <el-card>
            <SKUFROM v-model="showPage"></SKUFROM>
            <SPUFROM v-model="showPage" v-if="STATUS.SPUFROM==showPage"></SPUFROM>
            <SPULIST v-model="showPage" v-if="STATUS.SPULIST==showPage"></SPULIST>
        </el-card>

    </div>
</template>

<script lang="ts">
export enum STATUS {
    SPULIST=1,
    SPUFROM=2,
    SKUFROM=3,
}
</script>
<script setup lang="ts">
import SKUFROM from './components/skuFrom/index.vue'
import SPUFROM from './components/spuFrom/index.vue'
import SPULIST from './components/spuList/index.vue'
import {ref} from "vue";
const showPage=ref(1)
</script>

<style scoped>

</style>