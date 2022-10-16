<template>
  <el-card>
    <el-table border :data="skuList">
      <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{ row, $index }">
          <el-image :src="row.skuDefaultImg" style="width:100px;height:60px"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="重量（KG）" prop="weight"></el-table-column>
      <el-table-column label="价格（元）" prop="price"></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template v-slot="{ row, $index }">
          <el-button v-if="row.isSale" type="success" size="small" icon="ele-Top" @click="cancelSale(row)" title="下架">
          </el-button>
          <el-button v-else type="info" size="small" icon="ele-Bottom" @click="onSale(row)" title="上架"></el-button>
          <el-button type="primary" size="small" icon="ele-Edit" @click="updateSku(row)" title="修改"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled" @click="showSkuInfo(row)" title="查看详情"></el-button>
          <el-button type="danger" size="small" icon="ele-Delete" @click="deleteSku(row)" title="删除sku"></el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination v-model:currentPage="page" v-model:page-size="limit" layout="prev, pager, next, jumper"
      :total="total" @current-change="getSkuList" />

    <el-drawer v-model="isShowSkuInfo" :with-header="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo?.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo?.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo?.price }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <div v-if="skuInfo?.skuAttrValueList && skuInfo?.skuAttrValueList.length > 0">
            <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo?.skuAttrValueList" :key="value.id">
              {{ value.attrName + '-' + value.valueName }}
            </el-tag>
          </div>
          <div v-else>无</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="18">
          <!-- <div v-if="skuInfo.skuSaleAttrValueList && skuInfo.skuSaleAttrValueList.length > 0"> -->
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuSaleAttrValueList"
            :key="value.id">
            {{ value.saleAttrName + '-' + value.saleAttrValueName }}
          </el-tag>
          <!-- </div> -->
          <!-- <div v-else>无</div> -->
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel class="sku-carousel" trigger="click" height="400px" style="width: 400px">
            <el-carousel-item v-for="item in skuInfo?.skuImageList" :key="item.id">
              <el-image :src="item.imgUrl" style="width: 100%;height: 100%;"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>


  </el-card>

</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: 'Sku'
})
</script>
<script lang="ts" setup>
import skuApi from '@/api/sku'
import type { SkuInfoData } from '@/api/sku'
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const skuList = ref<SkuInfoData[]>([])
const isShowSkuInfo = ref(false)
const skuInfo = ref<SkuInfoData>({
  price: 0,
  skuName: '',
  skuDesc: '',
  weight: '',
  skuDefaultImg: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
onMounted(() => {
  getSkuList()
})

const getSkuList = async (pager = 1) => {
  page.value = pager
  const result = await skuApi.getSkuPageList(page.value, limit.value)
  skuList.value = result.records
  total.value = result.total
}

const cancelSale = async (row: SkuInfoData) => {
  await skuApi.cancelSale(row.id as number)
  getSkuList()
}
const onSale = async (row: SkuInfoData) => {
  await skuApi.onSale(row.id as number)
  getSkuList()
}
const updateSku = (row: SkuInfoData) => {
  ElMessage.success('正在开发中！！！！')
}
const deleteSku = async (row: SkuInfoData) => {
  await skuApi.deleteSku(row.id as number)
  getSkuList()
}
const showSkuInfo = async (row: SkuInfoData) => {
  isShowSkuInfo.value = true
  skuInfo.value = await skuApi.getSkuInfo(row.id as number)
}

</script>

<style lang="less" scoped>
  .el-row{
    height: 40px;
    line-height: 40px;
    .el-col{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .el-col-5{
      font-size: 20px;
      font-weight: bolder;
      text-align: right;
      margin-right: 20px;
     
    }
  }
</style>
