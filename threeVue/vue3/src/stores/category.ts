import {defineStore} from "pinia";
import type {oneList,twoList,threeList} from "@/api/interfaces";
import api from "@/api/attrs";
interface cateModel{
    category1Id:undefined | number,
    category2Id:undefined | number,
    category3Id:undefined | number,
    categoryList:oneList[],
    category2List:twoList[],
    category3List:threeList[],
}
const categroys=()=>({
    category1Id:undefined,
    category2Id:undefined,
    category3Id:undefined,
    categoryList:[],
    category2List:[],
    category3List:[]
})

const userStore=defineStore('category',{
    state(){
        return {
            ...categroys()
        }
    },
    actions:{
        async getCate1(){
            try {
                const result=await api.getCategory1()
                this.categoryList=result
            }catch (e){
                return Promise.reject(e)
            }
        },
        async getCate2(){
            try {
                const result=await api.getCategory2(this.category1Id as number)
                console.log(result)
                this.category2List=result
            }catch (e){
                return Promise.reject(e)
            }
        },
        async getCate3(){
            try {
                const result=await api.getCategory3(this.category2Id as number)
                console.log(result)
                this.category3List=result
            }catch (e){
                return Promise.reject(e)
            }
        }
    },
    getters:{

    }
})
export default userStore