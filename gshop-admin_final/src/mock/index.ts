import Mock from 'mockjs'
import echartsData from './echartsData.json'
Mock.mock('/mock/getEchartsData',{
  code:200,
  data:echartsData
})