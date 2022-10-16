<template>
  <div>
    <el-card>
      <CategorySelector :disabled="!isShowList"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <SpuList v-if="showState === 1" @updateShowState="updateShowState"></SpuList>
      <SpuForm v-else-if="showState === 2" @updateShowState="updateShowState" :initSpu="initSpu"></SpuForm>
      <SkuForm v-else @updateShowState="updateShowState" :initSpu="initSpu"></SkuForm>
    </el-card>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch} from 'vue';
  export default defineComponent({
    name:'Spu'
  })
</script>
<script lang="ts" setup>
  import SpuList from './components/SpuList/index.vue'
  import SpuForm from './components/SpuForm/index.vue'
  import SkuForm from './components/SkuForm/index.vue'
  import  type { SpuInfoData } from '@/api/spu'
  const isShowList = ref(true)
  const showState = ref(1)
  const initSpu = ref<SpuInfoData>({
    category3Id: '',
    description: '',
    spuImageList: [],
    spuName: '',
    spuSaleAttrList: [],
    tmId: '',
  })
  const updateShowState = (spuFormState:number,spu:SpuInfoData) => {
    console.log(spuFormState);
    showState.value = spuFormState;
    if(spu){
      initSpu.value = spu
    }else{
      initSpu.value = {
        category3Id: '',
        description: '',
        spuImageList: [],
        spuName: '',
        spuSaleAttrList: [],
        tmId: '',
      }
    }
  }

  watch(showState, (newVal,oldVal) => {
    newVal > 1?isShowList.value = false:isShowList.value = true
  })
</script>

<style lang="less" scoped>
</style>
