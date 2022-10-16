//token的接口类型
import {truncate} from "fs";

export interface tokenT{
    token:string
}
//用户数据的接口类型
export interface configType{
    avatar:string[],
    buttons:string[],
    roles:string[],
    routes:string[],
    name:string
}



//trademark 分液器数据类型
export interface trademarkList{
    id?:number,
    tmName:string,
    logoUrl:string
}
//转为数组类型
export type tradeMarkLists=trademarkList[]
//整个trade需要的数据类型
export interface tradeList{
    current:number,
    pages:number,
    records:tradeMarkLists,
    searchCount:boolean,
    total:number
}


// attr类型
export interface oneList{
    id:number,
    name:string
}
export type oneLists=oneList[]
//二级的类型
export interface twoList{
    category1Id:number
    id:number,
    name:string
}
export type twoLists=twoList[]
//三级的类型
export interface threeList{
    category2Id:number
    id:number,
    name:string
}
export type threeLists=threeList[]
//三级列表
export interface selectList{
    one:oneList,
    two:twoList,
    three:threeList
}




//attrValue类型
export interface attrValueType{
    attrId?:number,
    id?:number,
    valueName:string
    inputChange?:boolean
}
export type attrValueTypes=attrValueType[]
//attr类型
export interface attrType{
    attrName:string,
    attrValueList:attrValueTypes,
    categoryId:number,
    categoryLevel:number,
    id?:number
}
export type attrTypes=attrType[]




//sku接口类型
export interface skuList{
    current:number,
    pages:number,
    records:recordInfos,
    searchCount:boolean,
    size:number,
    total:number
}

//record接口类型
export interface recordInfo{
    category3Id:number,
    createTime:string,
    id:number,
    isSale:number,
    price:number,
    skuAttrValueList?:null
    skuDefaultImg?:null | string,
    skuDesc:string,
    skuImageList?:null,
    skuName:string,
    skuSaleAttrValueList:null,
    spuId:number,
    tmId:number,
    weight:string
}
export type recordInfos=recordInfo[]






// spu接口类型
export interface pageList{
    id?:number,
    pages:number,
    records:recordType[]
    searchCount:boolean,
    size:true,
    total:true,
}
export interface recordType{
    category3Id:number | undefined,
    description:string | undefined
    id?:number
    spuImageList:[] | null
    spuName:string
    spuSaleAttrList:[] | null
    tmId:number | undefined
}
//Trademark下拉框
export interface tradeMark{
    id?:number,
    logoUrl:string,
    tmName:string
}
export type tradeMarks=tradeMark[]
//SaleAttr下拉
export interface saleAttr{
    id:number,
    name:string
}
export type saleAttrs=saleAttr[]
//单个图片
export interface spuImgModel{
    imgName:string,
    name:string,
    imgUrl:string,
    url:string,
    response:any
}
//图片列表
export type spuImgModels=spuImgModel[]
//spusale数据
export interface spuSale{
    baseSaleAttrId: string | number
    saleAttrName:string
    saleAttrValueName:string,
    inputVisible?:boolean
}
//单个销售属性
export interface formSale{
    baseSaleAttrId: string | number
    saleAttrName:string,
    inputVisible?:boolean
    spuSaleAttrValueList?:spuSales
}
//销售属性列表
export type spuSales=spuSale[]
//收集表单的类型
export interface saveSale{
    category3Id:number | undefined,
    description:string | undefined
    id?:number
    spuImageList:spuImgModel[] | undefined
    spuName:string | undefined
    spuSaleAttrList:formSale[] | undefined
    tmId:number | undefined
}


