//token的接口类型
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

