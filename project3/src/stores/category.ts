import { defineStore } from 'pinia';
import categoryApi, { type CategoryModel, type CategoryListModel } from '@/api/category'
import { ElMessage } from 'element-plus';

interface CategoryStoreModel {
  category1Id: number | undefined, // 联合类型
  category2Id: number | undefined,
  category3Id: number | undefined,
  category1List: CategoryListModel,
  category2List: CategoryListModel,
  category3List: CategoryListModel,
}

const initCategoryData = (): CategoryStoreModel => ({
  category1Id: undefined,
  category2Id: undefined,
  category3Id: undefined,
  category1List: [],
  category2List: [],
  category3List: [],
})

export const useCategoryStore = defineStore('category', {
  state: (): CategoryStoreModel => initCategoryData(),
  actions: {
    async getCategory1List() {
      try {
        let result = await categoryApi.getCategory1List();
        this.category1List = result;
      } catch (error) {
        console.error(error);
        ElMessage.error('获取一级分类列表失败')
        return Promise.reject(error);
      }
    },
    // 选择一级分类后,获取二级分类的数据,先清除掉二级分类的id,和三级分类的id,和三级分类的下拉列表
    async getCategory2List() {
      try {
        // 需要清除的数据
        this.category2Id = undefined;
        this.category3Id = undefined;
        this.category2List = [];
        this.category3List = [];
        // 重新获取数据
        let result = await categoryApi.getCategory2List(this.category1Id as number);
        this.category2List = result;
      } catch (error) {
        console.error(error);
        ElMessage.error('获取二级分类列表失败')
        return Promise.reject(error);
      }
    },
    // 二级分类选择后获取三级分类的数据,同时需要清除三级分类的id,三级分类需要重新选择
    async getCategory3List() {
      try {
        // 需要清除的数据
        this.category3Id = undefined;
        this.category3List = [];
        // 重新获取数据
        let result = await categoryApi.getCategory3List(this.category2Id as number);
        this.category3List = result;
      } catch (error) {
        console.error(error);
        ElMessage.error('获取三级分类列表失败')
        return Promise.reject(error);
      }
    },
  },
  getters: {}
})