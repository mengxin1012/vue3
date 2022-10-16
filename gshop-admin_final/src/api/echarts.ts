import mockRequest from '@/utils/mockRequest'

interface OrderRankData {
  no: number,
  name: string,
  count: string
}
interface UserRankData extends OrderRankData { }

interface SearchWordData {
  word: string,
  count: number,
  user: number
}

interface CategoryData {
  axisX: string[],
  data1: number[]
}
interface GoodsData extends CategoryData {}

type SaleRankData = {
  category: CategoryData,
  goods: GoodsData
}


export type EchartsData = {
  //1: "今日销售额",
  salesToday: number,
  salesLastDay: number,
  salesGrowthLastDay: number,
  salesGrowthLastMonth: number,

  //2: "今日订单量",
  orderToday: number,
  orderLastDay: number,
  orderTrend: number[],
  orderTrendAxis: number[],

  //3: "今日交易用户数",
  orderUser: number,
  returnRate: number,
  orderUserTrend: number[],
  orderUserTrendAxis: string[],

  //4: "累计用户数",
  usersTotal: number,
  usersLastDay: number,
  usersLastMonth: number,
  userGrowthLastDay: string,
  userGrowthLastMonth: string,


  //5: "销售额与访问量",
  orderFullYearAxis: string[],
  orderFullYear: number[],
  userFullYearAxis: string[],
  userFullYear: number[],

  //6: "排行榜",


  orderRank: OrderRankData[],
  userRank: UserRankData[],

  //7: "关键字搜索",
  searchWord: SearchWordData[],
  //8: "分类销售排行",
  saleRank: SaleRankData
}

export default {
  getEchartsData() {
    return mockRequest.get<any,EchartsData>('/getEchartsData')
  }
}