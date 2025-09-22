import { View, Text, Image } from "@tarojs/components"
import { useMemo } from "react"
import { myImgBase } from "@/global/assets/images/imgBases"
import { actiStatus } from "@/global/utils/common"
import Taro from "@tarojs/taro"

import './index.scss'

interface starPropsType {
  grade: number //评分等级
}

function StarBar({ grade }: starPropsType) {
  const blankArr = useMemo(() => Array.from({ length: 5-grade }, (_, index) => index + 1), [grade])
  const gradeArr = useMemo(() => Array.from({ length: grade }, (_, index) => index + 1), [grade])
  return (
    <View className="star-bar">
      {gradeArr.map((_, index) => (
        <Image className="star" src={`${myImgBase}/fullStar.png`} key={`full-star-${index}`} />
      ))}
      {blankArr.map((_, index) => (
        <Image className="star" src={`${myImgBase}/blankStar.png`} key={`blank-star-${index}`} />
      ))}
    </View>
  )
}

export interface actiItemType {
  title: string
  season: number //第几期
  beginTime: string
  endTime: string
  imgHref?: string
  grade: number
  isFree?: boolean //付费/免费活动 暂废弃
  
  className?: string
  id: string
}

export default function ActiItem({ title, season, beginTime, endTime, imgHref, grade, className, id }: actiItemType) {
  const ImgHref = useMemo(() => imgHref ? imgHref : `${myImgBase}/defaultActi.png`, [imgHref])

  //TODO 判断时间逻辑
  const on = useMemo(() => actiStatus(beginTime, endTime), [beginTime, endTime]) //是否进行中
  const time = useMemo(() => {
    switch (on) {
      case 0: return endTime
      case 1:
      case 2: return beginTime
    }
  }, [on]) //显示哪个时间
  const onLabel = useMemo(() => {
    switch (on) {
      case 0: return '已结束'
      case 1: return '进行中'
      case 2: return '未开始'
    }
  },[on])

  //router
  const toDetail = () => Taro.navigateTo({ url: `/activityPkg/pages/detail/index?id=${id}` })

  return (
   <View className={`acti-item ${className}`}>
    <Image className="img" src={ImgHref} />
    <View className="middle-box">
      <View className="title-box">
        <Text>{title}</Text>
        <Text>第{season}期</Text>
      </View>
      <View className={["time-box", on === 1 ? "active-time" : ''].join(' ')}>
        <Text className="label">{onLabel}</Text>
        <Text>{time}</Text>
      </View>
      <StarBar grade={grade} />
    </View>
    <View className="detail" onClick={toDetail}><Text>详情</Text></View>
   </View> 
  )
}