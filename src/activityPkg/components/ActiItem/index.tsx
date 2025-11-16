import { View, Text, Image } from "@tarojs/components"
import { useMemo } from "react"
import { myImgBase } from "@/global/assets/images/imgBases"
import { actiStatus } from "@/global/utils/common"
import Taro from "@tarojs/taro"
import { dateFormater } from "@/global/utils/common"

import './index.scss'
import { actiType } from "@/global/utils/api/activitycenter/activity"

// interface starPropsType {
//   grade: number //评分等级
// }
// function StarBar({ grade }: starPropsType) {
//   const blankArr = useMemo(() => Array.from({ length: 5-grade }, (_, index) => index + 1), [grade])
//   const gradeArr = useMemo(() => Array.from({ length: grade }, (_, index) => index + 1), [grade])
//   return (
//     <View className="star-bar">
//       {gradeArr.map((_, index) => (
//         <Image className="star" src={`${myImgBase}/fullStar.png`} key={`full-star-${index}`} />
//       ))}
//       {blankArr.map((_, index) => (
//         <Image className="star" src={`${myImgBase}/blankStar.png`} key={`blank-star-${index}`} />
//       ))}
//     </View>
//   )
// }

interface actiItemType extends actiType {
  className: string
  isAdmin?: boolean
}

export default function ActiItem({ title, starttime, endtime, coverurl, className, id, isAdmin }: actiItemType) {
  const coverUrl = useMemo(() => coverurl ? coverurl : `${myImgBase}/defaultActi.png`, [coverurl])

  const on = useMemo(() => actiStatus(starttime, endtime), [starttime, endtime]) //是否进行中
  const time = useMemo(() => {
    switch (on) {
      case 0: return dateFormater(endtime, 'YYYY-MM-DD')
      case 1:
      case 2: return dateFormater(starttime, 'YYYY-MM-DD')
    }
  }, [on]) //显示哪个时间
  const onLabel = useMemo(() => {
    switch (on) {
      case 0: return '已结束'
      case 1: return '进行中'
      case 2: return isAdmin ? '待发布' : '未开始'
    }
  },[on])

  //router
  const toDetail = () => Taro.navigateTo({ url: `/activityPkg/pages/detail/index?id=${id}` })

  return (
   <View className={`acti-item ${className}`}>
    <Image className="img" src={coverUrl} />
    <View className="middle-box">
      <Text className="title">{title}</Text>
      <View className={["time-box", on === 1 ? "active-time" : ''].join(' ')}>
        <Text className="label">{onLabel}</Text>
        { !isAdmin && <Text>{time}</Text>}
      </View>
      {/* <StarBar grade={grade} /> */}
    </View>
    <View className="detail" onClick={toDetail}><Text>详情</Text></View>
   </View> 
  )
}